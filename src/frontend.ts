import { INTERNAL_ERROR, METHOD_NOT_FOUND } from "./errors";
import { JSONRPCRequest } from "./types";
import { isJSONRPCResponse, isWindowMessage, listenForMessages, sendMessage } from "./utils";

export class IframeRPC {
  constructor(private iframeElement: HTMLIFrameElement) {}

  handshake() {
    return new Promise<boolean>((resolve) => {
      const timer = setInterval(() => {
        sendMessage(this.iframeElement.contentWindow, { type: "IFRAME_RPC_HANDSHAKE" });
      }, 500);

      const cleanListener = listenForMessages((message) => {
        if (isWindowMessage(message)) {
          if (message.type === 'IFRAME_RPC_HANDSHAKE') {
            clearInterval(timer);
            cleanListener();
            
            resolve(true);
          }
        }
      });
    });
  }

  createFrontend<Type extends object>() {
    return new Proxy<Type>({} as Type, {
      get: (_, property) => {
        return (...args) => {
          return new Promise<any>((resolve, reject) => {
            const rpcRequest = new JSONRPCRequest(property, args);
  
            sendMessage(this.iframeElement.contentWindow, rpcRequest);
  
            const timer = setTimeout(() => {
              reject({ code: 408, data: "request timed out", rpcRequest });
            }, 5000);
  
            listenForMessages((rpcResponse) => {
              if (isJSONRPCResponse(rpcResponse)) {
                  // we want to match response to the right request
                  if (rpcResponse.id !== rpcRequest.id) return;

                  if (rpcResponse.result) {
                      resolve(rpcResponse.result);
                  } else if (rpcResponse.error) {
                      clearTimeout(timer);

                      throw new Error(rpcResponse.error.message);
                  }

                  resolve(null);
              }
  
              clearTimeout(timer);
            }, true);
          })
        }
      }
    });
  }
}

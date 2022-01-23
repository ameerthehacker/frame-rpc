import { JSONRPCRequest } from './types';
import {
  isJSONRPCResponse,
  isWindowMessage,
  listenForMessages,
  sendMessage,
} from './utils';

export class IframeRPC {
  constructor(private backendWindow: Window) {}

  handshake() {
    return new Promise<boolean>((resolve) => {
      const timer = setInterval(() => {
        sendMessage(this.backendWindow, {
          type: 'IFRAME_RPC_HANDSHAKE',
        });
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
        return (...args: any[]) => {
          return new Promise<any>((resolve, reject) => {
            const rpcRequest = new JSONRPCRequest(property, args);

            const timer = setTimeout(() => {
              reject({
                code: 408,
                data: 'request timed out',
                rpcRequest,
              });
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

            sendMessage(this.backendWindow, rpcRequest);
          });
        };
      },
    });
  }
}

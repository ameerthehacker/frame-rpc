import { INTERNAL_ERROR, METHOD_NOT_FOUND } from "./errors";
import { JSONRPCResponse } from "./types";
import { isJSONRPCRequest, isWindowMessage, listenForMessages, sendMessage } from "./utils";

export function createBackend<Type>(target: Type) {
  listenForMessages(async (message) => {
    if (isWindowMessage(message)) {
      if (message.type === 'IFRAME_RPC_HANDSHAKE') {
        sendMessage(window.parent, { type: 'IFRAME_RPC_HANDSHAKE' });
      }
    }
 
    if (isJSONRPCRequest(message)) {
      let looseTarget = target as any;

      if (looseTarget[message.method as any]) {
        try {
          const result = await looseTarget[message.method as any](...message.params);

          sendMessage(window.parent, new JSONRPCResponse(message.id, result));
        } catch (err) {
          sendMessage(window.parent, new JSONRPCResponse(message.id, null, {
            code: INTERNAL_ERROR,
            message: err.message
          }));
        }
      } else {
        sendMessage(window.parent, new JSONRPCResponse(message.id, null, {
          code: METHOD_NOT_FOUND,
          message: `method ${message.method} not found`
        }));
      }
    }
  });

  sendMessage(window.parent, { type: 'IFRAME_RPC_HANDSHAKE' });
}

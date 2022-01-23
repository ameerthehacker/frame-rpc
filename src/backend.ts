import { INTERNAL_ERROR, METHOD_NOT_FOUND } from "./errors";
import { JSONRPCResponse } from "./types";
import { isJSONRPCRequest, isWindowMessage, listenForMessages, sendMessage } from "./utils";

let hanshakeCount = 0;

export function createBackend<Type>(
    target: Type,
    frontendWindow = window.parent
) {
    listenForMessages(async (message) => {
        if (isJSONRPCRequest(message)) {
            let looseTarget = target as any;

            if (looseTarget[message.method as any]) {
                try {
                    const result = await looseTarget[message.method as any](
                        ...message.params
                    );

                    sendMessage(
                        frontendWindow,
                        new JSONRPCResponse(message.id, result)
                    );
                } catch (err) {
                    sendMessage(
                        frontendWindow,
                        new JSONRPCResponse(message.id, null, {
                            code: INTERNAL_ERROR,
                            message: err.message,
                        })
                    );
                }
            } else {
                sendMessage(
                    frontendWindow,
                    new JSONRPCResponse(message.id, null, {
                        code: METHOD_NOT_FOUND,
                        message: `method ${message.method} not found`,
                    })
                );
            }
        } else if (isWindowMessage(message)) {
            // we sen't and recieved a handshake successfully
            // if we don't do this we will be in an infinite loop 😢
            if (message.type === "IFRAME_RPC_HANDSHAKE" && hanshakeCount <= 2) {
                sendMessage(frontendWindow, { type: "IFRAME_RPC_HANDSHAKE" });

                hanshakeCount++;
            }
        }
    });

    sendMessage(frontendWindow, { type: "IFRAME_RPC_HANDSHAKE" });
}

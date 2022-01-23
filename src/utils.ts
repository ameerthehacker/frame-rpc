import { JSONRPCResponse, JSONRPCRequest, WindowMessage } from './types';

export function sendMessage(
  target: Window,
  rpcRequest: JSONRPCRequest | JSONRPCResponse | WindowMessage,
  targetOrigin = '*'
) {
  target.postMessage(rpcRequest, targetOrigin);
}

export function listenForMessages(
  cb: (rpcRequest: JSONRPCRequest | JSONRPCResponse | WindowMessage) => void,
  once?: boolean,
  target = window
) {
  const eventListener = (evt: MessageEvent<any>) => cb(evt.data);

  target.addEventListener('message', eventListener, { once });

  return () => target.removeEventListener('message', eventListener);
}

export function isJSONRPCRequest(
  message: JSONRPCRequest | JSONRPCResponse | WindowMessage
): message is JSONRPCRequest {
  return (message as JSONRPCRequest).method !== undefined;
}

export function isJSONRPCResponse(
  message: JSONRPCRequest | JSONRPCResponse | WindowMessage
): message is JSONRPCResponse {
  return !isJSONRPCRequest(message);
}

export function isWindowMessage(
  message: JSONRPCRequest | JSONRPCResponse | WindowMessage
): message is WindowMessage {
  return (message as WindowMessage).type !== undefined;
}

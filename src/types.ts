export class JSONRPCRequest {
  public static nextId: number = 0;
  public id: number;
  public jsonrpc: string = '2.0';

  constructor(public method: string | Symbol, public params: string[] = []) {
    this.id = JSONRPCRequest.nextId++;
  }
}

export class JSONRPCResponse {
  public jsonrpc: string = '2.0';

  constructor(
    public id: number,
    public result?: any,
    public error?: { code: number; message: string; data?: any }
  ) {
    JSONRPCRequest.nextId++;
  }
}

export interface WindowMessage {
  type: 'IFRAME_RPC_HANDSHAKE';
}

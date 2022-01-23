export interface SampleRPCContract {
  say: (message: string) => void;
  add: (num1: number, num2: number) => number;
  throwError: () => Error;
}

export interface IframeToMain {
  say: (message: string) => void;
}

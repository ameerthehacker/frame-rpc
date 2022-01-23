export interface SampleRPCContract {
  say(message: string);
  add(num1: number, num2: number);
  throwError();
}

export interface IframeToMain {
    say: (message: string) => void;
}

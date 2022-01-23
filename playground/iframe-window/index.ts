import { createBackend, IframeRPC } from '../../src';
import { IframeToMain, SampleRPCContract } from '../common/types';

createBackend<SampleRPCContract>({
  say: (message) => {
    document.getElementById('message')!.innerText = message;
  },
  add: (num1, num2) => num1 + num2,
  throwError: () => {
    throw new Error("I'm not that happy!");
  },
});

(async () => {
  const iframeRPC = new IframeRPC(window.parent);

  await iframeRPC.handshake();

  const iframeToMainRPC = iframeRPC.createFrontend<IframeToMain>();

  document
    .getElementById('send-message')
    ?.addEventListener('click', async () => {
      await iframeToMainRPC.say('hello from iframe');
    });
})();

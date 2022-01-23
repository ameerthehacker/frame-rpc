# Frame RPC

Iframe/Window communications using post messages is such a pain in the arse

- Manage handshakes
- We don't get strong contract
- Write never ending switch statements

This reimagines Iframe communication using JSON RPC. What if you can just call a function to do something in your iframe without thinking in terms of postmessages and get something back without thinking about listening for messages?

## Demo

Play with sandbox [here](https://codesandbox.io/s/frame-rpc-main-window-m3mnx?file=/src/App.tsx)

## How to use it?

### In the Iframe application

```js
import { createBackend } from '@ameerthehacker/frame-rpc';

createBackend({
  add: (num1, num2) => {
    return num1 + num2;
  },
});
```

### In the main application

```js
import { FrameRPC } from '@ameerthehacker/frame-rpc';

const iframeElement = document.getElementById('iframe-element');
const iframeRPC = new IframeRPC(iframeElement.contentWindow);

await iframeRPC.handshake();

const result = await iframeRPC.add(2, 5);

// will print 7 😃
console.log(result);
```

You can have strong contracts using typescript generic and you can refer to the code in playground for samples.

### Try locally

```
yarn
yarn start
```

## License

MIT © [Ameer Jhan](mailto:ameerjhanprof@gmail.com)

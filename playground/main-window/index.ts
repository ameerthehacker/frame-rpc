import { IframeRPC } from "../../src";
import { SampleRPCContract } from "../common/types";

(async () => {
    const iframeElement = document.getElementById(
        "iframe-element"
    ) as HTMLIFrameElement;

    if (iframeElement) {
        const iframeRPC = new IframeRPC(iframeElement);

        await iframeRPC.handshake();

        const sampleRPC = iframeRPC.createFrontend<SampleRPCContract>();

        // one way communication
        document.getElementById("btn-send").addEventListener("click", () => {
            const text = (
                document.getElementById("message-text") as HTMLInputElement
            ).value;

            sampleRPC.say(text);
        });

        // we get some result back from iframe yay!!
        document
            .getElementById("btn-add")
            .addEventListener("click", async () => {
                alert(`2 + 2 = ${await sampleRPC.add(2, 2)}`);
            });

        // we call a method which throws an error
        document
            .getElementById("btn-error-iframe")
            .addEventListener("click", async () => {
                await sampleRPC.throwError();
            });

        document
            .getElementById("btn-method-notfound")
            .addEventListener("click", async () => {
                await (sampleRPC as any).lola();
            });
    } else {
        throw new Error("iframe element not found");
    }
})();

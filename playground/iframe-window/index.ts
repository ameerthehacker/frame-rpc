import { createBackend } from "../../src";
import { SampleRPCContract } from "../common/types";

createBackend<SampleRPCContract>({
    say: (message) => {
        document.getElementById("message").innerText = message;
    },
    add: (num1, num2) => num1 + num2,
    throwError: () => {
        throw new Error("I'm not that happy!");
    },
});

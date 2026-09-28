import Reveal from "reveal.js";
import RevealHighlight from "reveal.js/plugin/highlight";
import RevealMarkdown from "reveal.js/plugin/markdown";
import RevealNotes from "reveal.js/plugin/notes";
import {buildSlides} from "./slides";

export async function initDeck(): Promise<void> {
    buildSlides();

    await Reveal.initialize({
        hash: true,
        slideNumber: "c/t",
        progress: true,
        controls: true,
        center: false,
        width: 1280,
        height: 720,
        margin: 0.04,
        transition: "fade",
        plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
    });
}

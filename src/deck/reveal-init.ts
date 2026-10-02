import Reveal from "reveal.js";
import RevealMarkdown from "reveal.js/plugin/markdown";
import RevealNotes from "reveal.js/plugin/notes";
import {buildSlides} from "./slides";
import {initSurfaces} from "./surface-3d";

export async function initDeck(): Promise<void> {
    buildSlides();

    await Reveal.initialize({
        hash: false,
        slideNumber: "c/t",
        progress: true,
        controls: true,
        center: false,
        width: 1280,
        height: 720,
        margin: 0.04,
        transition: "fade",
        plugins: [RevealMarkdown, RevealNotes],
    });

    initSurfaces();
}

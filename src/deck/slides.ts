import intro from "../slides/00-intro.md?raw";
import fourPositions from "../slides/01-four-positions.md?raw";
import strategies from "../slides/02-strategies.md?raw";
import outro from "../slides/03-outro.md?raw";

const parts: string[] = [intro, fourPositions, strategies, outro];

export function buildSlides(): void {
    const root = document.getElementById("slides-root");
    if (!root) return;

    for (const markdown of parts) {
        const section = document.createElement("section");
        section.setAttribute("data-markdown", "");
        section.textContent = markdown;
        root.appendChild(section);
    }
}

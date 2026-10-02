import Reveal from "reveal.js";
import type {OptionType} from "../calculator/types";
import type {SurfaceHandle} from "./surface-scene";

const handles = new WeakMap<HTMLElement, SurfaceHandle>();

function bindControls(container: HTMLElement, handle: SurfaceHandle): void {
    const wrap = container.closest(".surface-wrap");
    if (!wrap) return;
    const buttons = wrap.querySelectorAll<HTMLButtonElement>("[data-surface-type]");
    for (const button of buttons) {
        button.addEventListener("click", () => {
            handle.setType(button.dataset.surfaceType as OptionType);
            for (const other of buttons) other.classList.toggle("is-active", other === button);
        });
    }
}

async function mount(container: HTMLElement): Promise<SurfaceHandle> {
    const existing = handles.get(container);
    if (existing) return existing;
    // three.js 好大，只喺去到嗰版先 load
    const {createSurface} = await import("./surface-scene");
    const created = handles.get(container);
    if (created) return created;
    const handle = createSurface(container, () => Reveal.getScale());
    handles.set(container, handle);
    bindControls(container, handle);
    return handle;
}

async function sync(): Promise<void> {
    const current = Reveal.getCurrentSlide();
    for (const container of document.querySelectorAll<HTMLElement>(".surface-3d")) {
        if (current?.contains(container)) {
            const handle = await mount(container);
            if (Reveal.getCurrentSlide()?.contains(container)) handle.start();
        } else {
            handles.get(container)?.stop();
        }
    }
}

export function initSurfaces(): void {
    if (document.documentElement.classList.contains("print-pdf")) return;
    Reveal.on("ready", () => void sync());
    Reveal.on("slidechanged", () => void sync());
    if (Reveal.isReady()) void sync();
}

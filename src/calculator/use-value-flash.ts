import React from "react";
import {prefersReducedMotion} from "./motion-preference";

/**
 * 監察數值變化：target 一改變就回 true，指定時間後自動回落 false，
 * 方便喺 CSS 加一下「啱啱更新」嘅閃光。
 *
 * 用 layout effect 而唔係普通 effect，係為咗喺瀏覽器繪製之前就加好 class，
 * 唔會見到一格未閃嘅舊樣。
 */
export function useValueFlash(target: number, duration = 620): boolean {
    const [flashing, setFlashing] = React.useState(false);
    const previous = React.useRef(target);
    const timer = React.useRef(0);

    React.useLayoutEffect(() => {
        if (Object.is(previous.current, target)) return;
        previous.current = target;
        if (prefersReducedMotion()) return;
        setFlashing(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setFlashing(false), duration);
    }, [target, duration]);

    React.useEffect(() => () => window.clearTimeout(timer.current), []);

    return flashing;
}

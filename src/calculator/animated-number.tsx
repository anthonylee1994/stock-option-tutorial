import React from "react";
import {formatNumber, formatPercent} from "./format";

const DURATION = 480;

function prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

/**
 * 由上一個值滾動到 target（ease-out），第一次 mount 由 0 開始數上去。
 */
export function useTweenedNumber(target: number, duration = DURATION): number {
    const [value, setValue] = React.useState(0);
    const valueRef = React.useRef(0);

    React.useEffect(() => {
        const from = valueRef.current;
        if (!Number.isFinite(target) || !Number.isFinite(from) || prefersReducedMotion()) {
            valueRef.current = target;
            setValue(target);
            return;
        }
        if (from === target) return;

        const start = performance.now();
        let frame = 0;
        const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const next = progress >= 1 ? target : from + (target - from) * easeOutCubic(progress);
            valueRef.current = next;
            setValue(next);
            if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target, duration]);

    return value;
}

interface AnimatedNumberProps {
    value: number;
    digits?: number;
    percent?: boolean;
    suffix?: string;
}

export const AnimatedNumber = React.memo((props: AnimatedNumberProps) => {
    const {value, digits = 4, percent = false, suffix = ""} = props;
    const tweened = useTweenedNumber(value);
    const text = percent ? formatPercent(tweened, digits) : formatNumber(tweened, digits);
    return (
        <React.Fragment>
            {text}
            {suffix}
        </React.Fragment>
    );
});

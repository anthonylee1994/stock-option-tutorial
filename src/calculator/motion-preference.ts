/** 補間動畫時長（毫秒） */
export const TWEEN_DURATION = 480;

/** 用戶要求減少動態效果時，全部補間／閃光都要即刻到位 */
export function prefersReducedMotion(): boolean {
    return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
}

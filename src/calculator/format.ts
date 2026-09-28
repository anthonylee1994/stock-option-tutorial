export function formatNumber(value: number, digits = 4): string {
    if (!Number.isFinite(value)) return "—";
    return value.toFixed(digits);
}

export function formatPercent(value: number, digits = 2): string {
    if (!Number.isFinite(value)) return "—";
    const fixed = value.toFixed(digits);
    return value > 0 ? `+${fixed}%` : `${fixed}%`;
}

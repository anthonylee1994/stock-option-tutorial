import type {Greeks, PriceInput} from "./types";

export interface TreeValue {
    price: number;
    delta: number;
    gamma: number;
}

function intrinsic(input: PriceInput): number {
    return input.optionType === "call" ? Math.max(input.spot - input.strike, 0) : Math.max(input.strike - input.spot, 0);
}

/**
 * Cox-Ross-Rubinstein 二叉树（美式，含提前行权）。
 * Delta / Gamma 直接由树的首两层读取，避免定点差分落在结点的线性段而得出 0。
 */
export function crrTree(input: PriceInput, steps: number): TreeValue {
    const {optionType, spot, strike, years, rate, vol} = input;
    if (years <= 0 || vol <= 0 || steps < 2) {
        const value = intrinsic(input);
        return {price: value, delta: 0, gamma: 0};
    }

    const isCall = optionType === "call";
    const dt = years / steps;
    const up = Math.exp(vol * Math.sqrt(dt));
    const down = 1 / up;
    const growth = Math.exp(rate * dt);
    const disc = 1 / growth;
    const p = (growth - down) / (up - down);

    const values = new Array<number>(steps + 1);
    for (let i = 0; i <= steps; i++) {
        const s = spot * Math.pow(up, i) * Math.pow(down, steps - i);
        values[i] = Math.max(isCall ? s - strike : strike - s, 0);
    }

    let levelTwo: number[] = [0, 0, 0];
    let levelOne: number[] = [0, 0];

    for (let step = steps - 1; step >= 0; step--) {
        for (let i = 0; i <= step; i++) {
            const continuation = disc * (p * values[i + 1] + (1 - p) * values[i]);
            const s = spot * Math.pow(up, i) * Math.pow(down, step - i);
            const exercise = isCall ? s - strike : strike - s;
            values[i] = Math.max(continuation, exercise);
        }
        if (step === 2) levelTwo = values.slice(0, 3);
        if (step === 1) levelOne = values.slice(0, 2);
    }

    const sUp = spot * up;
    const sDown = spot * down;
    const delta = (levelOne[1] - levelOne[0]) / (sUp - sDown);

    const sUU = spot * up * up;
    const sUD = spot;
    const sDD = spot * down * down;
    const deltaUp = (levelTwo[2] - levelTwo[1]) / (sUU - sUD);
    const deltaDown = (levelTwo[1] - levelTwo[0]) / (sUD - sDD);
    const gamma = (deltaUp - deltaDown) / ((sUU - sDD) / 2);

    return {price: values[0], delta, gamma};
}

export function crr(input: PriceInput, steps: number): number {
    return crrTree(input, steps).price;
}

export function computeGreeks(input: PriceInput, steps = 150): Greeks {
    const priceFn = (candidate: PriceInput) => crr(candidate, steps);
    const base = priceFn(input);

    const volStep = 0.001;
    const volUp = priceFn({...input, vol: input.vol + volStep});
    const volDown = priceFn({...input, vol: Math.max(input.vol - volStep, volStep)});
    const vega = (volUp - volDown) / (2 * volStep) / 100;

    const day = 1 / 365;
    const theta = priceFn({...input, years: Math.max(input.years - day, 0)}) - base;

    const rateStep = 0.0001;
    const rateUp = priceFn({...input, rate: input.rate + rateStep});
    const rateDown = priceFn({...input, rate: input.rate - rateStep});
    const rho = (rateUp - rateDown) / (2 * rateStep) / 100;

    const tree = crrTree(input, steps);
    return {delta: tree.delta, gamma: tree.gamma, vega, theta, rho};
}

export function calcYears(from: string, to: string): number {
    const start = new Date(from).getTime();
    const end = new Date(to).getTime();
    if (!Number.isFinite(start) || !Number.isFinite(end)) return 0;
    return Math.max((end - start) / (365 * 24 * 60 * 60 * 1000), 0);
}

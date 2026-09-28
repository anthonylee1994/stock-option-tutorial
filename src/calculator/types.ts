export type OptionType = "call" | "put";

export type Position = "long" | "short";

export interface CalcPreset {
    optionType: OptionType;
    position: Position;
    strike: number;
    expiry: string;
    spot: number;
    premium: number;
    iv: number;
    rate: number;
    valuationDate: string;
}

export interface PriceInput {
    optionType: OptionType;
    spot: number;
    strike: number;
    years: number;
    rate: number;
    vol: number;
}

export interface Greeks {
    delta: number;
    gamma: number;
    vega: number;
    theta: number;
    rho: number;
}

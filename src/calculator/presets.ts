import type {CalcPreset} from "./types";

const amznCallLong: CalcPreset = {
    optionType: "call",
    position: "long",
    strike: 240,
    expiry: "2027-01-15",
    spot: 260,
    premium: 28,
    iv: 22,
    rate: 5.261,
    valuationDate: "2026-09-10",
};

const amznCallShort: CalcPreset = {...amznCallLong, position: "short"};

const googCallLong: CalcPreset = {
    optionType: "call",
    position: "long",
    strike: 230,
    expiry: "2027-01-15",
    spot: 330,
    premium: 105,
    iv: 30,
    rate: 5.261,
    valuationDate: "2026-09-10",
};

const adbePutLong: CalcPreset = {
    optionType: "put",
    position: "long",
    strike: 290,
    expiry: "2026-03-20",
    spot: 285,
    premium: 14,
    iv: 40,
    rate: 5.261,
    valuationDate: "2026-02-20",
};

const nbisPutShort: CalcPreset = {
    optionType: "put",
    position: "short",
    strike: 100,
    expiry: "2027-01-15",
    spot: 200,
    premium: 3,
    iv: 84,
    rate: 5.261,
    valuationDate: "2026-08-22",
};

const gevPutShort: CalcPreset = {
    optionType: "put",
    position: "short",
    strike: 750,
    expiry: "2026-12-18",
    spot: 900,
    premium: 23.7,
    iv: 43,
    rate: 5.261,
    valuationDate: "2026-08-27",
};

const litePutShort: CalcPreset = {
    optionType: "put",
    position: "short",
    strike: 370,
    expiry: "2026-11-20",
    spot: 500,
    premium: 26.6,
    iv: 74,
    rate: 5.261,
    valuationDate: "2026-07-08",
};

/**
 * 与幻灯片一一对应（扁平顺序）。
 * `undefined` 表示该页不显示计算器。
 */
export const presets: Array<CalcPreset | undefined> = [
    // Part 0 · 开场
    undefined,
    undefined,
    undefined,
    // Part 1 · 期权四式与对赌关系（1.1–1.9 隐藏，1.10 起显示）
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    amznCallLong,
    amznCallShort,
    adbePutLong,
    nbisPutShort,
    nbisPutShort,
    // Part 2 · 三大策略：月份与行权价
    nbisPutShort,
    amznCallLong,
    amznCallLong,
    amznCallLong,
    googCallLong,
    adbePutLong,
    adbePutLong,
    adbePutLong,
    gevPutShort,
    litePutShort,
    litePutShort,
    // Part 3 · 收尾
    undefined,
];

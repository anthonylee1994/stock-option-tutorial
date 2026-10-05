/**
 * 计价引擎正确性自测（PLAN §9.2）。
 *
 * 用 `node --test tests/` 运行，零额外依赖：Node 自带 TS 类型擦除 + 内置 test runner。
 *
 * 参照值全部来自**本仓库之外**的独立来源，不是「把代码跑出来的数抄一遍」：
 *   - Hull《Options, Futures, and Other Derivatives》标准例（S=100, K=100, T=1, r=5%, σ=20%）：
 *     欧式 Call 10.4506、欧式 Put 5.5735、**美式 Put 6.0896**。
 *   - Black-Scholes 闭式解（用独立的 Python/scipy 实现算出的 golden 值，见各条注释）。
 * 本文件刻意**不引入**欧式定价实现，只用常数对照，避免把「不做欧式」的决策偷偷绕过去。
 */
import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {calcYears, computeGreeks, crr} from "../src/calculator/pricing.ts";
import {presets} from "../src/calculator/presets.ts";
import type {PriceInput} from "../src/calculator/types.ts";

/** 无股息、无风险利率为正时，美式 Call ＝ 欧式 Call。 */
const BASE: PriceInput = {optionType: "call", spot: 100, strike: 100, years: 1, rate: 0.05, vol: 0.2};

const relativeError = (actual: number, expected: number) => Math.abs(actual - expected) / Math.abs(expected);

test("美式 Call（无股息）收敛到 Black-Scholes 欧式 Call = 10.4506（Hull）", () => {
    const price = crr(BASE, 2000);
    assert.ok(Math.abs(price - 10.450584) < 5e-3, `call=${price}`);
});

test("美式 Put 收敛到 Hull 教材值 = 6.0896", () => {
    const price = crr({...BASE, optionType: "put"}, 2000);
    assert.ok(Math.abs(price - 6.0896) < 1e-2, `put=${price}`);
});

test("美式 Put 的提前行权溢价为正：高于欧式 Put 5.5735", () => {
    const american = crr({...BASE, optionType: "put"}, 2000);
    const european = 5.573526; // Black-Scholes
    assert.ok(american > european);
    assert.ok(american - european < 0.8, `premium=${american - european}`);
});

test("r = 0 时无提前行权动机，Put-Call Parity 成立", () => {
    const zeroRate: PriceInput = {...BASE, rate: 0, strike: 80};
    const call = crr(zeroRate, 4000);
    const put = crr({...zeroRate, optionType: "put"}, 4000);
    const parity = zeroRate.spot - zeroRate.strike * Math.exp(-zeroRate.rate * zeroRate.years);
    assert.ok(Math.abs(call - put - parity) < 1e-3, `C-P=${call - put} parity=${parity}`);
});

test("价格下界：不低于内在价值，且不超过标的价格（Call）／行权价（Put）", () => {
    const call = crr({...BASE, spot: 260, strike: 240}, 1000);
    const put = crr({...BASE, spot: 260, strike: 240, optionType: "put"}, 1000);
    assert.ok(call >= 20, `call=${call}`);
    assert.ok(call <= 260, `call=${call}`);
    assert.ok(put >= 0 && put <= 240, `put=${put}`);
});

test("到期（years = 0）或零波动率时退化为内在价值", () => {
    assert.equal(crr({...BASE, spot: 260, strike: 240, years: 0}, 500), 20);
    assert.equal(crr({...BASE, spot: 260, strike: 240, vol: 0}, 500), 20);
    assert.equal(crr({...BASE, spot: 220, strike: 240, years: 0}, 500), 0);
});

test("Greeks 对照 Black-Scholes 解析值（S=100, K=100, T=1, r=5%, σ=20%）", () => {
    // golden：delta 0.63683065 / gamma 0.01876202 / vega(每 1%) 0.37524035
    //         theta(每日) -0.01757268 / rho(每 1%) 0.53232482
    const g = computeGreeks(BASE, 2000);
    assert.ok(relativeError(g.delta, 0.63683065) < 0.005, `delta=${g.delta}`);
    assert.ok(relativeError(g.gamma, 0.01876202) < 0.01, `gamma=${g.gamma}`);
    assert.ok(relativeError(g.vega, 0.37524035) < 0.01, `vega=${g.vega}`);
    assert.ok(relativeError(g.theta, -0.01757268) < 0.01, `theta=${g.theta}`);
    assert.ok(relativeError(g.rho, 0.53232482) < 0.005, `rho=${g.rho}`);
});

test("Greeks 对照 Black-Scholes 解析值（S=260, K=240, T=0.35, r=5.261%, σ=22%）", () => {
    // golden：delta 0.79432995 / gamma 0.00841244 / vega 0.43788446
    //         theta -0.06335692 / rho 0.62290762
    const g = computeGreeks({optionType: "call", spot: 260, strike: 240, years: 0.35, rate: 0.05261, vol: 0.22}, 2000);
    assert.ok(relativeError(g.delta, 0.79432995) < 0.005, `delta=${g.delta}`);
    assert.ok(relativeError(g.gamma, 0.00841244) < 0.01, `gamma=${g.gamma}`);
    assert.ok(relativeError(g.vega, 0.43788446) < 0.01, `vega=${g.vega}`);
    assert.ok(relativeError(g.theta, -0.06335692) < 0.01, `theta=${g.theta}`);
    assert.ok(relativeError(g.rho, 0.62290762) < 0.005, `rho=${g.rho}`);
});

test("Greeks 符号：Call 的 delta ∈ (0,1)、gamma/vega > 0、theta < 0", () => {
    const g = computeGreeks(BASE, 500);
    assert.ok(g.delta > 0 && g.delta < 1, `delta=${g.delta}`);
    assert.ok(g.gamma > 0, `gamma=${g.gamma}`);
    assert.ok(g.vega > 0, `vega=${g.vega}`);
    assert.ok(g.theta < 0, `theta=${g.theta}`);
});

test("单调性：波动率／标的价格上升，Call 价格上升", () => {
    assert.ok(crr({...BASE, vol: 0.4}, 800) > crr({...BASE, vol: 0.2}, 800));
    assert.ok(crr({...BASE, spot: 110}, 800) > crr(BASE, 800));
    assert.ok(crr({...BASE, optionType: "put", spot: 90}, 800) > crr({...BASE, optionType: "put"}, 800));
});

test("calcYears 按 365 天折算", () => {
    assert.ok(Math.abs(calcYears("2026-01-01", "2027-01-01") - 1) < 1e-9);
    assert.equal(calcYears("2027-01-01", "2026-01-01"), 0); // 已到期，不返回负数
    assert.equal(calcYears("not-a-date", "2027-01-01"), 0);
});

test("presets 与幻灯片页数一一对应（页数不对齐会让计算器跟错合约）", () => {
    const slideDir = new URL("../src/slides/", import.meta.url);
    const files = ["00-intro.md", "01-four-positions.md", "02-strategies.md", "03-outro.md"];
    let pageCount = 0;
    for (const file of files) {
        const markdown = readFileSync(fileURLToPath(new URL(file, slideDir)), "utf8").trim();
        pageCount += markdown.split(/\n---\n/).length;
    }
    assert.equal(presets.length, pageCount, `presets=${presets.length} slides=${pageCount}`);
});

test("每个启用的预设都算得出合法价格，且不低于内在价值", () => {
    let enabled = 0;
    for (const [index, preset] of presets.entries()) {
        if (!preset) continue;
        enabled++;
        assert.ok(preset.strike > 0 && preset.spot > 0, `#${index} 价格必须为正`);
        assert.ok(preset.iv > 0 && preset.iv < 300, `#${index} IV 越界：${preset.iv}`);
        assert.ok(preset.rate > 0 && preset.rate < 100, `#${index} 利率越界：${preset.rate}`);
        assert.ok(preset.premium > 0, `#${index} 权利金必须为正`);

        const years = calcYears(preset.valuationDate, preset.expiry);
        assert.ok(years > 0, `#${index} 到期日（${preset.expiry}）必须晚于当日期（${preset.valuationDate}）`);

        const price = crr({optionType: preset.optionType, spot: preset.spot, strike: preset.strike, years, rate: preset.rate / 100, vol: preset.iv / 100}, 500);
        const intrinsic = preset.optionType === "call" ? Math.max(preset.spot - preset.strike, 0) : Math.max(preset.strike - preset.spot, 0);
        assert.ok(price >= intrinsic - 1e-9, `#${index} 理论价 ${price} 低于内在价值 ${intrinsic}`);
        assert.ok(Number.isFinite(price) && price > 0, `#${index} 理论价非法：${price}`);
    }
    assert.ok(enabled > 0, "至少要有一个启用的预设");
});

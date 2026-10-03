import React from "react";
import Reveal from "reveal.js";
import {AnimatedNumber} from "./animated-number";
import {calcYears, computeGreeks, crr} from "./pricing";
import {PayoffChart} from "./payoff-chart";
import {presets} from "./presets";
import type {CalcPreset, Position} from "./types";
import {useValueFlash} from "./use-value-flash";

const STEPS = 150;
/** 杠杆率上限：深虚值期权临近到期时理论价趋近 0，杠杆会爆炸，超过此值只以「>9999」表示。 */
const MAX_LEVERAGE = 9999;

function toDayNumber(iso: string): number {
    const time = new Date(iso).getTime();
    return Number.isFinite(time) ? Math.round(time / 86400000) : 0;
}

function fromDayNumber(days: number): string {
    return new Date(days * 86400000).toISOString().slice(0, 10);
}

function formatShortDate(iso: string): string {
    const date = new Date(iso);
    if (!Number.isFinite(date.getTime())) return "";
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    return `${month}/${day}`;
}

function clampDay(value: number, min: number, max: number): number {
    if (!Number.isFinite(value)) return min;
    return Math.min(Math.max(value, min), max);
}

export const OptionCalculator = () => {
    const [visible, setVisible] = React.useState(false);
    const [preset, setPreset] = React.useState<CalcPreset | null>(null);
    const [position, setPosition] = React.useState<Position>("long");
    const [valuationDate, setValuationDate] = React.useState("");
    const [spot, setSpot] = React.useState(0);
    const [strike, setStrike] = React.useState(0);
    const [vol, setVol] = React.useState(0);
    const [rate, setRate] = React.useState(5.261);
    const [marketPremium, setMarketPremium] = React.useState(0);

    const applyPreset = (next: CalcPreset) => {
        setPreset(next);
        setPosition(next.position);
        setValuationDate(next.valuationDate);
        setSpot(next.spot);
        setStrike(next.strike);
        setVol(next.iv);
        setRate(next.rate);
        setMarketPremium(next.premium);
    };

    React.useEffect(() => {
        const sync = () => {
            const slides = Reveal.getSlides();
            const current = Reveal.getCurrentSlide();
            const index = current ? slides.indexOf(current) : -1;
            const next = index >= 0 ? presets[index] : undefined;
            if (!next) {
                setVisible(false);
                return;
            }
            applyPreset(next);
            setVisible(true);
        };

        Reveal.on("ready", sync);
        Reveal.on("slidechanged", sync);
        if (Reveal.isReady()) sync();

        return () => {
            Reveal.off("ready", sync);
            Reveal.off("slidechanged", sync);
        };
    }, []);

    React.useEffect(() => {
        document.body.classList.toggle("calc-visible", visible);
        if (Reveal.isReady()) Reveal.layout();
    }, [visible]);

    const result = React.useMemo(() => {
        if (!preset) return null;
        const years = calcYears(valuationDate, preset.expiry);
        const input = {
            optionType: preset.optionType,
            spot,
            strike,
            years,
            rate: rate / 100,
            vol: vol / 100,
        };
        const price = crr(input, STEPS);
        const greeks = computeGreeks(input, STEPS);
        const distance = marketPremium > 0 ? ((price - marketPremium) / marketPremium) * 100 : 0;
        return {price, greeks, distance};
    }, [preset, valuationDate, spot, strike, vol, rate, marketPremium]);

    // 每個數值一變就著一下，提示「呢個數啱啱跟住郁」
    const priceFlash = useValueFlash(result?.price ?? 0);
    const distanceFlash = useValueFlash(result?.distance ?? 0);
    const deltaFlash = useValueFlash(result?.greeks.delta ?? 0);
    const gammaFlash = useValueFlash(result?.greeks.gamma ?? 0);
    const vegaFlash = useValueFlash(result?.greeks.vega ?? 0);
    const thetaFlash = useValueFlash(result?.greeks.theta ?? 0);
    const rhoFlash = useValueFlash(result?.greeks.rho ?? 0);
    const leverageFlash = useValueFlash(result ? (result.price > 0 ? spot / result.price : 0) : 0);
    const yieldFlash = useValueFlash(strike > 0 ? (result?.price ?? 0) / strike : 0);

    if (!visible || !preset || !result) return null;

    const typeLabel = preset.optionType === "call" ? "Call" : "Put";
    const leverage = result.price > 0 ? spot / result.price : 0;
    const yieldPercent = strike > 0 ? (result.price / strike) * 100 : 0;
    const rangeStart = preset.valuationDate;
    const rangeEnd = preset.expiry;
    const rangeStartDay = toDayNumber(rangeStart);
    const rangeEndDay = toDayNumber(rangeEnd);
    const sliderValue = clampDay(toDayNumber(valuationDate), rangeStartDay, rangeEndDay);
    const greeks = [
        {label: "Delta", value: result.greeks.delta, flash: deltaFlash, hint: "标的资产价格每变动 1 个单位时，该期权持仓盈亏金额变化"},
        {label: "Gamma", value: result.greeks.gamma, flash: gammaFlash, hint: "标的资产价格每变动 1 个单位时，该期权持仓的 Delta 值变化"},
        {label: "Vega", value: result.greeks.vega, flash: vegaFlash, hint: "隐含波动率每变动 1% 时，该期权持仓盈亏金额变化"},
        {label: "Theta", value: result.greeks.theta, flash: thetaFlash, hint: "时间每流逝一天，该期权持仓盈亏金额变化"},
        {label: "Rho", value: result.greeks.rho, flash: rhoFlash, hint: "无风险利率每变动 1% 时，该期权持仓盈亏金额变化"},
    ];

    return (
        <aside className="calc-panel">
            <div className="calc-title">价格计算器</div>

            <div className="calc-contract">
                <span className={`calc-contract-type calc-contract-type-${preset.optionType}`}>{typeLabel}</span>
                <span className="calc-contract-item">
                    行权价<span className="calc-contract-value">{strike}</span>
                </span>
                <span className="calc-contract-item">
                    到期<span className="calc-contract-value">{preset.expiry}</span>
                </span>
            </div>

            <div className="calc-result">
                <div className="calc-result-block">
                    <span className="calc-label">期权理论价格</span>
                    <span className={priceFlash ? "calc-value calc-flash" : "calc-value"}>
                        <AnimatedNumber value={result.price} />
                    </span>
                </div>
                <div className="calc-result-block calc-result-right">
                    <span className="calc-label">距当前价格</span>
                    <span className={["calc-distance", result.distance >= 0 ? "calc-up" : "calc-down", distanceFlash ? "calc-flash" : ""].filter(Boolean).join(" ")}>
                        <AnimatedNumber value={result.distance} digits={2} percent />
                    </span>
                </div>
            </div>

            <div className="calc-greeks">
                {greeks.map(greek => (
                    <div className="calc-greek calc-greek-tip" data-tip={greek.hint} tabIndex={0} key={greek.label}>
                        <span className="calc-label">{greek.label}</span>
                        <span className={greek.flash ? "calc-greek-value calc-flash" : "calc-greek-value"}>
                            <AnimatedNumber value={greek.value} />
                        </span>
                    </div>
                ))}
            </div>

            <div className={position === "long" ? "calc-toggle" : "calc-toggle calc-toggle-short"}>
                <button type="button" className={position === "long" ? "calc-toggle-button calc-toggle-active" : "calc-toggle-button"} onClick={() => setPosition("long")}>
                    买入 Long
                </button>
                <button type="button" className={position === "short" ? "calc-toggle-button calc-toggle-active" : "calc-toggle-button"} onClick={() => setPosition("short")}>
                    卖出 Short
                </button>
            </div>

            <div className="calc-metrics">
                <div className={position === "long" ? "calc-metric calc-metric-active" : "calc-metric"}>
                    <span className="calc-label">杠杆率（买入）</span>
                    <span className={leverageFlash ? "calc-metric-value calc-flash" : "calc-metric-value"}>
                        <AnimatedNumber value={leverage} digits={2} suffix=" 倍" max={MAX_LEVERAGE} />
                    </span>
                </div>
                <div className={position === "short" ? "calc-metric calc-metric-active" : "calc-metric"}>
                    <span className="calc-label">权利金收益率（卖出）</span>
                    <span className={yieldFlash ? "calc-metric-value calc-flash" : "calc-metric-value"}>
                        <AnimatedNumber value={yieldPercent} digits={2} suffix="%" />
                    </span>
                </div>
            </div>

            <div className="calc-payoff">
                <span className="calc-label">到期损益图</span>
                <PayoffChart optionType={preset.optionType} strike={strike} premium={marketPremium} spot={spot} position={position} />
            </div>

            <label className="calc-field">
                <span className="calc-label">当日期为</span>
                <input type="date" min={rangeStart} max={rangeEnd} value={valuationDate} onChange={event => setValuationDate(event.target.value)} />
            </label>

            <div className="calc-range">
                <input type="range" min={rangeStartDay} max={rangeEndDay} step={1} value={sliderValue} onChange={event => setValuationDate(fromDayNumber(Number(event.target.value)))} />
                <div className="calc-range-labels">
                    <span>{formatShortDate(rangeStart)}</span>
                    <span>{formatShortDate(rangeEnd)}</span>
                </div>
            </div>

            <label className="calc-field">
                <span className="calc-label">标的资产价格</span>
                <input type="number" step="0.01" value={spot} onChange={event => setSpot(Number(event.target.value))} />
            </label>

            <label className="calc-field">
                <span className="calc-label">行权价</span>
                <input type="number" step="0.5" value={strike} onChange={event => setStrike(Number(event.target.value))} />
            </label>

            <label className="calc-field">
                <span className="calc-label">隐含波动率</span>
                <span className="calc-input-wrap">
                    <input type="number" step="0.1" value={vol} onChange={event => setVol(Number(event.target.value))} />
                    <span className="calc-unit">%</span>
                </span>
            </label>

            <label className="calc-field">
                <span className="calc-label">无风险利率</span>
                <span className="calc-input-wrap">
                    <input type="number" step="0.001" value={rate} onChange={event => setRate(Number(event.target.value))} />
                    <span className="calc-unit">%</span>
                </span>
            </label>

            <button type="button" className="calc-reset" onClick={() => applyPreset(preset)}>
                恢复本页默认值
            </button>
        </aside>
    );
};

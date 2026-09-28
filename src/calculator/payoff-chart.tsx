import React from "react";
import type {OptionType, Position} from "./types";

interface PayoffChartProps {
    optionType: OptionType;
    strike: number;
    premium: number;
    spot: number;
    position: Position;
}

const WIDTH = 300;
const HEIGHT = 138;
const PAD_TOP = 16;
const PAD_RIGHT = 8;
const PAD_BOTTOM = 18;
const PAD_LEFT = 8;

function payoffAt(optionType: OptionType, strike: number, premium: number, position: Position, price: number): number {
    const intrinsic = optionType === "call" ? Math.max(price - strike, 0) : Math.max(strike - price, 0);
    return position === "long" ? intrinsic - premium : premium - intrinsic;
}

function clampLabelX(x: number): number {
    return Math.min(Math.max(x, 34), WIDTH - 34);
}

export const PayoffChart = (props: PayoffChartProps) => {
    const {optionType, strike, premium, spot, position} = props;

    const lower = Math.min(spot, strike);
    const upper = Math.max(spot, strike);
    const priceMin = Math.max(lower * 0.7, 0.01);
    const priceMax = upper * 1.3;

    const breakeven = optionType === "call" ? strike + premium : strike - premium;

    const edges = [payoffAt(optionType, strike, premium, position, priceMin), payoffAt(optionType, strike, premium, position, priceMax), 0];
    let valueMin = Math.min(...edges);
    let valueMax = Math.max(...edges);
    const padding = Math.max((valueMax - valueMin) * 0.12, 0.5);
    valueMin -= padding;
    valueMax += padding;

    const plotWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
    const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

    const xOf = (price: number) => PAD_LEFT + ((price - priceMin) / (priceMax - priceMin)) * plotWidth;
    const yOf = (value: number) => PAD_TOP + ((valueMax - value) / (valueMax - valueMin)) * plotHeight;

    const linePoints = [
        [priceMin, payoffAt(optionType, strike, premium, position, priceMin)],
        [strike, payoffAt(optionType, strike, premium, position, strike)],
        [priceMax, payoffAt(optionType, strike, premium, position, priceMax)],
    ]
        .map(([price, value]) => `${xOf(price).toFixed(1)},${yOf(value).toFixed(1)}`)
        .join(" ");

    const showBreakeven = breakeven > priceMin && breakeven < priceMax;
    const spotPayoff = payoffAt(optionType, strike, premium, position, spot);
    const lineClass = position === "long" ? "line-long" : "line-short";
    const dotClass = position === "long" ? "dot-long" : "dot-short";
    const drawKey = `${optionType}-${position}-${strike}`;

    return (
        <React.Fragment>
            <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="xMidYMid meet">
                <line className="zero-line" x1={PAD_LEFT} y1={yOf(0)} x2={WIDTH - PAD_RIGHT} y2={yOf(0)} />
                <line className="strike-line" x1={xOf(strike)} y1={PAD_TOP - 4} x2={xOf(strike)} y2={HEIGHT - PAD_BOTTOM} />
                <line className="spot-line" x1={xOf(spot)} y1={PAD_TOP - 4} x2={xOf(spot)} y2={HEIGHT - PAD_BOTTOM} />
                {showBreakeven ? <line className="breakeven-line" x1={xOf(breakeven)} y1={PAD_TOP - 4} x2={xOf(breakeven)} y2={HEIGHT - PAD_BOTTOM} /> : null}
                <polyline key={drawKey} className={`payoff-draw ${lineClass}`} pathLength={1} points={linePoints} fill="none" strokeWidth="3" strokeLinejoin="round" />
                <circle key={`dot-${drawKey}`} className={`payoff-dot ${dotClass}`} cx={xOf(spot)} cy={yOf(spotPayoff)} r="3.5" />
                {showBreakeven ? (
                    <text className="mark-label" x={clampLabelX(xOf(breakeven))} y="11" textAnchor="middle">
                        打和 {breakeven.toFixed(Number.isInteger(breakeven) ? 0 : 1)}
                    </text>
                ) : null}
                <text className="spot-label" x={xOf(spot)} y={HEIGHT - 5} textAnchor="middle">
                    现价
                </text>
            </svg>
        </React.Fragment>
    );
};

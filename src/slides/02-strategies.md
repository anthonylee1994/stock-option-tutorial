## 怎么选：三式速查

| 情况                | 用哪一式       | 重点                          |
| ------------------- | -------------- | ----------------------------- |
| IV 低、优质标的回吐 | Long Call      | 优先实值，避开高 IV 虚值 Call |
| IV 高、愿意接货     | Short Put      | `50 IV` 以上才收权利金        |
| IV 高但股价跌       | 未必 Short Put | 股价跌但 IV 不扩张，不做      |
| 明确看跌            | Long Put       | 等反弹再做，不追跌            |

<div class="callout tip">决策顺序：标的够不够好 → IV 高低 → 股价是回吐、反弹还是跌太深 → 最后才选策略、行权价、月份。</div>

---

## Long Call · 月份策略

| 实值程度 | 月份         |
| -------- | ------------ |
| OTM      | 即月         |
| ITM      | `2–4` 个月   |
| DITM     | 视乎接受程度 |

- 主流做法：做 `4–6` 个月。
- **一定要左侧介入**：回落时买，不追高。
- 洗盘走势对 Long Call 伤害最大，不对路就要走。

---

## Long Call · 行权价策略

| 状态 | 用途                     | 重点                       |
| ---- | ------------------------ | -------------------------- |
| ITM  | 攻守兼备，最平衡         | 股价不跌就有守             |
| DITM | 可以当正股来持有         | 适合科技强势股或高信心交易 |
| ATM  | 两头不到岸，只适合赌业绩 | 一般不优先                 |
| OTM  | 有攻无守                 | 适合即月，价格敏感度高     |

---

## Long Call · 例子：AMZN 240

<p class="lead">正股 <code>260</code>，做 <code>240</code> 行权价（约 7.7% 价内），时间值 <code>8</code>，总成本 <code>28</code>。</p>

<div class="example-grid">
<div class="stat-card"><span class="stat-label">正股价</span><span class="stat-value">260</span></div>
<div class="stat-card"><span class="stat-label">行权价</span><span class="stat-value">240</span></div>
<div class="stat-card"><span class="stat-label">时间值</span><span class="stat-value">8</span></div>
<div class="stat-card"><span class="stat-label">总成本</span><span class="stat-value">28</span></div>
</div>

- 内在值 `260 − 240 = 20`，时间值只占 `8`：成本大部分是实值。
- 正股每升跌 `10`，这张 Call 大约动 `30–50%`。
- 打和点 `268`：升不穿就打和或输钱。

---

## Long Call · 例子：GOOG 行权价深度

<p class="lead">正股约 <code>330</code>。行权价拉得越远，防守力越弱。</p>

| 行权价 | 位置       | 结果                                     |
| ------ | ---------- | ---------------------------------------- |
| `230`  | 深实值     | 伤害小，跌下来压力低                     |
| `270`  | 较接近现价 | Delta 约 `0.8`，跌 `20–25` 权金输 `3` 成 |

<div class="callout warn">行权价不够深、时间不够长，就是最常见的输法。右侧计算器把 IV 与标的价拖一拖，看 Delta 与理论价怎么变。</div>

---

## Long Put · 月份策略

- 做 `3` 个月以内。
- **趁反弹先做**，不要跌得太深才追沽。
- 正股反弹后仍有下跌空间时介入，赔率最好。

<div class="callout tip">Long Put 是方向性做空，时间值在流失，所以月份要短、时机要准。</div>

---

## Long Put · 行权价策略

- 不必太实值，反正看它跌。
- 可以做轻微虚值，用较少成本搏较大跌幅。
- 只有在明确看跌的标的上，才值得付时间值。

---

## Long Put · 例子：ADBE 290

<p class="lead">正股 <code>285</code>，做 <code>290</code> Put，权利金 <code>14</code>。</p>

<div class="example-grid">
<div class="stat-card"><span class="stat-label">正股价</span><span class="stat-value">285</span></div>
<div class="stat-card"><span class="stat-label">行权价</span><span class="stat-value">290</span></div>
<div class="stat-card"><span class="stat-label">状态</span><span class="stat-value">轻微实值</span></div>
<div class="stat-card"><span class="stat-label">权利金</span><span class="stat-value">14</span></div>
</div>

- 打和点 `290 − 14 = 276`。
- 近价 / 轻微实值，靠正股下跌赚内在值与时间差。

---

## Short Put · 月份策略

| 月份类型 | 时间        | 好处                     | 风险 / 限制             |
| -------- | ----------- | ------------------------ | ----------------------- |
| 远期     | `8–10` 个月 | 权利金厚，行权价可以压低 | 权利金缩得慢            |
| 中期     | `5–6` 个月  | 权利金缩得快             | 收得比远期少，IV 高才做 |
| 近期     | `2–4` 个月  | `3–7` 日可以赢对家一半   | 正股跌，期权容易扩一半  |

- 主流做法：做 `3–4` 个月。
- 永远要对标的有下跌的信心，**下方先做**，不要高追。
- 不要同一只标的往上移仓（roll up）。
- `50 IV` 做分水岭，低过不用问。

---

## Short Put · 行权价策略

<div class="formula">
<div class="formula-line">权利金收益率 = 权利金 ÷ 行权价</div>
<div class="formula-line">接货倍数 = 行权价 ÷ 权利金</div>
<div class="formula-result">至少收 3%；远期要 5% 左右。一百万元本金最多收 3%。</div>
</div>

| 合约      | 行权价 | 权利金 | 收益率 |
| --------- | ------ | ------ | ------ |
| GEV 12月  | `750`  | `23.7` | `3.2%` |
| LITE 11月 | `370`  | `26.6` | `7.2%` |
| MU 11月   | `500`  | `30`   | `6.0%` |
| DRAM 12月 | `28`   | `1.6`  | `5.7%` |
| NBIS 1月  | `100`  | `3`    | `3.0%` |

- 能压低就尽量压低，但要有足够权利金可收。
- 真的愿意用该价格接货，才做。

---

## Short Put · 例子：GEV 与 LITE

<p class="lead">同一套公式，不同赔率。</p>

<div class="example-grid">
<div class="stat-card"><span class="stat-label">GEV 12月 行权价</span><span class="stat-value">750</span></div>
<div class="stat-card"><span class="stat-label">权利金</span><span class="stat-value">23.7</span></div>
<div class="stat-card"><span class="stat-label">LITE 11月 行权价</span><span class="stat-value">370</span></div>
<div class="stat-card"><span class="stat-label">权利金</span><span class="stat-value">26.6</span></div>
</div>

- GEV：收益率约 `3.2%`，行权价压得够低。
- LITE：收益率约 `7.2%`，权利金明显厚。
- 对照 `NBIS 1月 100 Put`（`3.0%`）：同一套公式，赔率不同。

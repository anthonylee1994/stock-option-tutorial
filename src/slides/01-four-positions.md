## 什么是期权

期权是一张**合约**：买方付出一笔**权利金**，换取在**到期日或之前**、按**行权价**买入（Call）或卖出（Put）标的股票的**权利**；卖方收取权利金，承担对应的**义务**。

<div class="callout tip">四个要素：标的、方向（Call 认购 / Put 认沽）、行权价 Strike、到期日 Expiry。</div>

- **买方（Long）**：付权利金，最大亏损就是权利金。
- **卖方（Short）**：收权利金，最大盈利就是权利金，但要接货或交货。
- 每张美股合约对应 `100` 股正股，港股每只不同。

---

## 期权四式一览

| 策略       | 方向看法      | 你的角色 | 最大盈利         | 最大亏损         |
| ---------- | ------------- | -------- | ---------------- | ---------------- |
| Long Call  | 看涨          | 买方     | 无限             | 权利金           |
| Short Call | 看不涨 / 看跌 | 卖方     | 权利金           | 无限             |
| Long Put   | 看跌          | 买方     | 大（股价跌到 0） | 权利金           |
| Short Put  | 看不跌 / 看涨 | 卖方     | 权利金           | 大（股价跌到 0） |

<div class="callout tip">买方付钱买权利，卖方收钱担义务；同一个方向看法，选买还是选卖，取决于 IV 高低与愿不愿意接货。</div>

---

## 对赌关系：Long ↔ Short

<div class="two-col"><div class="callout tip"><strong>Call 合约</strong><br/>Long Call（买方）↔ Short Call（卖方）</div><div class="callout warn"><strong>Put 合约</strong><br/>Long Put（买方）↔ Short Put（卖方）</div></div>

- 每一张 Long 都对应一张 Short：期权是**零和**的。
- 不计手续费，**买方的盈亏 = 卖方的负盈亏**。
- 你赚的每一分钱，都是对手盘亏的；反之亦然。

| 你的想法 | 直接买（Long） | 做对手盘（Short） |
| -------- | -------------- | ----------------- |
| 看涨     | Long Call      | Short Put         |
| 看跌     | Long Put       | Short Call        |

---

## 四式到期损益图

<div class="payoff-grid"><div class="payoff"><div class="payoff-title">Long Call（K=240，权利金 28）</div><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet"><line class="zero-line" x1="28" y1="60.2" x2="292" y2="60.2"/><line class="strike-line" x1="160" y1="11.2" x2="160" y2="105"/><line class="breakeven-line" x1="221.6" y1="11.2" x2="221.6" y2="105"/><polyline pathLength="1" class="line-long" points="28,95.5 160,95.5 221.6,60.2 292,19.9" fill="none" stroke-width="3" stroke-linejoin="round"/><text class="axis-label" x="160" y="116.2" text-anchor="middle">行权价 240</text><text class="mark-label" x="221.6" y="9" text-anchor="middle">打和 268</text></svg></div><div class="payoff"><div class="payoff-title">Short Call（K=240，权利金 28）</div><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet"><line class="zero-line" x1="28" y1="60.2" x2="292" y2="60.2"/><line class="strike-line" x1="160" y1="11.2" x2="160" y2="105"/><line class="breakeven-line" x1="221.6" y1="11.2" x2="221.6" y2="105"/><polyline pathLength="1" class="line-short" points="28,24.9 160,24.9 221.6,60.2 292,100.5" fill="none" stroke-width="3" stroke-linejoin="round"/><text class="axis-label" x="160" y="116.2" text-anchor="middle">行权价 240</text><text class="mark-label" x="221.6" y="9" text-anchor="middle">打和 268</text></svg></div><div class="payoff"><div class="payoff-title">Long Put（K=290，权利金 14）</div><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet"><line class="zero-line" x1="28" y1="76" x2="292" y2="76"/><line class="strike-line" x1="160" y1="11.2" x2="160" y2="105"/><line class="breakeven-line" x1="129.2" y1="11.2" x2="129.2" y2="105"/><polyline pathLength="1" class="line-long" points="28,25.2 129.2,76 160,91.4 292,91.4" fill="none" stroke-width="3" stroke-linejoin="round"/><text class="axis-label" x="160" y="116.2" text-anchor="middle">行权价 290</text><text class="mark-label" x="129.2" y="9" text-anchor="middle">打和 276</text></svg></div><div class="payoff"><div class="payoff-title">Short Put（K=100，权利金 3）</div><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet"><line class="zero-line" x1="28" y1="31.9" x2="292" y2="31.9"/><line class="strike-line" x1="160" y1="11.2" x2="160" y2="105"/><line class="breakeven-line" x1="146.8" y1="11.2" x2="146.8" y2="105"/><polyline pathLength="1" class="line-short" points="28,91.4 146.8,31.9 160,25.2 292,25.2" fill="none" stroke-width="3" stroke-linejoin="round"/><text class="axis-label" x="160" y="116.2" text-anchor="middle">行权价 100</text><text class="mark-label" x="146.8" y="9" text-anchor="middle">打和 97</text></svg></div></div>

<p class="note">绿色为买方（Long），红色为卖方（Short）；金色虚线为打和点。</p>

---

## 打和点公式

<div class="formula">
<div class="formula-line">Call：打和点 = 行权价 + 权利金</div>
<div class="formula-line">Put： 打和点 = 行权价 − 权利金</div>
<div class="formula-result">到期价高过打和点，买方赚钱；低过打和点，买方亏钱。卖方刚好相反。</div>
</div>

- 打和点把「权利金成本」算进去，是判断赚赔的**真正分界线**。
- 买方在行权价与打和点之间，虽然有权内在价值，但还不够覆盖权利金，仍然亏。

---

## 情境 · Long Call 升不穿打和点

<p class="lead">以 <code>AMZN 240 Call</code> 为例：标的 <code>260</code>，权利金 <code>28</code>，打和点 <code>240 + 28 = 268</code>。</p>

| 到期正股价 | 内在价值 | 盈亏（成本 28） | 结果             |
| ---------- | -------- | --------------- | ---------------- |
| 240 以下   | 0        | −28             | **输光权利金**   |
| 240        | 0        | −28             | **输光权利金**   |
| 260        | 20       | −8              | 仍亏，未过打和点 |
| 268        | 28       | 0               | **打和点**       |
| 300        | 60       | +32             | 开始赚钱         |

<div class="callout danger">价格升不穿打和点，买方一律不赚钱；低于行权价更会<strong>输光全部权利金</strong>。</div>

---

## 情境 · Short Call 升穿打和点

<p class="lead">同一张 <code>AMZN 240 Call</code> 的另一端：卖方收权利金 <code>28</code>，打和点同样是 <code>268</code>。</p>

| 到期正股价 | Short Call 盈亏 | 结果                  |
| ---------- | --------------- | --------------------- |
| 240 以下   | +28             | 收足权利金            |
| 260        | +8              | 赚，但未被行权        |
| 268        | 0               | **打和点**            |
| 300        | −32             | **被行权交货 + 亏损** |
| 360        | −92             | 亏损持续放大          |

<div class="callout danger">升穿行权价会被行权、要<strong>交货</strong>；升穿打和点就开始实际亏损，理论亏损<strong>没有上限</strong>。</div>

---

## 情境 · Long Put 跌不穿打和点

<p class="lead">以 <code>ADBE 290 Put</code> 为例：标的 <code>285</code>，权利金 <code>14</code>，打和点 <code>290 − 14 = 276</code>。</p>

| 到期正股价 | 内在价值 | 盈亏（成本 14） | 结果             |
| ---------- | -------- | --------------- | ---------------- |
| 320        | 0        | −14             | **输光权利金**   |
| 290        | 0        | −14             | **输光权利金**   |
| 285        | 5        | −9              | 仍亏，未过打和点 |
| 276        | 14       | 0               | **打和点**       |
| 250        | 40       | +26             | 开始赚钱         |

<div class="callout danger">价格跌不穿打和点，买方一样不赚钱；高于行权价就<strong>输光全部权利金</strong>。</div>

---

## 情境 · Short Put 跌穿打和点

<p class="lead">以 <code>NBIS 1月 100 Put</code> 为例：卖方收权利金 <code>3</code>，打和点 <code>100 − 3 = 97</code>。</p>

| 到期正股价 | 是否被行权 | 盈亏（权利金 3） | 结果               |
| ---------- | ---------- | ---------------- | ------------------ |
| 120        | 否         | +3               | 收足权利金         |
| 100        | 否（临界） | +3               | 收足权利金         |
| 98         | 是         | +1               | **接货，但仍有赚** |
| 97         | 是         | 0                | **打和点**         |
| 80         | 是         | −17              | **接货且实际亏损** |

<div class="callout warn">跌穿 <code>100</code> 就要<strong>接货</strong>，跌穿 <code>97</code> 才是真正亏钱。做 Short Put 前，先问自己愿不愿意用这个价格接货。</div>

---

## 四式对赌关系总表

| 策略       | 你的角色 | 对手       | 高过打和点   | 低过打和点   |
| ---------- | -------- | ---------- | ------------ | ------------ |
| Long Call  | 买方     | Short Call | 赚钱         | 输权利金     |
| Short Call | 卖方     | Long Call  | 亏钱、要交货 | 收权利金     |
| Long Put   | 买方     | Short Put  | 输权利金     | 赚钱         |
| Short Put  | 卖方     | Long Put   | 收权利金     | 亏钱、要接货 |

<div class="callout tip">口诀：<strong>买方赌波动，卖方收时间；Long 亏有限，Short 亏无限。</strong></div>

- 打和点公式：Call = 行权价 + 权利金；Put = 行权价 − 权利金。
- 卖掉同一张合约的另一端，就是你的对手盘。

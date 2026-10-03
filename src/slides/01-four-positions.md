## 打个比方：先付订金，锁定房价

<div class="media-row"><div><p class="lead">你看中一套房，现价 <code>100 万</code>，但还拿不准要不要买。</p><div class="callout tip">你跟业主说好：我先付 <strong>2 万订金</strong>，换取 <strong>3 个月内</strong>随时按 <strong>100 万</strong>买下的权利。到时不想买，订金不退，这事就算了。</div></div><img class="illus" src="/images/call-house.svg" alt="付订金锁定房价的示意图" /></div>

<div class="example-grid">
<div class="stat-card"><span class="stat-label">房子 → 标的</span><span class="stat-value">一套房</span></div>
<div class="stat-card"><span class="stat-label">订金 → 权利金</span><span class="stat-value">2 万</span></div>
<div class="stat-card"><span class="stat-label">约定价 → 行权价</span><span class="stat-value">100 万</span></div>
<div class="stat-card"><span class="stat-label">3 个月 → 到期日</span><span class="stat-value">3 个月</span></div>
</div>

- 你花小钱买的是一个**选择权**：可以买，也可以不买。
- 业主收了订金，就有**义务**在你要买时按 `100 万`卖给你。
- 这就是一张 **Call（认购期权）**：你是买方，业主是卖方。

---

## 3 个月后：两种结局

<div class="two-col"><div class="callout tip"><strong>房价涨到 120 万</strong><br/>你按约定用 <code>100 万</code>买下，马上值 <code>120 万</code>。<br/>赚 <code>120 − 100 − 2 = 18 万</code>。<br/>本钱 2 万，赚回 9 倍：这就是<strong>杠杆</strong>。</div><div class="callout danger"><strong>房价跌到 80 万</strong><br/>没人会用 <code>100 万</code>买一套 <code>80 万</code>的房。<br/>你选择<strong>放弃</strong>，只亏 <code>2 万</code>订金。<br/>最大亏损早就锁死：这就是<strong>风险有限</strong>。</div></div>

<div class="formula">
<div class="formula-line">房价要高于 100 + 2 = 102 万，你才真正赚钱</div>
<div class="formula-result">这条线就是后面会讲的「盈亏平衡点」= 行权价 + 权利金</div>
</div>

- 业主那边刚好相反：房价没涨，他白赚 `2 万`；房价大涨，他少赚了涨幅。

---

## 再打个比方：Put 就像买保险

<div class="media-row"><div><p class="lead">你手上有股票，现价 <code>100</code>，担心下个月大跌。</p><div class="callout tip">你付 <strong>3 元保费</strong>买一张 Put：<strong>1 个月内</strong>，不管股价跌到多少，都可以按 <strong>95</strong> 卖出。</div></div><img class="illus" src="/images/put-shield.svg" alt="Put 像保险，股价跌到 95 被托住的示意图" /></div>

| 1 个月后股价 | 没买保险 | 买了 Put（行权价 95，权利金 3）   |
| ------------ | -------- | --------------------------------- |
| 涨到 120     | +20      | +17（保险没用上，白付 3 元保费）  |
| 跌到 70      | −30      | −8（按 95 卖出：−5，再加保费 −3） |

- 买 Put 的人 = **买保险的人**：付一点钱，换来"跌到底也有人按 95 接手"。
- 卖 Put 的人 = **保险公司**：平时稳收保费，一旦大跌就要按 95 **接货**。

---

## 什么是期权

期权是一张**合约**：买方付出一笔**权利金**，换取在**到期日或之前**、按**行权价**买入（Call）或卖出（Put）标的股票的**权利**；卖方收取权利金，承担对应的**义务**。

<div class="callout tip">四个要素：标的、方向（Call 认购 / Put 认沽）、行权价 Strike、到期日 Expiry。</div>

- **买方（Long）**：付权利金，最大亏损就是权利金。
- **卖方（Short）**：收权利金，最大盈利就是权利金，但可能被行权买入（接货）或被行权卖出（交货）。
- 每张美股合约对应 `100` 股标的股票，港股每只不同。

---

## 生活例子 ↔ 期权术语

<p class="lead">把鼠标移到卡片上（或按 Tab 聚焦），翻面看对应的期权术语。</p>

<div class="flip-grid"><div class="flip-card" tabindex="0"><div class="flip-inner"><div class="flip-face flip-front"><span class="flip-icon">🏠</span><span class="flip-title">付订金锁定房价的买家</span></div><div class="flip-face flip-back flip-long"><span class="flip-term">Long Call</span><span class="flip-desc">看涨：花小钱锁定买入价，涨了才买</span></div></div></div><div class="flip-card" tabindex="0"><div class="flip-inner"><div class="flip-face flip-front"><span class="flip-icon">🔑</span><span class="flip-title">收了订金的业主</span></div><div class="flip-face flip-back flip-short"><span class="flip-term">Short Call</span><span class="flip-desc">收一笔钱，但涨了也只能按约定价卖</span></div></div></div><div class="flip-card" tabindex="0"><div class="flip-inner"><div class="flip-face flip-front"><span class="flip-icon">🛡️</span><span class="flip-title">给股票买保险的人</span></div><div class="flip-face flip-back flip-long"><span class="flip-term">Long Put</span><span class="flip-desc">看跌 / 避险：花小钱锁定卖出价</span></div></div></div><div class="flip-card" tabindex="0"><div class="flip-inner"><div class="flip-face flip-front"><span class="flip-icon">🏢</span><span class="flip-title">收保费的保险公司</span></div><div class="flip-face flip-back flip-short"><span class="flip-term">Short Put</span><span class="flip-desc">收一笔钱，但跌了要按约定价接货</span></div></div></div></div>

<div class="callout tip">记住一句：<strong>买方付钱买"选择权"，卖方收钱担"义务"。</strong>买方最多亏掉付出的钱；卖方最多只赚收到的钱。</div>

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

<div class="payoff-grid"><div class="payoff"><div class="payoff-title">Long Call（K=240，权利金 28）</div><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet"><line class="zero-line" x1="28" y1="60.2" x2="292" y2="60.2"/><line class="strike-line" x1="160" y1="11.2" x2="160" y2="105"/><line class="breakeven-line" x1="221.6" y1="11.2" x2="221.6" y2="105"/><polyline pathLength="1" class="line-long" points="28,95.5 160,95.5 221.6,60.2 292,19.9" fill="none" stroke-width="3" stroke-linejoin="round"/><text class="axis-label" x="160" y="116.2" text-anchor="middle">行权价 240</text><text class="mark-label" x="221.6" y="9" text-anchor="middle">平衡点 268</text><defs><linearGradient id="trace-fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#ffffff" stop-opacity="0"/><stop offset="0.45" stop-color="#cfe4ff" stop-opacity="0.45"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.92"/></linearGradient></defs><ellipse class="trace" rx="9" ry="2.1" fill="url(#trace-fade)" style="offset-path: path('M 28 95.5 L 160 95.5 L 221.6 60.2 L 292 19.9')"/></svg></div><div class="payoff"><div class="payoff-title">Short Call（K=240，权利金 28）</div><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet"><line class="zero-line" x1="28" y1="60.2" x2="292" y2="60.2"/><line class="strike-line" x1="160" y1="11.2" x2="160" y2="105"/><line class="breakeven-line" x1="221.6" y1="11.2" x2="221.6" y2="105"/><polyline pathLength="1" class="line-short" points="28,24.9 160,24.9 221.6,60.2 292,100.5" fill="none" stroke-width="3" stroke-linejoin="round"/><text class="axis-label" x="160" y="116.2" text-anchor="middle">行权价 240</text><text class="mark-label" x="221.6" y="9" text-anchor="middle">平衡点 268</text><ellipse class="trace" rx="9" ry="2.1" fill="url(#trace-fade)" style="offset-path: path('M 28 24.9 L 160 24.9 L 221.6 60.2 L 292 100.5')"/></svg></div><div class="payoff"><div class="payoff-title">Long Put（K=290，权利金 14）</div><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet"><line class="zero-line" x1="28" y1="76" x2="292" y2="76"/><line class="strike-line" x1="160" y1="11.2" x2="160" y2="105"/><line class="breakeven-line" x1="129.2" y1="11.2" x2="129.2" y2="105"/><polyline pathLength="1" class="line-long" points="28,25.2 129.2,76 160,91.4 292,91.4" fill="none" stroke-width="3" stroke-linejoin="round"/><text class="axis-label" x="160" y="116.2" text-anchor="middle">行权价 290</text><text class="mark-label" x="129.2" y="9" text-anchor="middle">平衡点 276</text><ellipse class="trace" rx="9" ry="2.1" fill="url(#trace-fade)" style="offset-path: path('M 28 25.2 L 129.2 76 L 160 91.4 L 292 91.4')"/></svg></div><div class="payoff"><div class="payoff-title">Short Put（K=100，权利金 3）</div><svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid meet"><line class="zero-line" x1="28" y1="31.9" x2="292" y2="31.9"/><line class="strike-line" x1="160" y1="11.2" x2="160" y2="105"/><line class="breakeven-line" x1="146.8" y1="11.2" x2="146.8" y2="105"/><polyline pathLength="1" class="line-short" points="28,91.4 146.8,31.9 160,25.2 292,25.2" fill="none" stroke-width="3" stroke-linejoin="round"/><text class="axis-label" x="160" y="116.2" text-anchor="middle">行权价 100</text><text class="mark-label" x="146.8" y="9" text-anchor="middle">平衡点 97</text><ellipse class="trace" rx="9" ry="2.1" fill="url(#trace-fade)" style="offset-path: path('M 28 91.4 L 146.8 31.9 L 160 25.2 L 292 25.2')"/></svg></div></div>

<p class="note">绿色为买方（Long），红色为卖方（Short）；金色虚线为盈亏平衡点。</p>

---

## 盈亏平衡点公式

<div class="formula">
<div class="formula-line">Call：盈亏平衡点 = 行权价 + 权利金</div>
<div class="formula-line">Put： 盈亏平衡点 = 行权价 − 权利金</div>
<div class="formula-result">到期价高于盈亏平衡点，买方赚钱；低于盈亏平衡点，买方亏钱。卖方刚好相反。</div>
</div>

- 盈亏平衡点把「权利金成本」算进去，是判断盈亏的**真正分界线**。
- 买方在行权价与盈亏平衡点之间，虽然有内在价值，但还不够覆盖权利金，仍然亏。

---

## 期权价值：时间就是成本

<p class="lead">横轴是股价，纵深是剩余天数，高度是期权价值。<em>金色线</em>从 180 天扫到到期，越接近到期，就越贴近<strong>绿色的到期损益线</strong>：中间那块"凸起"就是会流失的时间值。</p>

<div class="surface-wrap" data-prevent-swipe><div class="surface-3d"></div><div class="surface-controls"><button type="button" class="surface-btn is-active" data-surface-type="call">Call</button><button type="button" class="surface-btn" data-surface-type="put">Put</button></div><div class="surface-hint">拖动旋转 · 滚轮缩放</div></div>

<p class="note">示例参数：行权价 100、IV 35%、无风险利率 5%，用 CRR 二叉树（美式）计算。</p>

---

## 情境 · Long Call 涨不破盈亏平衡点

<p class="lead">以 <code>AMZN 240 Call</code> 为例：标的 <code>260</code>，权利金 <code>28</code>，盈亏平衡点 <code>240 + 28 = 268</code>。</p>

| 到期股价 | 内在价值 | 盈亏（成本 28） | 结果                 |
| -------- | -------- | --------------- | -------------------- |
| 240 以下 | 0        | −28             | **输光权利金**       |
| 240      | 0        | −28             | **输光权利金**       |
| 260      | 20       | −8              | 仍亏，未过盈亏平衡点 |
| 268      | 28       | 0               | **盈亏平衡点**       |
| 300      | 60       | +32             | 开始赚钱             |

<div class="callout danger">价格涨不破盈亏平衡点，买方一律不赚钱；低于行权价更会<strong>输光全部权利金</strong>。</div>

---

## 情境 · Short Call 涨破盈亏平衡点

<p class="lead">同一张 <code>AMZN 240 Call</code> 的另一端：卖方收权利金 <code>28</code>，盈亏平衡点同样是 <code>268</code>。</p>

| 到期股价 | Short Call 盈亏 | 结果                  |
| -------- | --------------- | --------------------- |
| 240 以下 | +28             | 赚取全部权利金        |
| 260      | +8              | 赚，但未被行权        |
| 268      | 0               | **盈亏平衡点**        |
| 300      | −32             | **被行权交货 + 亏损** |
| 360      | −92             | 亏损持续放大          |

<div class="callout danger">涨破行权价会被行权、要<strong>交货</strong>；涨破盈亏平衡点就开始实际亏损，理论亏损<strong>没有上限</strong>。</div>

---

## 情境 · Long Put 跌不破盈亏平衡点

<p class="lead">以 <code>ADBE 290 Put</code> 为例：标的 <code>285</code>，权利金 <code>14</code>，盈亏平衡点 <code>290 − 14 = 276</code>。</p>

| 到期股价 | 内在价值 | 盈亏（成本 14） | 结果                 |
| -------- | -------- | --------------- | -------------------- |
| 320      | 0        | −14             | **输光权利金**       |
| 290      | 0        | −14             | **输光权利金**       |
| 285      | 5        | −9              | 仍亏，未过盈亏平衡点 |
| 276      | 14       | 0               | **盈亏平衡点**       |
| 250      | 40       | +26             | 开始赚钱             |

<div class="callout danger">价格跌不破盈亏平衡点，买方一样不赚钱；高于行权价就<strong>输光全部权利金</strong>。</div>

---

## 情境 · Short Put 跌破盈亏平衡点

<p class="lead">以 <code>NBIS 1月 100 Put</code> 为例：卖方收权利金 <code>3</code>，盈亏平衡点 <code>100 − 3 = 97</code>。</p>

| 到期股价 | 是否被行权 | 盈亏（权利金 3） | 结果                 |
| -------- | ---------- | ---------------- | -------------------- |
| 120      | 否         | +3               | 赚取全部权利金       |
| 100      | 否（临界） | +3               | 赚取全部权利金       |
| 98       | 是         | +1               | **接货，但仍有盈利** |
| 97       | 是         | 0                | **盈亏平衡点**       |
| 80       | 是         | −17              | **接货且实际亏损**   |

<div class="callout warn">跌破 <code>100</code> 就要<strong>接货</strong>，跌破 <code>97</code> 才是真正亏钱。做 Short Put 前，先问自己愿不愿意用这个价格接货。</div>

---

## 四式对赌关系总表

| 策略       | 你的角色 | 对手       | 高于盈亏平衡点 | 低于盈亏平衡点 |
| ---------- | -------- | ---------- | -------------- | -------------- |
| Long Call  | 买方     | Short Call | 赚钱           | 输权利金       |
| Short Call | 卖方     | Long Call  | 亏钱、要交货   | 收权利金       |
| Long Put   | 买方     | Short Put  | 输权利金       | 赚钱           |
| Short Put  | 卖方     | Long Put   | 收权利金       | 亏钱、要接货   |

<div class="callout tip">口诀：<strong>买方赌波动，卖方收时间；Long 亏有限，Short 亏无限。</strong></div>

- 盈亏平衡点公式：Call = 行权价 + 权利金；Put = 行权价 − 权利金。
- 卖掉同一张合约的另一端，就是你的对手盘。

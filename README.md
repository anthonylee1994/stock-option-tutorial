# 股票期权教程 Slides

一套用 [reveal.js](https://revealjs.com/) + React + Vite 制作的简体中文期权教学幻灯片，**每页右侧常驻一个美式期权计算器**。

## 内容

| 部分   | 内容                                                                                  |
| ------ | ------------------------------------------------------------------------------------- |
| Part 0 | 开场、风险声明、学习路线                                                              |
| Part 1 | 期权四式（Long Call / Short Call / Long Put / Short Put）与对赌关系、打和点、四种情境 |
| Part 2 | Long Call / Long Put / Short Put 的月份与行权价策略 + 例子                            |
| Part 3 | 速查卡、相关笔记、结束                                                                |

合计 27 页。术语统一使用大陆用法（行权价、权利金、实值/虚值、隐含波动率）。

## 计算器（美式期权）

- 从第 1.6 页起，右侧固定显示「价格计算器」。
- 输入：**当日期为（附日期滑杆，可拖到到期日看时间衰减）/ 标的资产价格 / 行权价 / 隐含波动率 / 无风险利率**（皆可编辑，行权价亦可在页面上临时调）。
- 输出：**期权理论价格、距当前价格、Delta / Gamma / Vega / Theta / Rho**。
- 图表：**到期损益图**，可在「买入 Long / 卖出 Short」之间切换，标出行权价、打和点与现价位置。
- 指标：**杠杆率 = 标的价 ÷ 权利金**（Long 侧）与 **厘数 = 权利金 ÷ 行权价**（Short 侧），按当前持仓方向高亮。
- 定价引擎：**美式 CRR 二叉树**（含提前行权）；Greeks 由二叉树首两层与重定价求得，纯 TypeScript、无额外依赖。
- 各页的合约、默认参数写在 `src/calculator/presets.ts`（与幻灯片扁平顺序一一对应，`undefined` 表示该页隐藏计算器）。

## 开发

```bash
pnpm install
pnpm dev        # 开发服务器
pnpm build      # 生产构建
pnpm preview    # 预览构建产物
pnpm typecheck  # tsc -b
pnpm format     # prettier --write .
```

## 目录

```
src/
  main.tsx                  # 挂载 reveal + 计算器两个 root
  app.tsx                   # react-router 路由 + 计算器 React 入口
  deck/
    reveal-init.ts          # reveal.js 配置
    slides.ts               # 以 ?raw 载入 Markdown，组装成 section
  calculator/
    option-calculator.tsx   # 计算器 UI
    pricing.ts              # CRR / Black-Scholes / Greeks
    presets.ts              # 各页默认参数
    types.ts
  slides/
    00-intro.md             # 以 --- 分页
    01-four-positions.md
    02-strategies.md
    03-outro.md
  styles/
    tokens.less             # 设计变量
    theme.less              # 主题与排版
    layout.less             # 两栏布局 + 计算器面板
    print.less              # 打印 / PDF
```

## 路由

翻页由 [react-router](https://reactrouter.com/) 接管，reveal.js 不再自己改 hash：

| URL          | 说明                                   |
| ------------ | -------------------------------------- |
| `/`          | 重定向到 `/slide/0`                    |
| `/slide/<n>` | 直接跳到第 `n` 页（扁平顺序，从 0 起） |
| 其他         | 重定向到 `/slide/0`                    |

键盘 / 箭头换页时 URL 会同步更新，浏览器前进、后退键亦可翻页。部署时需设置 SPA fallback（把未知路径 rewrite 到 `index.html`），否则直接访问深层链接会 404。

## 键盘操作（reveal.js 内置）

| 按键            | 功能            |
| --------------- | --------------- |
| `← →` / `Space` | 上一页 / 下一页 |
| `Home` / `End`  | 首页 / 末页     |
| `O`             | 总览            |
| `F`             | 全屏            |
| `S`             | 讲者视图        |

## 导出 PDF

访问 `?print-pdf`（例如 `http://localhost:5323/?print-pdf`），再用浏览器打印为 PDF。打印时右侧计算器会自动隐藏。

## 声明

仅用于教学与讨论，不构成任何投资建议。所有价格与合约仅供示例。

# 股票期权教程 Slides

一套用 [reveal.js](https://revealjs.com/) + React + Vite 制作的简体中文期权教学幻灯片，**每页右侧常驻一个美式期权计算器**。

## 内容

| 部分   | 内容                                                                                  |
| ------ | ------------------------------------------------------------------------------------- |
| Part 0 | 开场、风险声明、学习路线                                                              |
| Part 1 | 期权四式（Long Call / Short Call / Long Put / Short Put）与对赌关系、打和点、四种情境 |
| Part 2 | Long Call / Long Put / Short Put 的月份与行权价策略 + 例子                            |
| Part 3 | 速查卡、相关笔记、结束                                                                |

合计 29 页。术语统一使用大陆用法（行权价、权利金、实值/虚值、隐含波动率）。

## 计算器（美式期权）

- 从 Part 1 的情境页（Long Call）起，右侧固定显示「价格计算器」；之前的基础页（开场、四式、损益图、盈亏平衡点）隐藏。
- 输入：**当日期为（附日期滑杆，可拖到到期日看时间衰减）/ 标的资产价格 / 行权价 / 隐含波动率 / 无风险利率**（皆可编辑，行权价亦可在页面上临时调）。
- 输出：**期权理论价格、距当前价格、Delta / Gamma / Vega / Theta / Rho**。
- 图表：**到期损益图**，可在「买入 Long / 卖出 Short」之间切换，标出行权价、打和点与现价位置。
- 指标：**杠杆率 = 标的价 ÷ 期权理论价格**（Long 侧）与 **厘数 = 期权理论价格 ÷ 行权价**（Short 侧），两者都随 IV／日期／标的价即时更新，按当前持仓方向高亮。
- 定价引擎：**美式 CRR 二叉树**（含提前行权）；Greeks 由二叉树首两层与重定价求得，纯 TypeScript、无额外依赖。
- 各页的合约、默认参数写在 `src/calculator/presets.ts`（与幻灯片扁平顺序一一对应，`undefined` 表示该页隐藏计算器）。

## 开发

```bash
pnpm install
pnpm dev        # 开发服务器
pnpm build      # tsc -b + vite build
pnpm preview    # 预览构建产物
pnpm typecheck  # tsc -b
pnpm format     # prettier --write .
pnpm lint       # oxlint（仅参考，不纳入验收）
```

## 动画

所有动画都用纯 CSS / SVG / three.js 表达，不额外引入动画库；统一放在 `src/styles/motion.less`（编排）与各组件样式里（细节），打印与「减少动态效果」会自动全部关闭。

| 层次    | 动画                                                                                     |
| ------- | ---------------------------------------------------------------------------------------- |
| 页面    | 顶部一道光扫过；标题模糊对焦；正文、`lead`、`note` 依次入场                              |
| 内容块  | 表格行滑入 + 左侧高亮闪一下；列表逐条滑入（延迟封顶，长表格不会等太久）；`code` 通电发光 |
| 卡片    | 数据卡弹入后一道光扫过、悬停时再扫一次；公式高亮；翻转卡入场自动翻一圈提示可翻           |
| 损益图  | 折线逐条描线；行权价／平衡点虚线持续呼吸；一颗彗尾光点沿损益线来回跑                     |
| 计算器  | 面板滑入；数值一变动就闪一下（理论价、距离、五个 Greeks、杠杆率、收益率全部联动）        |
| 3D 曲面 | 入场由平面升起；切换 Call / Put 时压扁再弹起，同时重播 180 天→到期的时间扫描线           |

React 侧的数值滚动在 `src/calculator/animated-number.tsx`：`useTweenedNumber` 负责补间，`useValueFlash` 负责触发上面「闪一下」的类名。

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
    payoff-chart.tsx        # 到期损益图（内联 SVG）
    animated-number.tsx     # 数值滚动动画
    pricing.ts              # CRR / Black-Scholes / Greeks
    presets.ts              # 各页默认参数
    format.ts               # 数字 / 货币格式化
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
    motion.less             # 过渡 / 动画
    print.less              # 打印 / PDF
```

## 路由

翻页由 [react-router](https://reactrouter.com/) 接管，reveal.js 不再自己改 hash：

| URL          | 说明                                   |
| ------------ | -------------------------------------- |
| `/`          | 重定向到 `/slide/0`                    |
| `/slide/<n>` | 直接跳到第 `n` 页（扁平顺序，从 0 起） |
| 其他         | 重定向到 `/slide/0`                    |

键盘 / 箭头换页时 URL 会同步更新，浏览器前进、后退键亦可翻页。部署时需设置 SPA fallback（把未知路径 rewrite 到 `index.html`），否则直接访问深层链接会 404——见[部署](#部署)。

## 部署（Vercel）

仓库根目录已备好 `vercel.json`，纯静态站，无后端、无环境变量：

```json
{
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": "vite",
    "buildCommand": "pnpm build",
    "outputDirectory": "dist",
    "installCommand": "pnpm install",
    "rewrites": [{"source": "/(.*)", "destination": "/index.html"}],
    "headers": [
        {
            "source": "/assets/(.*)",
            "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]
        }
    ]
}
```

- **`rewrites` 全落 `index.html`**：`BrowserRouter` 的 `/slide/:index` 是客户端路由，直接开深层链接或刷新要靠 fallback 交给 react-router；实际存在的静态文件（如 `/assets/*`）仍优先由文件系统返回。
- **`/assets/*` 长缓存**：Vite 产物文件名带 hash，可 `immutable` 缓存一年；`index.html` 不缓存，重新部署即时生效。
- **pnpm**：lockfile 是 `pnpm-lock.yaml`，所以显式写死 `installCommand` / `buildCommand`，不靠 Vercel 自动侦测。

部署方式：repo 推上 GitHub 后在 Vercel 直接 Import，或在本机跑 `vercel` / `vercel --prod`。若部署到 Netlify / Cloudflare Pages / GitHub Pages 等，同样要自己配一条「未匹配路径 → `/index.html`」的 fallback（GitHub Pages 走 404.html 那套）。

## 键盘操作（reveal.js 内置）

| 按键            | 功能            |
| --------------- | --------------- |
| `← →` / `Space` | 上一页 / 下一页 |
| `Home` / `End`  | 首页 / 末页     |
| `O`             | 总览            |
| `F`             | 全屏            |
| `S`             | 讲者视图        |

## 导出 PDF

访问 `?print-pdf`（例如 `http://localhost:5173/?print-pdf`），再用浏览器打印为 PDF。打印时右侧计算器会自动隐藏。

## 声明

仅用于教学与讨论，不构成任何投资建议。所有价格与合约仅供示例。

# 🇬🇧 UK Credit Cards 全面对比 2026

**覆盖英国主流银行 80+ 张信用卡的全面对比工具，所有数据经官网核实。**

## 🌐 在线访问

**👉 [https://klausc06.github.io/uk-credit-cards/](https://klausc06.github.io/uk-credit-cards/)**

---

## ✨ 功能特性

- **80+ 张信用卡** — 覆盖 25+ 家发卡机构
- **6 大类别筛选** — 旅行卡、返现卡、积分卡、余额转账卡、购物卡、信用建设卡
- **智能搜索** — 按卡名、发卡机构快速搜索
- **多维度筛选** — 年费上限、最低返现、免外汇手续费、贵宾室、开卡奖励
- **卡片对比** — 最多 4 张卡片并排对比
- **深色/浅色主题** — 自适应切换
- **中英双语** — 卡片名称、发卡机构均有中英文
- **数据核实标记** — 每张卡片标注 verified/partial/unverified 状态

## 📊 数据覆盖

| 发卡机构 | 卡片数量 | 核实状态 |
|---------|---------|---------|
| American Express | 16 张 | ✅ 官网核实 |
| Barclays / Barclaycard | 8 张 | ✅ 官网核实 |
| NatWest / RBS | 10 张 | ✅ 官网核实 |
| Santander | 6 张 | ✅ 官网核实 |
| HSBC / first direct | 5 张 | ✅ 官网核实 |
| Lloyds / Halifax / MBNA | 8 张 | ⚠️ 部分核实 |
| Tesco Bank | 6 张 | ✅ 官网核实 |
| Virgin Money | 5 张 | ✅ 官网核实 |
| Nationwide | 4 张 | ✅ 官网核实 |
| TSB | 3 张 | ✅ 官网核实 |
| Chase / Monzo / Starling | 3 张 | ✅ 官网核实 |
| 其他 (Capital One, Vanquis 等) | 7+ 张 | ⚠️ 部分核实 |

## 🛠️ 技术栈

- **Vite** — 极速构建工具
- **TypeScript** — 类型安全
- **原生 CSS** — 无框架依赖，深色/浅色主题
- **GitHub Pages** — 自动部署（push to main 触发）

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/Klausc06/uk-credit-cards.git
cd uk-credit-cards

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📁 项目结构

```
uk-credit-cards/
├── index.html              # 入口页面
├── src/
│   ├── main.ts             # 应用逻辑（筛选、搜索、对比）
│   ├── data/
│   │   ├── cards.ts        # 卡片数据（81+ 张卡）
│   │   └── types.ts        # TypeScript 类型定义
│   └── styles/
│       └── main.css        # 样式（深色/浅色主题）
├── uk-all-cards-complete.md # 原始对比文档（中文）
├── WORKLOG.md              # 数据核实日志
└── .github/workflows/
    └── deploy.yml          # GitHub Pages 自动部署
```

## 📋 数据来源

- **Tier 1 — 官方网站**：通过 Playwright / curl 直接从银行官网提取数据（70 张卡）
- **Tier 2 — 权威对比网站**：Moneyfacts、MoneySuperMarket（11 张卡）
- **Tier 3 — 未核实**：被反爬封锁的网站，数据标注警告

所有数据最后更新：**2026 年 6 月**

## 📝 许可

本项目仅供个人参考使用。信用卡信息以各发卡机构官方网站为准。

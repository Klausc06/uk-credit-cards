export type Lang = 'zh' | 'en';

const translations = {
  // Page meta
  'meta.title': {
    zh: '英国信用卡全面对比 2026 · 80+张卡 · 官网核实版',
    en: 'UK Credit Cards Comparison 2026 · 80+ Cards · Verified',
  },
  'meta.desc': {
    zh: '覆盖英国主流银行80+张信用卡的全面对比，包含旅行卡、返现卡、积分卡、余额转账卡等6大类别，所有数据经官网核实。',
    en: 'Comprehensive comparison of 80+ UK credit cards across travel, cashback, rewards, balance transfer and more. All data verified from official sources.',
  },

  // Header
  'header.title': {
    zh: '💳 英国信用卡全面对比',
    en: '💳 UK Credit Cards Comparison',
  },
  'header.sub': {
    zh: '覆盖 <strong>{issuers}+家发卡机构、{cards}+张卡片</strong>。2026年6月从官网、Moneyfacts、MoneySuperMarket 多源交叉采集验证。含旅行、返现、积分、余额转账、信用建设等全类别对比。',
    en: 'Covering <strong>{issuers}+ issuers and {cards}+ cards</strong>. Cross-verified from official sites, Moneyfacts, and MoneySuperMarket in June 2026. Includes travel, cashback, rewards, balance transfer, credit building and more.',
  },

  // Stats
  'stat.cards': { zh: '收录卡片', en: 'Cards Listed' },
  'stat.issuers': { zh: '发卡机构', en: 'Issuers' },
  'stat.verified': { zh: '官网核实', en: 'Verified' },
  'stat.noFx': { zh: '免外汇费', en: 'No FX Fee' },
  'stat.free': { zh: '免年费', en: 'No Annual Fee' },

  // Controls
  'search.placeholder': {
    zh: '搜索卡片名称、发卡机构、特色功能...',
    en: 'Search card name, issuer, features...',
  },
  'sort.name.asc': { zh: '名称 A-Z', en: 'Name A-Z' },
  'sort.name.desc': { zh: '名称 Z-A', en: 'Name Z-A' },
  'sort.fee.asc': { zh: '年费 低→高', en: 'Fee Low→High' },
  'sort.fee.desc': { zh: '年费 高→低', en: 'Fee High→Low' },
  'sort.apr.asc': { zh: 'APR 低→高', en: 'APR Low→High' },
  'sort.apr.desc': { zh: 'APR 高→低', en: 'APR High→Low' },
  'sort.issuer': { zh: '发卡机构', en: 'Issuer' },

  // Toggles
  'toggle.noFx': { zh: '🌍 免外汇费', en: '🌍 No FX Fee' },
  'toggle.lounge': { zh: '🛋️ 有贵宾厅', en: '🛋️ Lounge Access' },
  'toggle.bonus': { zh: '🎁 有开卡奖励', en: '🎁 Sign-up Bonus' },
  'toggle.free': { zh: '💰 免年费', en: '💰 No Annual Fee' },

  // Empty state
  'empty.title': { zh: '没有找到匹配的卡片', en: 'No matching cards found' },
  'empty.desc': { zh: '试试调整筛选条件或搜索关键词', en: 'Try adjusting your filters or search terms' },

  // Compare
  'compare.btn': { zh: '对比选中的卡片', en: 'Compare Selected' },
  'compare.title': { zh: '卡片对比', en: 'Card Comparison' },
  'compare.add': { zh: '加入对比', en: 'Compare' },
  'compare.need2': { zh: '请至少选择2张卡片', en: 'Select at least 2 cards' },

  // Card specs
  'spec.bonus': { zh: '开卡奖励', en: 'Sign-up Bonus' },
  'spec.earn': { zh: '消费回馈', en: 'Rewards' },
  'spec.fxFee': { zh: '海外FX费', en: 'FX Fee' },
  'spec.apr': { zh: 'APR', en: 'APR' },
  'spec.bt': { zh: '余额转移', en: 'Balance Transfer' },
  'spec.purchase': { zh: '0%消费', en: '0% Purchase' },
  'spec.lounge': { zh: '贵宾厅', en: 'Lounge' },

  // Card values
  'val.free': { zh: '免费', en: 'Free' },
  'val.freeFx': { zh: '0% 免费 🌍', en: '0% Free 🌍' },
  'val.unlimited': { zh: '无限次', en: 'Unlimited' },
  'val.visitsYear': { zh: '{n}次/年', en: '{n}/yr' },
  'val.months': { zh: '{n}个月', en: '{n} mo' },
  'val.monthsShort': { zh: '{n}月', en: '{n}mo' },
  'val.noFee': { zh: '免手续费', en: 'No fee' },

  // Tags
  'tag.noFx': { zh: '免外汇费', en: 'No FX Fee' },
  'tag.bonus': { zh: '开卡奖励', en: 'Bonus' },

  // Verification
  'verify.verified': { zh: '✅ 官网核实', en: '✅ Verified' },
  'verify.partial': { zh: '⚠️ 部分核实', en: '⚠️ Partial' },
  'verify.unverified': { zh: '❓ 未核实', en: '❓ Unverified' },

  // Compare table
  'cmp.issuer': { zh: '发卡机构', en: 'Issuer' },
  'cmp.fee': { zh: '年费', en: 'Annual Fee' },
  'cmp.apr': { zh: 'APR', en: 'APR' },
  'cmp.fx': { zh: '海外FX费', en: 'FX Fee' },
  'cmp.bonus': { zh: '开卡奖励', en: 'Sign-up Bonus' },
  'cmp.rewards': { zh: '消费回馈', en: 'Rewards' },
  'cmp.bt': { zh: '余额转移', en: 'Balance Transfer' },
  'cmp.purchase': { zh: '0%消费', en: '0% Purchase' },
  'cmp.lounge': { zh: '贵宾厅', en: 'Lounge' },
  'cmp.network': { zh: '卡组织', en: 'Network' },
  'cmp.category': { zh: '类别', en: 'Category' },

  // Categories
  'cat.travel': { zh: '旅行', en: 'Travel' },
  'cat.cashback': { zh: '返现', en: 'Cashback' },
  'cat.rewards': { zh: '奖励', en: 'Rewards' },
  'cat.balance-transfer': { zh: '余额转移', en: 'Balance Transfer' },
  'cat.purchase': { zh: '0%消费', en: '0% Purchase' },
  'cat.credit-builder': { zh: '信用建设', en: 'Credit Builder' },
  'cat.airline': { zh: '航空', en: 'Airline' },
  'cat.hotel': { zh: '酒店', en: 'Hotel' },
  'cat.bnpl': { zh: 'BNPL', en: 'BNPL' },
  'cat.student': { zh: '学生', en: 'Student' },
  'cat.bad-credit': { zh: '信用修复', en: 'Bad Credit' },
  'cat.other': { zh: '其他', en: 'Other' },

  // Footer
  'footer.sources': { zh: '数据来源：', en: 'Sources: ' },
  'footer.sourcesVal': {
    zh: '各银行官网 (americanexpress.com, barclays.co.uk, hsbc.co.uk, natwest.com, santander.co.uk, tsb.co.uk, virginmoney.com, monzo.com, chase.co.uk 等)、moneyfacts.co.uk、moneysupermarket.com',
    en: 'Official bank sites (americanexpress.com, barclays.co.uk, hsbc.co.uk, natwest.com, santander.co.uk, tsb.co.uk, virginmoney.com, monzo.com, chase.co.uk etc.), moneyfacts.co.uk, moneysupermarket.com',
  },
  'footer.verify': { zh: '验证方式：', en: 'Verification: ' },
  'footer.verifyVal': {
    zh: '官网直接采集 + 权威对比网站交叉核实 · 2026年6月14日',
    en: 'Direct from official sites + cross-verified with comparison sites · June 14, 2026',
  },
  'footer.note': { zh: '注意：', en: 'Note: ' },
  'footer.noteVal': {
    zh: '开卡奖励随时变化，APR和费用以银行官网为准。所有APR均为representative (variable)。',
    en: 'Sign-up bonuses may change. APR and fees are subject to bank websites. All APRs are representative (variable).',
  },

  // Theme
  'theme.dark': { zh: '深色模式', en: 'Dark mode' },
  'theme.light': { zh: '浅色模式', en: 'Light mode' },
  'lang.label': { zh: 'EN', en: '中' },
} as const;

export type Key = keyof typeof translations;

let currentLang: Lang = (localStorage.getItem('lang') as Lang) || 'zh';

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
}

export function t(key: Key, vars?: Record<string, string | number>): string {
  let text = translations[key][currentLang] || translations[key].zh;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}

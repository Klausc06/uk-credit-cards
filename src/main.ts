import type { CreditCard, CardCategory, CardFilters } from './data/types';
import { cards, getUniqueIssuers } from './data/cards';
import './styles/main.css';

const state: {
  filters: CardFilters;
  filteredCards: CreditCard[];
  compareIds: Set<string>;
  showCompare: boolean;
} = {
  filters: {
    search: '',
    categories: [],
    networks: [],
    maxAnnualFee: null,
    minCashback: null,
    noForeignFee: false,
    hasLounge: false,
    hasSignUpBonus: false,
    sortBy: 'name',
    sortOrder: 'asc',
  },
  filteredCards: [...cards],
  compareIds: new Set(),
  showCompare: false,
};

const CATEGORY_LABELS: Record<CardCategory, string> = {
  travel: '旅行',
  cashback: '返现',
  rewards: '奖励',
  'balance-transfer': '余额转移',
  purchase: '0%消费',
  'credit-builder': '信用建设',
  airline: '航空',
  hotel: '酒店',
  bnpl: 'BNPL',
  student: '学生',
  'bad-credit': '信用修复',
  other: '其他',
};

function init() {
  const app = document.getElementById('app')!;
  app.innerHTML = `
    <div class="theme-toggle">
      <button class="theme-btn" data-theme="dark" aria-label="深色模式">🌙</button>
      <button class="theme-btn" data-theme="light" aria-label="浅色模式">☀️</button>
    </div>

    <div class="container">
      <header class="header">
        <h1>💳 英国信用卡全面对比</h1>
        <p class="subtitle">
          覆盖 <strong>${getUniqueIssuers().length}+家发卡机构、${cards.length}+张卡片</strong>。
          2026年6月从官网、Moneyfacts、MoneySuperMarket 多源交叉采集验证。
          含旅行、返现、积分、余额转账、信用建设等全类别对比。
        </p>
      </header>

      <div class="stats">
        <div class="stat-card"><div class="num">${cards.length}+</div><div class="label">收录卡片</div></div>
        <div class="stat-card"><div class="num">${getUniqueIssuers().length}+</div><div class="label">发卡机构</div></div>
        <div class="stat-card"><div class="num">${cards.filter((c) => c.verificationStatus === 'verified').length}</div><div class="label">官网核实</div></div>
        <div class="stat-card"><div class="num">${cards.filter((c) => c.foreignTransactionFee === 0).length}</div><div class="label">免外汇费</div></div>
        <div class="stat-card"><div class="num">${cards.filter((c) => c.annualFee === 'free').length}</div><div class="label">免年费</div></div>
      </div>

      <div class="controls">
        <div class="controls-inner">
          <div class="search-box">
            <span class="icon">🔍</span>
            <input type="text" id="search" placeholder="搜索卡片名称、发卡机构、特色功能..." />
          </div>
          <select class="sort-select" id="sort">
            <option value="name-asc">名称 A-Z</option>
            <option value="name-desc">名称 Z-A</option>
            <option value="fee-asc">年费 低→高</option>
            <option value="fee-desc">年费 高→低</option>
            <option value="apr-asc">APR 低→高</option>
            <option value="apr-desc">APR 高→低</option>
            <option value="issuer-asc">发卡机构</option>
          </select>
        </div>
        <div class="filter-group" id="category-filters"></div>
        <div class="toggle-bar">
          <button class="toggle-btn" id="toggle-no-fx">🌍 免外汇费</button>
          <button class="toggle-btn" id="toggle-lounge">🛋️ 有贵宾厅</button>
          <button class="toggle-btn" id="toggle-bonus">🎁 有开卡奖励</button>
          <button class="toggle-btn" id="toggle-free">💰 免年费</button>
        </div>
      </div>

      <div class="card-grid" id="card-grid"></div>
    </div>

    <div class="compare-bar" id="compare-bar">
      <div class="compare-bar-inner">
        <div class="compare-items" id="compare-items"></div>
        <button class="compare-btn" id="compare-btn">对比选中的卡片</button>
      </div>
    </div>

    <div class="modal-overlay" id="compare-modal">
      <div class="modal">
        <h2>
          卡片对比
          <button class="close-btn" id="close-modal">&times;</button>
        </h2>
        <div class="table-wrap" id="compare-table-wrap"></div>
      </div>
    </div>

    <footer class="footer container">
      <strong>数据来源：</strong>各银行官网 (americanexpress.com, barclays.co.uk, hsbc.co.uk, natwest.com, santander.co.uk, tsb.co.uk, virginmoney.com, monzo.com, chase.co.uk 等)、moneyfacts.co.uk、moneysupermarket.com<br>
      <strong>验证方式：</strong>官网直接采集 + 权威对比网站交叉核实 · 2026年6月14日<br>
      <strong>注意：</strong>开卡奖励随时变化，APR和费用以银行官网为准。所有APR均为representative (variable)。<br>
      <a href="https://github.com/Klausc06/uk-credit-cards">GitHub: Klausc06/uk-credit-cards</a>
    </footer>
  `;

  setupTheme();
  setupCategoryFilters();
  setupEventListeners();
  applyFilters();
}

function setupTheme() {
  const btns = document.querySelectorAll('.theme-btn') as NodeListOf<HTMLButtonElement>;
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
  btns.forEach((btn) => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme!));
  });
}

function setTheme(t: string) {
  document.documentElement.setAttribute('data-theme', t);
  document.querySelectorAll('.theme-btn').forEach((btn) => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.theme === t);
  });
  localStorage.setItem('theme', t);
}

function setupCategoryFilters() {
  const container = document.getElementById('category-filters')!;
  const allCats = new Set<CardCategory>();
  cards.forEach((c) => c.category.forEach((cat) => allCats.add(cat)));
  const sorted = Array.from(allCats).sort();
  sorted.forEach((cat) => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.category = cat;
    btn.textContent = CATEGORY_LABELS[cat] || cat;
    btn.addEventListener('click', () => toggleCategory(cat, btn));
    container.appendChild(btn);
  });
}

function toggleCategory(cat: CardCategory, btn: HTMLButtonElement) {
  const idx = state.filters.categories.indexOf(cat);
  if (idx >= 0) {
    state.filters.categories.splice(idx, 1);
    btn.classList.remove('active');
  } else {
    state.filters.categories.push(cat);
    btn.classList.add('active');
  }
  applyFilters();
}

function setupEventListeners() {
  const search = document.getElementById('search') as HTMLInputElement;
  search.addEventListener('input', () => {
    state.filters.search = search.value.trim().toLowerCase();
    applyFilters();
  });

  const sort = document.getElementById('sort') as HTMLSelectElement;
  sort.addEventListener('change', () => {
    const [sortBy, sortOrder] = sort.value.split('-') as [CardFilters['sortBy'], 'asc' | 'desc'];
    state.filters.sortBy = sortBy;
    state.filters.sortOrder = sortOrder;
    applyFilters();
  });

  document
    .getElementById('toggle-no-fx')!
    .addEventListener('click', function (this: HTMLButtonElement) {
      state.filters.noForeignFee = !state.filters.noForeignFee;
      this.classList.toggle('active', state.filters.noForeignFee);
      applyFilters();
    });

  document
    .getElementById('toggle-lounge')!
    .addEventListener('click', function (this: HTMLButtonElement) {
      state.filters.hasLounge = !state.filters.hasLounge;
      this.classList.toggle('active', state.filters.hasLounge);
      applyFilters();
    });

  document
    .getElementById('toggle-bonus')!
    .addEventListener('click', function (this: HTMLButtonElement) {
      state.filters.hasSignUpBonus = !state.filters.hasSignUpBonus;
      this.classList.toggle('active', state.filters.hasSignUpBonus);
      applyFilters();
    });

  document
    .getElementById('toggle-free')!
    .addEventListener('click', function (this: HTMLButtonElement) {
      state.filters.maxAnnualFee = state.filters.maxAnnualFee === null ? 0 : null;
      this.classList.toggle('active', state.filters.maxAnnualFee === 0);
      applyFilters();
    });

  document.getElementById('compare-btn')!.addEventListener('click', showCompareModal);
  document.getElementById('close-modal')!.addEventListener('click', () => {
    document.getElementById('compare-modal')!.classList.remove('visible');
  });
  document.getElementById('compare-modal')!.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
      document.getElementById('compare-modal')!.classList.remove('visible');
    }
  });
}

function applyFilters() {
  const f = state.filters;
  state.filteredCards = cards.filter((card) => {
    if (f.search) {
      const q = f.search;
      const haystack = [
        card.name,
        card.nameZh,
        card.issuer,
        card.issuerZh,
        ...(card.specialFeatures || []),
        ...card.pros,
        ...card.category,
        card.network,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.categories.length > 0 && !f.categories.some((c) => card.category.includes(c)))
      return false;
    if (f.noForeignFee && card.foreignTransactionFee !== 0) return false;
    if (f.hasLounge && !card.loungeAccess) return false;
    if (f.hasSignUpBonus && !card.signUpBonus) return false;
    if (f.maxAnnualFee !== null && card.annualFee !== 'free' && card.annualFee > f.maxAnnualFee)
      return false;
    return true;
  });

  state.filteredCards.sort((a, b) => {
    const dir = f.sortOrder === 'asc' ? 1 : -1;
    switch (f.sortBy) {
      case 'name':
        return dir * a.name.localeCompare(b.name);
      case 'annualFee': {
        const fa = a.annualFee === 'free' ? 0 : a.annualFee;
        const fb = b.annualFee === 'free' ? 0 : b.annualFee;
        return dir * (fa - fb);
      }
      case 'apr': {
        const aa = typeof a.representativeApr === 'number' ? a.representativeApr : 999;
        const ab = typeof b.representativeApr === 'number' ? b.representativeApr : 999;
        return dir * (aa - ab);
      }
      case 'issuer':
        return dir * a.issuer.localeCompare(b.issuer);
      default:
        return 0;
    }
  });

  renderCards();
}

function renderCards() {
  const grid = document.getElementById('card-grid')!;
  if (state.filteredCards.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <div class="icon">🔍</div>
        <h3>没有找到匹配的卡片</h3>
        <p>试试调整筛选条件或搜索关键词</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = state.filteredCards
    .map(
      (card, i) => `
    <article class="card" data-network="${card.network}" data-id="${card.id}" style="animation-delay: ${i * 0.03}s" onclick="window.open('${card.url}', '_blank', 'noopener')" role="link" tabindex="0" aria-label="${card.issuerZh} ${card.nameZh} - ${card.annualFee === 'free' ? '免年费' : `年费£${card.annualFee}`} - 点击访问官网" onkeydown="if(event.key==='Enter')window.open('${card.url}','_blank','noopener')">
      <div class="card-header">
        <div>
          <div class="card-issuer" aria-hidden="true">${card.issuerZh}</div>
          <h3 class="card-name">${card.nameZh}</h3>
        </div>
        <div class="card-fee" aria-label="年费">
          ${
            card.annualFee === 'free'
              ? '<span class="amount free">免费</span>'
              : `<span class="amount">£${card.annualFee}</span>`
          }
          ${card.annualFeeNote ? `<span class="period">${card.annualFeeNote}</span>` : ''}
        </div>
      </div>

      <div class="specs" role="list" aria-label="卡片特性">
        ${
          card.signUpBonus
            ? `
          <div class="spec" role="listitem">
            <span class="spec-label">开卡奖励</span>
            <span class="spec-value highlight">${card.signUpBonus.amount} ${card.signUpBonus.currency}${card.signUpBonus.spendRequirement ? ` (${card.signUpBonus.spendRequirement})` : ''}</span>
          </div>
        `
            : ''
        }
        ${
          card.earnRate.length > 0
            ? card.earnRate
                .map(
                  (r) => `
          <div class="spec" role="listitem">
            <span class="spec-label">${r === card.earnRate[0] ? '消费回馈' : ''}</span>
            <span class="spec-value ${r.isHighlight ? 'highlight' : ''}">${r.rate} ${r.description}</span>
          </div>
        `
                )
                .join('')
            : ''
        }
        ${
          card.foreignTransactionFee === 0
            ? `
          <div class="spec" role="listitem">
            <span class="spec-label">海外FX费</span>
            <span class="spec-value highlight">0% 免费 🌍</span>
          </div>
        `
            : `
          <div class="spec" role="listitem">
            <span class="spec-label">海外FX费</span>
            <span class="spec-value">${card.foreignTransactionFee}%</span>
          </div>
        `
        }
        <div class="spec" role="listitem">
          <span class="spec-label">APR</span>
          <span class="spec-value ${typeof card.representativeApr === 'number' && card.representativeApr <= 15 ? 'highlight' : typeof card.representativeApr === 'number' && card.representativeApr > 40 ? 'warning' : ''}">${card.representativeApr === 0 ? 'N/A' : card.representativeApr + '%'}</span>
        </div>
        ${
          card.balanceTransfer
            ? `
          <div class="spec" role="listitem">
            <span class="spec-label">余额转移</span>
            <span class="spec-value highlight">0% ${card.balanceTransfer.durationMonths}个月${card.balanceTransfer.feePercent ? ` (${card.balanceTransfer.feePercent}%费)` : ' (免手续费)'}</span>
          </div>
        `
            : ''
        }
        ${
          card.purchaseOffer
            ? `
          <div class="spec" role="listitem">
            <span class="spec-label">0%消费</span>
            <span class="spec-value highlight">${card.purchaseOffer.durationMonths}个月</span>
          </div>
        `
            : ''
        }
        ${
          card.loungeAccess
            ? `
          <div class="spec" role="listitem">
            <span class="spec-label">贵宾厅</span>
            <span class="spec-value highlight">${card.loungeAccess.type === 'priority-pass' ? 'Priority Pass' : card.loungeAccess.type}${card.loungeAccess.visits === 'unlimited' ? ' 无限次' : card.loungeAccess.visits ? ` ${card.loungeAccess.visits}次/年` : ''}</span>
          </div>
        `
            : ''
        }
      </div>

      <div class="tags" aria-label="标签">
        ${card.category.map((cat) => `<span class="tag tag-blue">${CATEGORY_LABELS[cat] || cat}</span>`).join('')}
        ${card.foreignTransactionFee === 0 ? '<span class="tag tag-green">免外汇费</span>' : ''}
        ${card.signUpBonus ? '<span class="tag tag-green">开卡奖励</span>' : ''}
        ${card.verificationStatus === 'verified' ? '<span class="verification verified">✅ 官网核实</span>' : card.verificationStatus === 'partial' ? `<span class="verification partial">⚠️ ${card.verificationSource || '部分核实'}</span>` : '<span class="verification unverified">❓ 未核实</span>'}
      </div>

      <label class="compare-checkbox" onclick="event.stopPropagation()" style="margin-top:10px;display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--text3);cursor:pointer;">
        <input type="checkbox" data-compare="${card.id}" ${state.compareIds.has(card.id) ? 'checked' : ''} onchange="window.toggleCompare('${card.id}')" aria-label="将 ${card.nameZh} 加入对比">
        加入对比
      </label>
    </article>
  `
    )
    .join('');
}

function toggleCompare(id: string) {
  if (state.compareIds.has(id)) {
    state.compareIds.delete(id);
  } else if (state.compareIds.size < 4) {
    state.compareIds.add(id);
  }
  updateCompareBar();
  // Update checkboxes
  document.querySelectorAll(`input[data-compare]`).forEach((cb) => {
    const cid = (cb as HTMLInputElement).dataset.compare!;
    (cb as HTMLInputElement).checked = state.compareIds.has(cid);
  });
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar')!;
  const items = document.getElementById('compare-items')!;
  if (state.compareIds.size === 0) {
    bar.classList.remove('visible');
    return;
  }
  bar.classList.add('visible');
  items.innerHTML = Array.from(state.compareIds)
    .map((id) => {
      const card = cards.find((c) => c.id === id)!;
      return `<div class="compare-chip">
      ${card.nameZh}
      <span class="remove" onclick="event.stopPropagation(); window.toggleCompare('${id}')">&times;</span>
    </div>`;
    })
    .join('');
}

function showCompareModal() {
  if (state.compareIds.size < 2) return;
  const modal = document.getElementById('compare-modal')!;
  const wrap = document.getElementById('compare-table-wrap')!;
  const selected = Array.from(state.compareIds).map((id) => cards.find((c) => c.id === id)!);

  const rows = [
    { label: '发卡机构', fn: (c: CreditCard) => c.issuerZh },
    { label: '年费', fn: (c: CreditCard) => (c.annualFee === 'free' ? '免费' : `£${c.annualFee}`) },
    {
      label: 'APR',
      fn: (c: CreditCard) => (c.representativeApr === 0 ? 'N/A' : c.representativeApr + '%'),
    },
    {
      label: '海外FX费',
      fn: (c: CreditCard) =>
        c.foreignTransactionFee === 0 ? '0% ✅' : c.foreignTransactionFee + '%',
    },
    {
      label: '开卡奖励',
      fn: (c: CreditCard) =>
        c.signUpBonus ? `${c.signUpBonus.amount} ${c.signUpBonus.currency}` : '—',
    },
    {
      label: '消费回馈',
      fn: (c: CreditCard) => c.earnRate.map((r) => `${r.rate} ${r.description}`).join('; ') || '—',
    },
    {
      label: '余额转移',
      fn: (c: CreditCard) =>
        c.balanceTransfer
          ? `0% ${c.balanceTransfer.durationMonths}月 (${c.balanceTransfer.feePercent || 0}%费)`
          : '—',
    },
    {
      label: '0%消费',
      fn: (c: CreditCard) => (c.purchaseOffer ? `${c.purchaseOffer.durationMonths}个月` : '—'),
    },
    {
      label: '贵宾厅',
      fn: (c: CreditCard) =>
        c.loungeAccess
          ? `${c.loungeAccess.type} ${c.loungeAccess.visits === 'unlimited' ? '无限' : c.loungeAccess.visits || ''}`
          : '—',
    },
    { label: '卡组织', fn: (c: CreditCard) => c.network.toUpperCase() },
    {
      label: '类别',
      fn: (c: CreditCard) => c.category.map((cat) => CATEGORY_LABELS[cat] || cat).join(', '),
    },
  ];

  wrap.innerHTML = `<table class="compare-table">
    <thead>
      <tr>
        <th></th>
        ${selected.map((c) => `<th>${c.nameZh}<br><small style="color:var(--text3)">${c.name}</small></th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows
        .map(
          (row) => `<tr>
        <td>${row.label}</td>
        ${selected.map((c) => `<td>${row.fn(c)}</td>`).join('')}
      </tr>`
        )
        .join('')}
    </tbody>
  </table>`;

  modal.classList.add('visible');
}

// Expose to global for inline handlers
declare global {
  interface Window {
    toggleCompare: (id: string) => void;
  }
}
window.toggleCompare = toggleCompare;

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/uk-credit-cards/sw.js').catch(() => {
      // Service worker registration failed, app still works
    });
  });
}

init();

import type { CreditCard, CardCategory, CardFilters } from './data/types';
import { cards, getUniqueIssuers } from './data/cards';
import { t, getLang, setLang, type Key } from './i18n';
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

const NETWORK_COLORS: Record<string, string> = {
  amex: '#2e8bc0',
  visa: '#1a1f71',
  mastercard: '#eb001b',
  other: '#6366f1',
};

const CAT_KEYS: Record<CardCategory, Key> = {
  'travel': 'cat.travel',
  'cashback': 'cat.cashback',
  'rewards': 'cat.rewards',
  'balance-transfer': 'cat.balance-transfer',
  'purchase': 'cat.purchase',
  'credit-builder': 'cat.credit-builder',
  'airline': 'cat.airline',
  'hotel': 'cat.hotel',
  'bnpl': 'cat.bnpl',
  'student': 'cat.student',
  'bad-credit': 'cat.bad-credit',
  'other': 'cat.other',
};

function init() {
  const params = new URLSearchParams(window.location.search);
  const urlLang = params.get('lang') as 'zh' | 'en' | null;
  if (urlLang && (urlLang === 'zh' || urlLang === 'en')) {
    setLang(urlLang);
  }
  const lang = getLang();
  setLang(lang);

  const app = document.getElementById('app')!;
  render(app);
}

function render(app: HTMLElement) {
  document.title = t('meta.title');
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', t('meta.desc'));

  app.innerHTML = `
    <div class="theme-toggle">
      <button class="theme-btn" data-theme="dark" aria-label="${t('theme.dark')}">🌙</button>
      <button class="theme-btn" data-theme="light" aria-label="${t('theme.light')}">☀️</button>
      <button class="lang-btn" id="lang-toggle" aria-label="Switch language">${t('lang.label')}</button>
    </div>

    <div class="container">
      <header class="header">
        <h1>${t('header.title')}</h1>
        <p class="subtitle">${t('header.sub', { issuers: getUniqueIssuers().length, cards: cards.length })}</p>
      </header>

      <div class="stats">
        <div class="stat-card"><div class="num">${cards.length}+</div><div class="label">${t('stat.cards')}</div></div>
        <div class="stat-card"><div class="num">${getUniqueIssuers().length}+</div><div class="label">${t('stat.issuers')}</div></div>
        <div class="stat-card"><div class="num">${cards.filter(c => c.verificationStatus === 'verified').length}</div><div class="label">${t('stat.verified')}</div></div>
        <div class="stat-card"><div class="num">${cards.filter(c => c.foreignTransactionFee === 0).length}</div><div class="label">${t('stat.noFx')}</div></div>
        <div class="stat-card"><div class="num">${cards.filter(c => c.annualFee === 'free').length}</div><div class="label">${t('stat.free')}</div></div>
      </div>

      <div class="controls">
        <div class="controls-inner">
          <div class="search-box">
            <span class="icon">🔍</span>
            <input type="text" id="search" placeholder="${t('search.placeholder')}" />
          </div>
          <select class="sort-select" id="sort">
            <option value="name-asc">${t('sort.name.asc')}</option>
            <option value="name-desc">${t('sort.name.desc')}</option>
            <option value="fee-asc">${t('sort.fee.asc')}</option>
            <option value="fee-desc">${t('sort.fee.desc')}</option>
            <option value="apr-asc">${t('sort.apr.asc')}</option>
            <option value="apr-desc">${t('sort.apr.desc')}</option>
            <option value="issuer-asc">${t('sort.issuer')}</option>
          </select>
        </div>
        <div class="filter-group" id="category-filters"></div>
        <div class="toggle-bar">
          <button class="toggle-btn" id="toggle-no-fx">${t('toggle.noFx')}</button>
          <button class="toggle-btn" id="toggle-lounge">${t('toggle.lounge')}</button>
          <button class="toggle-btn" id="toggle-bonus">${t('toggle.bonus')}</button>
          <button class="toggle-btn" id="toggle-free">${t('toggle.free')}</button>
        </div>
      </div>

      <div class="card-grid" id="card-grid"></div>
    </div>

    <div class="compare-bar" id="compare-bar">
      <div class="compare-bar-inner">
        <div class="compare-items" id="compare-items"></div>
        <button class="compare-btn" id="compare-btn">${t('compare.btn')}</button>
      </div>
    </div>

    <div class="modal-overlay" id="compare-modal">
      <div class="modal">
        <h2>
          ${t('compare.title')}
          <button class="close-btn" id="close-modal">&times;</button>
        </h2>
        <div class="table-wrap" id="compare-table-wrap"></div>
      </div>
    </div>

    <footer class="footer container">
      <strong>${t('footer.sources')}</strong>${t('footer.sourcesVal')}<br>
      <strong>${t('footer.verify')}</strong>${t('footer.verifyVal')}<br>
      <strong>${t('footer.note')}</strong>${t('footer.noteVal')}<br>
      <a href="https://github.com/Klausc06/uk-credit-cards">GitHub: Klausc06/uk-credit-cards</a>
    </footer>
  `;

  setupTheme();
  setupLangToggle();
  setupCategoryFilters();
  setupEventListeners();
  applyFilters();
}

function setupLangToggle() {
  document.getElementById('lang-toggle')!.addEventListener('click', () => {
    const next = getLang() === 'zh' ? 'en' : 'zh';
    setLang(next);
    render(document.getElementById('app')!);
  });
}

function setupTheme() {
  const btns = document.querySelectorAll('.theme-btn') as NodeListOf<HTMLButtonElement>;
  const saved = localStorage.getItem('theme') || 'dark';
  setTheme(saved);
  btns.forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.theme!));
  });
}

function setTheme(th: string) {
  document.documentElement.setAttribute('data-theme', th);
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', (btn as HTMLElement).dataset.theme === th);
  });
  localStorage.setItem('theme', th);
}

function setupCategoryFilters() {
  const container = document.getElementById('category-filters')!;
  const allCats = new Set<CardCategory>();
  cards.forEach(c => c.category.forEach(cat => allCats.add(cat)));
  const sorted = Array.from(allCats).sort();
  sorted.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip';
    btn.dataset.category = cat;
    btn.textContent = t(CAT_KEYS[cat] || 'cat.other');
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

  document.getElementById('toggle-no-fx')!.addEventListener('click', function(this: HTMLButtonElement) {
    state.filters.noForeignFee = !state.filters.noForeignFee;
    this.classList.toggle('active', state.filters.noForeignFee);
    applyFilters();
  });

  document.getElementById('toggle-lounge')!.addEventListener('click', function(this: HTMLButtonElement) {
    state.filters.hasLounge = !state.filters.hasLounge;
    this.classList.toggle('active', state.filters.hasLounge);
    applyFilters();
  });

  document.getElementById('toggle-bonus')!.addEventListener('click', function(this: HTMLButtonElement) {
    state.filters.hasSignUpBonus = !state.filters.hasSignUpBonus;
    this.classList.toggle('active', state.filters.hasSignUpBonus);
    applyFilters();
  });

  document.getElementById('toggle-free')!.addEventListener('click', function(this: HTMLButtonElement) {
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
  state.filteredCards = cards.filter(card => {
    if (f.search) {
      const q = f.search;
      const haystack = [
        card.name, card.nameZh, card.issuer, card.issuerZh,
        ...(card.specialFeatures || []), ...card.pros,
        ...card.category, card.network,
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (f.categories.length > 0 && !f.categories.some(c => card.category.includes(c))) return false;
    if (f.noForeignFee && card.foreignTransactionFee !== 0) return false;
    if (f.hasLounge && !card.loungeAccess) return false;
    if (f.hasSignUpBonus && !card.signUpBonus) return false;
    if (f.maxAnnualFee !== null && card.annualFee !== 'free' && card.annualFee > f.maxAnnualFee) return false;
    return true;
  });

  state.filteredCards.sort((a, b) => {
    const dir = f.sortOrder === 'asc' ? 1 : -1;
    switch (f.sortBy) {
      case 'name': return dir * a.name.localeCompare(b.name);
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
      case 'issuer': return dir * a.issuer.localeCompare(b.issuer);
      default: return 0;
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
        <h3>${t('empty.title')}</h3>
        <p>${t('empty.desc')}</p>
      </div>
    `;
    return;
  }

  const isEn = getLang() === 'en';

  grid.innerHTML = state.filteredCards.map((card, i) => {
    const cardName = isEn ? card.name : card.nameZh;
    const cardIssuer = isEn ? card.issuer : card.issuerZh;
    const specEarn = t('spec.earn');
    const specFx = t('spec.fxFee');
    const specApr = t('spec.apr');
    const specBt = t('spec.bt');
    const specPurchase = t('spec.purchase');
    const specLounge = t('spec.lounge');

    return `
    <div class="card" data-network="${card.network}" data-id="${card.id}" style="animation-delay: ${i * 0.03}s" onclick="window.open('${card.url}', '_blank', 'noopener')">
      <div class="card-header">
        <div>
          <div class="card-issuer">${cardIssuer}</div>
          <div class="card-name">${cardName}</div>
        </div>
        <div class="card-fee">
          ${card.annualFee === 'free'
            ? `<span class="amount free">${t('val.free')}</span>`
            : `<span class="amount">£${card.annualFee}</span>`
          }
          ${card.annualFeeNote ? `<span class="period">${card.annualFeeNote}</span>` : ''}
        </div>
      </div>

      <div class="specs">
        ${card.signUpBonus ? `
          <div class="spec">
            <span class="spec-label">${t('spec.bonus')}</span>
            <span class="spec-value highlight">${card.signUpBonus.amount} ${card.signUpBonus.currency}${card.signUpBonus.spendRequirement ? ` (${card.signUpBonus.spendRequirement})` : ''}</span>
          </div>
        ` : ''}
        ${card.earnRate.length > 0 ? card.earnRate.map(r => `
          <div class="spec">
            <span class="spec-label">${r === card.earnRate[0] ? specEarn : ''}</span>
            <span class="spec-value ${r.isHighlight ? 'highlight' : ''}">${r.rate} ${r.description}</span>
          </div>
        `).join('') : ''}
        ${card.foreignTransactionFee === 0 ? `
          <div class="spec">
            <span class="spec-label">${specFx}</span>
            <span class="spec-value highlight">${t('val.freeFx')}</span>
          </div>
        ` : `
          <div class="spec">
            <span class="spec-label">${specFx}</span>
            <span class="spec-value">${card.foreignTransactionFee}%</span>
          </div>
        `}
        <div class="spec">
          <span class="spec-label">${specApr}</span>
          <span class="spec-value ${typeof card.representativeApr === 'number' && card.representativeApr <= 15 ? 'highlight' : typeof card.representativeApr === 'number' && card.representativeApr > 40 ? 'warning' : ''}">${card.representativeApr === 0 ? 'N/A' : card.representativeApr + '%'}</span>
        </div>
        ${card.balanceTransfer ? `
          <div class="spec">
            <span class="spec-label">${specBt}</span>
            <span class="spec-value highlight">0% ${card.balanceTransfer.durationMonths}${t('val.monthsShort', { n: '' }).replace('{n}', '')}${card.balanceTransfer.feePercent ? ` (${card.balanceTransfer.feePercent}% ${t('val.noFee')})` : ` (${t('val.noFee')})`}</span>
          </div>
        ` : ''}
        ${card.purchaseOffer ? `
          <div class="spec">
            <span class="spec-label">${specPurchase}</span>
            <span class="spec-value highlight">${card.purchaseOffer.durationMonths}${t('val.monthsShort', { n: '' }).replace('{n}', '')}</span>
          </div>
        ` : ''}
        ${card.loungeAccess ? `
          <div class="spec">
            <span class="spec-label">${specLounge}</span>
            <span class="spec-value highlight">${card.loungeAccess.type === 'priority-pass' ? 'Priority Pass' : card.loungeAccess.type}${card.loungeAccess.visits === 'unlimited' ? ` ${t('val.unlimited')}` : card.loungeAccess.visits ? ` ${t('val.visitsYear', { n: card.loungeAccess.visits })}` : ''}</span>
          </div>
        ` : ''}
      </div>

      <div class="tags">
        ${card.category.map(cat => `<span class="tag tag-blue">${t(CAT_KEYS[cat] || 'cat.other')}</span>`).join('')}
        ${card.foreignTransactionFee === 0 ? `<span class="tag tag-green">${t('tag.noFx')}</span>` : ''}
        ${card.signUpBonus ? `<span class="tag tag-green">${t('tag.bonus')}</span>` : ''}
        ${card.verificationStatus === 'verified' ? `<span class="verification verified">${t('verify.verified')}</span>` : card.verificationStatus === 'partial' ? `<span class="verification partial">${t('verify.partial')}${card.verificationSource ? ` · ${card.verificationSource}` : ''}</span>` : `<span class="verification unverified">${t('verify.unverified')}</span>`}
      </div>

      <label class="compare-checkbox" onclick="event.stopPropagation()" style="margin-top:10px;display:flex;align-items:center;gap:6px;font-size:0.75rem;color:var(--text3);cursor:pointer;">
        <input type="checkbox" data-compare="${card.id}" ${state.compareIds.has(card.id) ? 'checked' : ''} onchange="window.toggleCompare('${card.id}')">
        ${t('compare.add')}
      </label>
    </div>
  `}).join('');
}

function toggleCompare(id: string) {
  if (state.compareIds.has(id)) {
    state.compareIds.delete(id);
  } else if (state.compareIds.size < 4) {
    state.compareIds.add(id);
  }
  updateCompareBar();
  document.querySelectorAll(`input[data-compare]`).forEach(cb => {
    const cid = (cb as HTMLInputElement).dataset.compare!;
    (cb as HTMLInputElement).checked = state.compareIds.has(cid);
  });
}

function updateCompareBar() {
  const bar = document.getElementById('compare-bar')!;
  const items = document.getElementById('compare-items')!;
  const isEn = getLang() === 'en';
  if (state.compareIds.size === 0) {
    bar.classList.remove('visible');
    return;
  }
  bar.classList.add('visible');
  items.innerHTML = Array.from(state.compareIds).map(id => {
    const card = cards.find(c => c.id === id)!;
    return `<div class="compare-chip">
      ${isEn ? card.name : card.nameZh}
      <span class="remove" onclick="event.stopPropagation(); window.toggleCompare('${id}')">&times;</span>
    </div>`;
  }).join('');
}

function showCompareModal() {
  if (state.compareIds.size < 2) return;
  const modal = document.getElementById('compare-modal')!;
  const wrap = document.getElementById('compare-table-wrap')!;
  const selected = Array.from(state.compareIds).map(id => cards.find(c => c.id === id)!);
  const isEn = getLang() === 'en';

  const rows = [
    { label: t('cmp.issuer'), fn: (c: CreditCard) => isEn ? c.issuer : c.issuerZh },
    { label: t('cmp.fee'), fn: (c: CreditCard) => c.annualFee === 'free' ? t('val.free') : `£${c.annualFee}` },
    { label: t('cmp.apr'), fn: (c: CreditCard) => c.representativeApr === 0 ? 'N/A' : c.representativeApr + '%' },
    { label: t('cmp.fx'), fn: (c: CreditCard) => c.foreignTransactionFee === 0 ? '0% ✅' : c.foreignTransactionFee + '%' },
    { label: t('cmp.bonus'), fn: (c: CreditCard) => c.signUpBonus ? `${c.signUpBonus.amount} ${c.signUpBonus.currency}` : '—' },
    { label: t('cmp.rewards'), fn: (c: CreditCard) => c.earnRate.map(r => `${r.rate} ${r.description}`).join('; ') || '—' },
    { label: t('cmp.bt'), fn: (c: CreditCard) => c.balanceTransfer ? `0% ${c.balanceTransfer.durationMonths}${t('val.monthsShort', { n: '' }).replace('{n}', '')} (${c.balanceTransfer.feePercent || 0}%)` : '—' },
    { label: t('cmp.purchase'), fn: (c: CreditCard) => c.purchaseOffer ? `${c.purchaseOffer.durationMonths}${t('val.monthsShort', { n: '' }).replace('{n}', '')}` : '—' },
    { label: t('cmp.lounge'), fn: (c: CreditCard) => c.loungeAccess ? `${c.loungeAccess.type} ${c.loungeAccess.visits === 'unlimited' ? t('val.unlimited') : c.loungeAccess.visits || ''}` : '—' },
    { label: t('cmp.network'), fn: (c: CreditCard) => c.network.toUpperCase() },
    { label: t('cmp.category'), fn: (c: CreditCard) => c.category.map(cat => t(CAT_KEYS[cat] || 'cat.other')).join(', ') },
  ];

  wrap.innerHTML = `<table class="compare-table">
    <thead>
      <tr>
        <th></th>
        ${selected.map(c => `<th>${isEn ? c.name : c.nameZh}<br><small style="color:var(--text3)">${isEn ? c.nameZh : c.name}</small></th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${rows.map(row => `<tr>
        <td>${row.label}</td>
        ${selected.map(c => `<td>${row.fn(c)}</td>`).join('')}
      </tr>`).join('')}
    </tbody>
  </table>`;

  modal.classList.add('visible');
}

(window as any).toggleCompare = toggleCompare;

init();

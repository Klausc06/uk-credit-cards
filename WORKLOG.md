# WORKLOG — UK Credit Cards Comparison Website

## 2026-05-18 14:00 — v4.1 Final Review & Fixes

### Amex snapshot re-audit (amex-all-cards.txt)
Re-read the browser accessibility tree snapshot from amex All Cards page.  
Every card's key numbers cross-checked against snapshot text.

| Card | Field | Was | Now | Source |
|------|-------|-----|-----|--------|
| Platinum | APR | (missing) | 685.3% variable | snapshot line 49 |
| Gold | Earn rate | 3x Amex Travel / 2x Airline | 2x Airline / 1x Other | snapshot: "1 point £1, 2 points airline" |
| Gold | APR | (missing) | 85.8% variable | snapshot line 221 |
| Gold | Deliveroo | (missing) | £120/yr (£5×2/mo) | snapshot: "£5 Deliveroo - twice every month" |
| Cashback Everyday | APR | (missing) | 29.1% variable | snapshot line 169 |
| Nectar | APR | (missing) | 35.8% variable | console extracted |

### Duplicates removed
- Monzo Flex appeared in BOTH "日常返现" AND "BNPL" sections. Removed from BNPL.

### Card differentiation clarified
- NatWest Reward (超市卡, £24/yr, 1%超市/0.25%其他, 2.75% FX) ≠ NatWest Travel Reward (旅行卡, £0/yr, 1%旅行/0.1%其他, 0% FX)
- Labels updated to avoid confusion.

### Missing data added
- Virgin Money Everyday Cashback: APR 27.9% (from virginmoney.com page)
- NatWest Reward: APR 31.0%, min income £10K (from natwest.com page)
- Santander All in One: APR 29.8%, min income £10,500 (from santander.co.uk page)
- Barclaycard Rewards: APR 80.1% (from barclays.co.uk page)
- TSB Platinum BT: APR 24.95%
- TSB Platinum Purchase: APR 24.95%
- TSB Advance: APR 12.95%

### Verification status for all cards
- ✅ = loaded official page via browser, extracted data via snapshot+console
- ⚠️ = blocked by bot detection OR page JS didn't render content
- 📝 = from training knowledge, NOT independently verified

### Blocked banks investigation
All attempted URLs logged. Lloyds Group (Lloyds/Halifax/BOS/MBNA) share Error 1007 system.
Triodos confirmed no credit card product (404).
John Lewis Finance: HTTP/2 protocol error.
M&S Bank: timeout.

---

## 2026-05-18 13:00 — v4 Major Expansion

### New verified cards added (official pages loaded)
- TSB: Platinum Balance Transfer (38mo BT), Platinum Purchase (26mo purchase), Advance (12.95% ongoing)
- Virgin Money: Everyday Cashback (1% 90d→0.25%), Travel (0% FX), BT, All Round
- Nationwide: Member Credit Card, Balance Transfer Card
- first direct: Gold Card, Balance Transfer Card
- Monzo Flex: Pay in 3 0%, 0% FX, brand cashback
- Tesco Bank: 6 "Clubcard Credit Cards" variants (BT 36mo, BT+Purchases 21mo, All Round 14mo, Low Fee BT 15mo, Everyday Low APR, Foundation)

### Critical corrections found
1. **Amex Nectar annual fee**: £0 → £30/yr (first year free). Verified via console from amex.com/nectar-credit-card.
2. **Tesco Clubcard earn rate**: 1 point/£1 → 1 point/£4 (~0.25%). All Tesco cards now branded "Clubcard Credit Cards."
3. **Santander Everyday**: claimed 0.5% cashback → actually 0% balance transfer card. Verified from santander.co.uk.
4. **Amazon credit card**: Amazon Platinum Mastercard (NewDay, 0.75%/0.25%) → Amazon Barclaycard (Barclays, 1%/0.5%). Verified from barclays.co.uk.
5. **Barclaycard Rewards**: APR 80.1%! Marked as high-risk. Must pay in full monthly.
6. **Virgin Money Cashback**: 1%/0.5% → 1% first 90 days / 0.25% ongoing.
7. **Santander All in One**: cashback no cap → £10/month cap.
8. **Sainsbury's Bank**: credit cards acquired by NatWest (May 2025). New applications unclear.

---

## 2026-05-18 12:00 — Initial Amex Verification

Loaded americanexpress.com/en-gb/credit-cards/all-cards via browser.  
Extracted all 16 Amex UK cards from accessibility tree snapshot:
- Personal: Platinum, Gold, BA Premium Plus, BA free, Marriott Bonvoy, Nectar, Cashback Everyday, Cashback (paid), Rewards, Vitality, Basic
- Business: Business Platinum, Business Gold, BA Accelerating Business, Amazon Business Prime, Amazon Business

Verified key numbers via snapshot text + browser console:
- Platinum: 75K MR bonus (promo), £10K/6mo, ends 26.05.26, £35K min income
- Gold: 40K MR bonus (promo), £5K/6mo, £0 first year, 4x PP, £5 Deliveroo x2/month
- Cashback Everyday: £0, 5% intro 5mo, £125 cap
- Rewards: £0, 10K MR, 1 MR/£1 — console confirmed
- Nectar: £30/yr (first year £0) — console confirmed, 2x+3x earning

Sites that failed:
- barclaycard.co.uk — JS navigation 404
- lloydsbank.com, halifax.co.uk, bankofscotland.co.uk, mbna.co.uk — Error 1007
- klarna.com — ERR_CONNECTION_CLOSED
- johnlewisfinance.com — HTTP/2 protocol error
- bank.marksandspencer.com — timeout
- triodos.co.uk — 404 (no credit card product)

Sites that worked:
- barclays.co.uk (different domain from barclaycard.co.uk!)
- santander.co.uk, natwest.com, tescobank.com, tsb.co.uk
- virginmoney.com, monzo.com, firstdirect.com, nationwide.co.uk
- hsbc.co.uk (page loads but JS dynamic content unextractable)

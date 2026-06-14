export interface CreditCard {
  id: string;
  name: string;
  nameZh: string;
  issuer: string;
  issuerZh: string;
  network: 'visa' | 'mastercard' | 'amex' | 'discover' | 'curve' | 'other';
  category: CardCategory[];
  annualFee: number | 'free';
  annualFeeNote?: string;
  signUpBonus?: SignUpBonus;
  earnRate: EarnRate[];
  representativeApr: number | 'n/a';
  foreignTransactionFee: number | 'free';
  foreignTransactionFeeNote?: string;
  balanceTransfer?: TransferOffer;
  purchaseOffer?: TransferOffer;
  loungeAccess?: LoungeAccess;
  travelInsurance?: string;
  incomeRequirement?: string;
  specialFeatures?: string[];
  pros: string[];
  cons: string[];
  url: string;
  verificationStatus: 'verified' | 'partial' | 'unverified';
  verificationSource?: string;
  lastUpdated: string;
  isBusinessCard?: boolean;
}

export type CardCategory =
  | 'travel'
  | 'cashback'
  | 'rewards'
  | 'balance-transfer'
  | 'purchase'
  | 'credit-builder'
  | 'airline'
  | 'hotel'
  | 'bnpl'
  | 'student'
  | 'bad-credit'
  | 'other';

export interface SignUpBonus {
  amount: string;
  currency: string;
  spendRequirement?: string;
  timeLimit?: string;
  expiryDate?: string;
}

export interface EarnRate {
  rate: string;
  description: string;
  isHighlight?: boolean;
}

export interface TransferOffer {
  rate: number;
  durationMonths: number;
  fee?: number;
  feePercent?: number;
}

export interface LoungeAccess {
  type: 'priority-pass' | 'dragonpass' | 'loungekey' | 'amex' | 'none';
  visits?: number | 'unlimited';
  guestPolicy?: string;
}

export interface CardFilters {
  search: string;
  categories: CardCategory[];
  networks: string[];
  maxAnnualFee: number | null;
  minCashback: number | null;
  noForeignFee: boolean;
  hasLounge: boolean;
  hasSignUpBonus: boolean;
  sortBy: 'name' | 'annualFee' | 'apr' | 'cashback' | 'issuer';
  sortOrder: 'asc' | 'desc';
}

export interface ComparisonSlot {
  cardId: string;
}

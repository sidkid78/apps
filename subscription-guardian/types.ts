
export enum SubscriptionCategory {
  ENTERTAINMENT = 'Entertainment',
  SOFTWARE = 'Software',
  WELLNESS = 'Wellness',
  UTILITIES = 'Utilities',
  FOOD = 'Food & Drink',
}

export enum PaymentFrequency {
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export interface SharedMember {
  id: string;
  name: string;
  email?: string;
  status: 'PAID' | 'PENDING';
  lastPaymentDate?: string;
  avatarUrl?: string;
}

export interface SubscriptionTier {
  name: string;
  maxStorageGB?: number;
  maxSeats?: number;
  maxScreens?: number;
  quality?: string; // e.g., "4K", "HD"
}

export interface UsageStats {
  lastUsed: string; // ISO Date
  hoursThisMonth?: number;
  loginsThisMonth?: number;
  dataUsageGB?: number;
  activeSeats?: number;
}

export interface Subscription {
  id: string;
  name: string;
  merchant: string;
  amount: number;
  currency: string;
  frequency: PaymentFrequency;
  nextRenewalDate: string; // ISO Date
  category: SubscriptionCategory;
  logoUrl: string;
  
  // AI/ML Data Points
  currentTier?: SubscriptionTier;
  usageStats?: UsageStats;
  
  features?: string[]; // e.g. "4K", "2TB Storage"
  isTrial?: boolean;
  trialEndsAt?: string;
  sharedMembersList?: SharedMember[];
}

export type UserPlan = 'FREE' | 'PREMIUM';

export interface UserConsent {
  essential: boolean;
  aiProcessing: boolean;
  sharedData: boolean;
}

export interface AffiliateOffer {
  partnerName: string;
  offerDescription: string;
  link: string;
  potentialSavings: number;
}

export interface AIAnalysisResult {
  usageScore: number;
  usageAnalysis: string;
  competitorComparison: string;
  tierRecommendation: string;
  bundleOpportunity: string;
  savingsPotential: number;
  affiliateOffer?: AffiliateOffer;
}

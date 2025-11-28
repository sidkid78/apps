
import { Subscription, SubscriptionCategory, PaymentFrequency } from '../types';

export const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    name: 'Netflix Premium',
    merchant: 'Netflix',
    amount: 22.99,
    currency: 'USD',
    frequency: PaymentFrequency.MONTHLY,
    nextRenewalDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    category: SubscriptionCategory.ENTERTAINMENT,
    logoUrl: 'https://picsum.photos/64/64?random=1',
    currentTier: {
      name: 'Premium',
      maxScreens: 4,
      quality: '4K Ultra HD'
    },
    usageStats: {
      lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      hoursThisMonth: 2, // Very low usage
    },
    features: ['4K Ultra HD', '4 Screens', 'Download'],
    sharedMembersList: [
      { id: 'm1', name: 'Mom', status: 'PAID', lastPaymentDate: new Date().toISOString(), avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mom' },
    ]
  },
  {
    id: '2',
    name: 'Dropbox Professional',
    merchant: 'Dropbox',
    amount: 19.99,
    currency: 'USD',
    frequency: PaymentFrequency.MONTHLY,
    nextRenewalDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    category: SubscriptionCategory.SOFTWARE,
    logoUrl: 'https://picsum.photos/64/64?random=2',
    currentTier: {
      name: 'Professional',
      maxStorageGB: 3000, // 3TB
    },
    usageStats: {
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dataUsageGB: 45, // Using only 45GB of 3000GB -> Clear downgrade candidate
    },
    features: ['3TB Storage', 'File Recovery'],
  },
  {
    id: '3',
    name: 'Spotify Family',
    merchant: 'Spotify',
    amount: 16.99,
    currency: 'USD',
    frequency: PaymentFrequency.MONTHLY,
    nextRenewalDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    category: SubscriptionCategory.ENTERTAINMENT,
    logoUrl: 'https://picsum.photos/64/64?random=3',
    currentTier: {
      name: 'Family',
      maxSeats: 6
    },
    usageStats: {
      lastUsed: new Date().toISOString(),
      hoursThisMonth: 80,
      activeSeats: 3, // Using 3 of 6 seats
    },
    features: ['6 Accounts', 'Ad-free'],
    sharedMembersList: [
      { id: 'm2', name: 'Alice', status: 'PAID', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
      { id: 'm3', name: 'Bob', status: 'PENDING', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
      { id: 'm4', name: 'Charlie', status: 'PAID', lastPaymentDate: new Date().toISOString(), avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie' },
    ]
  },
  {
    id: '4',
    name: 'Adobe Creative Cloud',
    merchant: 'Adobe',
    amount: 54.99,
    currency: 'USD',
    frequency: PaymentFrequency.MONTHLY,
    nextRenewalDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    category: SubscriptionCategory.SOFTWARE,
    logoUrl: 'https://picsum.photos/64/64?random=4',
    usageStats: {
      lastUsed: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // Not used in 40 days
      loginsThisMonth: 0,
    },
    features: ['All Apps', '100GB Storage'],
  },
  {
    id: '5',
    name: 'Peloton App',
    merchant: 'Peloton',
    amount: 12.99,
    currency: 'USD',
    frequency: PaymentFrequency.MONTHLY,
    nextRenewalDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    category: SubscriptionCategory.WELLNESS,
    logoUrl: 'https://picsum.photos/64/64?random=5',
    usageStats: {
      lastUsed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      loginsThisMonth: 0,
    },
    isTrial: true,
    trialEndsAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

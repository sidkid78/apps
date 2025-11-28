import { GoogleGenAI, Type } from "@google/genai";
import { Subscription, AIAnalysisResult, AffiliateOffer, UsageStats, SubscriptionTier } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeSubscription = async (subscription: Subscription): Promise<AIAnalysisResult> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key found. Returning mock analysis.");
    return getMockAnalysis(subscription);
  }

  // Construct a prompt rich with the new ML data points
  const prompt = `
    Role: Expert Financial Analyst AI.
    Task: Analyze the subscription usage against its tier limits to identify optimization opportunities (Downgrade, Cancel, Bundle).
    
    Data:
    - Service: ${subscription.name} ($${subscription.amount}/${subscription.frequency})
    - Category: ${subscription.category}
    - Current Tier Limits: ${JSON.stringify(subscription.currentTier || {})}
    - Actual Usage Stats: ${JSON.stringify(subscription.usageStats || {})}
    
    Logic to Apply:
    1. Usage Score: Calculate 0-100 based on frequency (hours/logins) vs cost.
    2. Tier Optimization: If usage (e.g., storage, seats) is < 50% of limit, recommend downgrade.
    3. Value Comparison: Compare cost per unit (e.g., cost per GB, cost per seat) vs market average.
    
    Return JSON format adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            usageScore: { type: Type.NUMBER },
            usageAnalysis: { type: Type.STRING },
            competitorComparison: { type: Type.STRING },
            tierRecommendation: { type: Type.STRING },
            bundleOpportunity: { type: Type.STRING },
            savingsPotential: { type: Type.NUMBER },
            affiliateOffer: {
              type: Type.OBJECT,
              properties: {
                partnerName: { type: Type.STRING },
                offerDescription: { type: Type.STRING },
                link: { type: Type.STRING },
                potentialSavings: { type: Type.NUMBER },
              }
            }
          },
          required: ["usageScore", "usageAnalysis", "competitorComparison", "tierRecommendation", "savingsPotential"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as AIAnalysisResult;
    }
    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Gemini Analysis Failed", error);
    return getMockAnalysis(subscription);
  }
};

// Fallback logic simulating the ML Model's decision tree
const getMockAnalysis = (subscription: Subscription): AIAnalysisResult => {
  const stats: Partial<UsageStats> = subscription.usageStats || {};
  const tier: Partial<SubscriptionTier> = subscription.currentTier || {};

  // 1. Calculate Usage Score based on simple heuristics
  let score = 85; 
  if ((stats.hoursThisMonth || 0) < 5 && !stats.dataUsageGB) score = 25;
  if (stats.loginsThisMonth === 0) score = 10;
  
  // 2. Tier Optimization Logic
  let tierRec = "Current plan fits your usage.";
  let potentialSavings = 0;

  // Case: Storage Over-provisioning (e.g. Dropbox)
  if (tier.maxStorageGB && stats.dataUsageGB) {
    const usageRatio = stats.dataUsageGB / tier.maxStorageGB;
    if (usageRatio < 0.10) {
      tierRec = `You are using only ${(usageRatio * 100).toFixed(1)}% of your ${tier.maxStorageGB}GB limit. Downgrade to a Basic plan to save money.`;
      potentialSavings += subscription.amount * 0.5; // Assume 50% savings
    }
  }

  // Case: Seat Over-provisioning (e.g. Spotify Family)
  if (tier.maxSeats && stats.activeSeats) {
    if (stats.activeSeats <= 1 && tier.maxSeats >= 4) {
      tierRec = `You are paying for a Family Plan (${tier.maxSeats} seats) but only using ${stats.activeSeats}. Downgrade to Individual.`;
      potentialSavings += 10; // Approx diff between Family and Individual
    }
  }

  // Case: Low Activity Cancellation
  if (score < 30) {
    tierRec = "Usage is extremely low. Cancellation recommended.";
    potentialSavings = subscription.amount;
  }

  // 3. Affiliate Logic
  let affiliateOffer: AffiliateOffer | undefined;
  if (subscription.category === 'Entertainment' && subscription.amount > 15) {
    affiliateOffer = {
      partnerName: "Paramount+",
      offerDescription: "Switch to Paramount+ Essentials. First month free.",
      link: "https://paramountplus.com/partner/subscription-guardian",
      potentialSavings: subscription.amount - 5.99
    };
  } else if (subscription.merchant === 'Dropbox' && potentialSavings > 0) {
    affiliateOffer = {
      partnerName: "Google One",
      offerDescription: "Get 200GB for $2.99/mo. Save significantly on storage.",
      link: "https://one.google.com/offer",
      potentialSavings: subscription.amount - 2.99
    };
  }

  return {
    usageScore: score,
    usageAnalysis: score < 30 
      ? "Usage is critically low for the price point. You rarely access this service." 
      : "You are getting reasonable value based on your activity metrics.",
    competitorComparison: affiliateOffer 
      ? `Similar services like ${affiliateOffer.partnerName} cost significantly less.` 
      : "Competitor prices are roughly comparable.",
    tierRecommendation: tierRec,
    bundleOpportunity: "Check if a bundle is available for extra savings (e.g. Disney Bundle).",
    savingsPotential: potentialSavings || (affiliateOffer?.potentialSavings || 0),
    affiliateOffer
  };
};
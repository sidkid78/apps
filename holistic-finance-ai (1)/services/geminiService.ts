import { GoogleGenAI } from "@google/genai";
import { Message, FinancialContext } from "../types";

const API_KEY = process.env.API_KEY || '';

// Base System instruction
const BASE_SYSTEM_INSTRUCTION = `
You are the Holistic Finance AI, an expert financial co-pilot. 
Your primary directive is to maximize user wealth and achieve complex goals. 
You are dedicated, data-driven, and objective.
Your advice MUST be grounded in the context provided below. 
Do not invent financial data. If a recommendation involves a trade-off, quantify the long-term impact of each choice conceptually.

CRITICAL CONSTRAINT: You are not a licensed human advisor. Do not provide specific legal, tax filing, or security recommendations. Always advise users to consult with a professional for binding decisions.

Output formatting:
- Use Markdown for structure.
- Use bolding for key figures and terms.
- Use bullet points for lists.
`;

const formatContextBlock = (context: FinancialContext): string => {
  const accountsStr = context.accountsSummary
    .map(a => `- ${a.name} (${a.type}): $${a.balance.toLocaleString()}`)
    .join('\n');

  const txStr = context.recentTransactions
    .map(t => `- ${t.date}: ${t.description} ($${t.amount.toFixed(2)}) [${t.category}]`)
    .join('\n');

  return `
--- START_PERSONAL_CONTEXT ---
NET WORTH: $${context.netWorth.toLocaleString()}
TOTAL ASSETS: $${context.assets.toLocaleString()}
TOTAL LIABILITIES: $${context.liabilities.toLocaleString()}

RISK PROFILE:
- Level: ${context.riskProfile.level}
- Equity Target: ${(context.riskProfile.equityTarget * 100).toFixed(0)}%
- Panic Score: ${context.riskProfile.panicScore}/10

ACCOUNTS:
${accountsStr}

RECENT TRANSACTIONS (Last 5):
${txStr}
--- END_PERSONAL_CONTEXT ---
`;
};

export const sendMessageToGemini = async (
    history: Message[], 
    userMessage: string, 
    context?: FinancialContext
): Promise<string> => {
  if (!API_KEY) {
    console.warn("API Key is missing. Returning mock response.");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("I'm sorry, but I cannot process your request at the moment because the API key is not configured. In a production environment, I would analyze your portfolio and provide tailored advice.");
      }, 1000);
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    let finalSystemInstruction = BASE_SYSTEM_INSTRUCTION;
    if (context) {
        finalSystemInstruction += formatContextBlock(context);
    }
    
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: finalSystemInstruction,
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      })),
    });

    const result = await chat.sendMessage({
      message: userMessage,
    });

    return result.text ?? "I couldn't generate a response. Please try again.";

  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "I encountered an error while analyzing your request. Please try again later.";
  }
};
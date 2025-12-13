
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY || "";
console.log("Gemini API Key configured:", apiKey ? "Yes (Length: " + apiKey.length + ")" : "No");

if (!apiKey) {
    console.warn("WARNING: GEMINI_API_KEY is not set. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// using gemini-2.0-flash as consistent standard
export const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export interface ParsedTransaction {
    type: "INCOME" | "EXPENSE" | "DEBT" | "REPAYMENT";
    amount: number;
    category: string;
    note?: string;
    lender?: string; // For DEBT
    debtId?: string; // For REPAYMENT logic (inferred or asked)
}

export async function parseTransaction(input: string): Promise<ParsedTransaction | null> {
    // 1. Try AI Parsing
    if (apiKey) {
        const prompt = `
        Analyze the financial transaction text and extract details into JSON.
        Input: "${input}"

        Instructions:
        - DETECT THE AMOUNT: Look for the number that represents the money value. It might be at the end, beginning, or middle. Ignore dates/times/account numbers.
        - DETECT TYPE:
            - "INCOME": salary, sold, deposit, got money.
            - "REPAYMENT": paying off a loan, paying back a friend, "paid credit card bill".
            - "DEBT": borrowing money, "credit card payment for [item]" (using credit card to buy something), loan taken.
            - "EXPENSE": spending cash/savings, paid for [item], bought [item].
        - CATEGORIZE: 
          - Expense: Food, Transport, Utilities, Health, Shopping, Entertainment, Education, Work, Family, Other.
          - Income: Salary, Business, Investment, Gift, Other.
          - Debt: Credit Card, Loan, Other.
        - NOTE: A short, clean description of *what* it is (e.g. "Perfume via Credit Card").
        - LENDER: If DEBT, who did you borrow from? (e.g. "Credit Card Company", "Bank", "Friend").
        
        Output JSON ONLY.
        Example: "uber 1020" -> {"type": "EXPENSE", "amount": 1020, "category": "Transport", "note": "Uber ride"}
        `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
            const parsed = JSON.parse(cleanText) as ParsedTransaction;
            // Validate amount exists
            if (parsed.amount) return parsed;
        } catch (error) {
            console.error("Gemini parse error:", error);
            // Fallthrough to regex
        }
    }

    // 2. Fallback Regex Parsing (Robustness)
    console.log("Using fallback regex parsing");
    const amountMatch = input.match(/(\d+(?:\.\d{1,2})?)/); // First number found
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[0]);
    const lowerInput = input.toLowerCase();

    let type: ParsedTransaction['type'] = "EXPENSE";
    let category = "Other";

    if (lowerInput.includes("salary") || lowerInput.includes("income") || lowerInput.includes("deposit")) {
        type = "INCOME";
        category = "Salary";
    } else if (lowerInput.includes("borrow") || lowerInput.includes("loan")) {
        type = "DEBT";
        category = "Loan";
    }

    // Simple category matching
    if (lowerInput.includes("food") || lowerInput.includes("eat") || lowerInput.includes("grocery")) category = "Food & Groceries";
    else if (lowerInput.includes("uber") || lowerInput.includes("taxi") || lowerInput.includes("bus") || lowerInput.includes("fuel")) category = "Transport & Fuel";

    return {
        type,
        amount,
        category,
        note: input,
    };
}

// --- PERSISTENT CACHE IMPLEMENTATION ---
const CACHE_FILE = path.join(process.cwd(), ".gemini_cache.json");

interface CacheData {
    summary: string;
    result: string;
    timestamp: number;
}

function getCache(): CacheData | null {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            const data = fs.readFileSync(CACHE_FILE, "utf-8");
            return JSON.parse(data) as CacheData;
        }
    } catch (e) {
        console.error("Failed to read cache:", e);
    }
    return null;
}

function setCache(data: CacheData) {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(data));
    } catch (e) {
        console.error("Failed to write cache:", e);
    }
}

const FALLBACK_TIPS = [
    "💡 Tip: Try to save at least 20% of your income this month.",
    "💡 Insight: Track your small daily expenses; they add up quickly!",
    "💡 Tip: Prioritize paying off high-interest debt first.",
    "💡 Tip: Review your subscriptions and cancel unused ones.",
    "💡 Insight: Building an emergency fund is key to financial stability."
];

export async function getFinancialInsights(summary: string) {
    if (!apiKey) return "Add your Gemini API feature for smart insights!";

    // 1. Try to read from persistent cache
    const cached = getCache();
    const now = Date.now();

    // Valid for 24 hours (86400000ms) if summary matches, to drastically reduce API calls
    if (cached && cached.summary === summary && (now - cached.timestamp < 86400000)) {
        console.log("Serving insights from cache");
        return cached.result;
    }

    const prompt = `
    You are a financial advisor. Based on this summary data:
    ${summary}
    
    Provide 3 brief, actionable, bullet-pointed insights or tips. Focus on saving, debt reduction, or spending trends. Keep it friendly and professional.
  `;

    try {
        console.log("Fetching new insights from Gemini...");
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // 2. Save to persistent cache
        setCache({
            summary,
            result: text,
            timestamp: now
        });

        return text;
    } catch (error: any) {
        console.error("Gemini Insights Error:", error);

        // 3. Fallback: If API fails (429/404), return cached version even if expired or mismatch slightly (better than error)
        if (cached) {
            return cached.result + "\n\n(Cached result shown due to API unavailability)";
        }

        // 4. Ultimate Fallback: Random tips
        const randomTip = FALLBACK_TIPS[Math.floor(Math.random() * FALLBACK_TIPS.length)];
        return randomTip + " (AI unavailable momentarily)";
    }
}

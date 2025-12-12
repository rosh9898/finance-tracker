
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("No API key found in .env");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        // There isn't a direct list method exposed easily on the main class in some versions,
        // but we can try a simple generation with a known model or use the admin API if available.
        // The SDK actually doesn't make listing easy without the model manager.
        // Let's try the ModelManager if it exists or just try a standard request to a known fallback.

        // Actually, we can just try to hit the API manually to list models if the SDK is obscure.
        // But wait, checking SDK docs...
        // The SDK usually allows specific models.

        console.log("Testing gemini-1.5-flash...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent("Hello, are you there?");
            console.log("Success with gemini-1.5-flash:", result.response.text());
        } catch (e) {
            console.error("Failed gemini-1.5-flash:", e.message);
        }

        console.log("Testing gemini-pro...");
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hello, are you there?");
            console.log("Success with gemini-pro:", result.response.text());
        } catch (e) {
            console.error("Failed gemini-pro:", e.message);
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();


import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModelNames() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=100`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.models) {
            console.log("Model Names:");
            data.models.forEach(m => console.log(m.name));
        } else {
            console.log("No models found or error:", data);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

listModelNames();


import OpenAI from "openai";
import { configDotenv } from "dotenv";

configDotenv()


export const client = new OpenAI({
    apiKey: process.env.OPEN_ROUTER_API,
    baseURL: 'https://openrouter.ai/api/v1' || "https://api.groq.com/openai/v1"
});

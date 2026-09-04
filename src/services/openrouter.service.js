import OpenAI from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_ADMIN_KEY,
});

export default async function openrouter(userInput = "Hello, how are you?") {
    const response = await openai.chat.completions.create({
            model: 'minimax/minimax-m3:free',
            messages: [
                {
                    role: 'user',
                    content: userInput,
                }
            ]
        });
    return response.choices[0].message.content;
}
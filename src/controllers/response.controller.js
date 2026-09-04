import openrouter from '../services/openrouter.service.js';

export const postResponse = async (req, res) => {
    try {
        const result = await openrouter(req.body.userInput);
        res.json(result);
    } catch (error) {
        console.error("Error fetching response:", error);
        res.status(500).json({ error: "Failed to fetch response" });
    }
};
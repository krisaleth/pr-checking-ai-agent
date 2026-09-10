import { fetchPRDiff, postPullRequestComment } from '../services/github.service.js';
import openrouter from '../services/openrouter.service.js';

export default async function AnalysisPRResponse(req, res) {
    try {
        const { owner, repo, pull_number } = req.params;
        if (!owner || !repo || !pull_number) {
            return res.status(400).json({ error: "Thiếu thông tin owner, repo hoặc pull_number" });
        }
        const diffText = await fetchPRDiff(owner, repo, pull_number);
        const analysisAIResponse = await openrouter(diffText)
        res.json({ summary: analysisAIResponse });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}
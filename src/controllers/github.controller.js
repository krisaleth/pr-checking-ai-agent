import { fetchPRDiff, postPullRequestComment } from '../services/github.service.js';

export const getPullRequestDiff = async (req, res) => {
    try {
        const { owner, repo, pull_number } = req.params;
        if (!owner || !repo || !pull_number) {
            return res.status(400).json({ error: "Thiếu thông tin owner, repo hoặc pull_number" });
        }
        const diffText = await fetchPRDiff(owner, repo, pull_number);
        res.set('Content-Type', 'text/plain');
        res.send(diffText);
    } catch (error) {
        console.error("Error fetching pull request diff:", error);
        res.status(500).json({ error: "Failed to fetch pull request diff" });
    }
}
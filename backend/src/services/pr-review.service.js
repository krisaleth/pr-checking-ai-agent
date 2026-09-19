import {
    fetchPRFilesWithInstallation,
} from './github.service.js';

import openrouter from './openrouter.service.js';
import { mapFindingsToDiff } from './diff.service.js';

export async function reviewPullRequest({
    owner,
    repo,
    pullNumber,
    installationId,
}) {
    if (!owner || !repo || !pullNumber || !installationId) {
        throw new Error(
            'owner, repo, pullNumber and installationId are required'
        );
    }

    console.log(
        `[PR Review] Starting review ${owner}/${repo}#${pullNumber}`
    );

    const githubData =
        await fetchPRFilesWithInstallation(
            owner,
            repo,
            pullNumber,
            installationId
        );

    console.log(
        `[PR Review] Changed files: ${githubData.length}`
    );

    const review =
        await openrouter(githubData);

    console.log(
        `[PR Review] AI findings: ${review.findings.length}`
    );

    const aiFindingsCount = review.findings.length;

    const { mapped, unmapped } =
        mapFindingsToDiff(githubData, review.findings);

    console.log(
        `[PR Review] Mapped findings: ${mapped.length}`
    );

    console.log(
        `[PR Review] Unmapped findings: ${unmapped.length}`
    );

    return {
        ...review,
        ai_findings_count: aiFindingsCount,
        findings: mapped,
        unmapped_findings: unmapped,
    };
}
import { getInstallationToken } from './github-app.service.js';

export async function createPullRequestReview({
    owner,
    repo,
    pullNumber,
    installationId,
    commitId,
    findings,
}) {
    if (
        !owner ||
        !repo ||
        !pullNumber ||
        !installationId ||
        !commitId
    ) {
        throw new Error(
            'owner, repo, pullNumber, installationId and commitId are required'
        );
    }

    if (!Array.isArray(findings)) {
        throw new Error('findings must be an array');
    }

    if (findings.length === 0) {
        console.log(
            '[GitHub Review] No mapped findings. Skipping review.'
        );

        return null;
    }

    // Validate findings before sending them to GitHub
    const validFindings = findings.filter((finding) => {
        return (
            finding.file &&
            Number.isInteger(finding.line) &&
            finding.line > 0 &&
            finding.side === 'RIGHT' &&
            ['critical', 'major', 'minor', 'nit'].includes(
                finding.severity
            ) &&
            typeof finding.confidence === 'number' &&
            finding.confidence >= 0.85
        );
    });

    if (validFindings.length === 0) {
        console.log(
            '[GitHub Review] No valid findings to comment.'
        );

        return null;
    }

    const token =
        await getInstallationToken(installationId);

    const comments = validFindings.map((finding) => ({
        path: finding.file,
        line: finding.line,
        side: finding.side,
        body: buildCommentBody(finding),
    }));

    const url =
        `https://api.github.com/repos/${owner}/${repo}` +
        `/pulls/${pullNumber}/reviews`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            commit_id: commitId,
            event: 'COMMENT',
            comments,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();

        throw new Error(
            `GitHub Review API failed ` +
            `(${response.status}): ${errorBody}`
        );
    }

    return await response.json();
}

function buildCommentBody(finding) {
    const severity =
        finding.severity?.toUpperCase() || 'UNKNOWN';

    let body =
        `**${severity}** — ${finding.title}\n\n` +
        `${finding.explanation}`;

    if (finding.suggested_fix) {
        body +=
            `\n\n**Suggested fix:**\n` +
            `${finding.suggested_fix}`;
    }

    return body;
}
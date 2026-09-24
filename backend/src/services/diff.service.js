export function getChangedLines(patch) {
    const changedLines = new Set();

    if (!patch) {
        return changedLines;
    }

    const lines = patch.split('\n');
    let newLineNumber = 0;

    for (const line of lines) {
        const hunkMatch = line.match(
            /^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/
        );

        if (hunkMatch) {
            newLineNumber = Number(hunkMatch[1]);
            continue;
        }

        if (line.startsWith('+') && !line.startsWith('+++')) {
            changedLines.add(newLineNumber);
            newLineNumber++;
            continue;
        }

        if (line.startsWith('-') && !line.startsWith('---')) {
            continue;
        }

        newLineNumber++;
    }

    return changedLines;
}

export function mapFindingsToDiff(githubFiles, findings) {
    const fileMap = new Map();

    for (const file of githubFiles) {
        if (!file.patch) {
            continue;
        }

        fileMap.set(
            file.filename,
            getChangedLines(file.patch)
        );
    }

    const mapped = [];
    const unmapped = [];

    for (const finding of findings) {
        if (!finding.line) {
            unmapped.push({
                ...finding,
                reason: 'Finding has no line number',
            });
            continue;
        }

        const changedLines = fileMap.get(finding.file);

        if (!changedLines) {
            unmapped.push({
                ...finding,
                reason: 'File has no usable patch',
            });
            continue;
        }

        if (!changedLines.has(finding.line)) {
            unmapped.push({
                ...finding,
                reason: 'Line is not part of the changed diff',
            });
            continue;
        }

        mapped.push(finding);
    }

    return { mapped, unmapped };
}
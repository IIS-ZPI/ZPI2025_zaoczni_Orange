export type NbpApiIssueKind =
    | 'offline'
    | 'timeout'
    | 'http_client'
    | 'http_server'
    | 'rate_limit'
    | 'misconfigured'
    | 'unknown';

export type NbpApiIssue = {
    kind: NbpApiIssueKind;
    httpStatus?: number;
    details?: string;
};

export type NbpApiIssueListener = (issue: NbpApiIssue | null) => void;

let currentIssue: NbpApiIssue | null = null;
const listeners = new Set<NbpApiIssueListener>();

export function getNbpApiIssue(): NbpApiIssue | null {
    return currentIssue;
}

export function setNbpApiIssue(issue: NbpApiIssue): void {
    currentIssue = issue;
    for (const listener of listeners) {
        listener(currentIssue);
    }
}

export function clearNbpApiIssue(): void {
    if (currentIssue === null) return;
    currentIssue = null;
    for (const listener of listeners) {
        listener(currentIssue);
    }
}

export function subscribeNbpApiIssue(listener: NbpApiIssueListener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

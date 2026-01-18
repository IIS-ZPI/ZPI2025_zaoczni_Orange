export type MockDataStatusListener = (usingMockData: boolean) => void;

let usingMockData = false;
const listeners = new Set<MockDataStatusListener>();

export function getUsingMockData(): boolean {
    return usingMockData;
}

export function setUsingMockData(next: boolean): void {
    if (usingMockData === next) return;
    usingMockData = next;
    for (const listener of listeners) {
        listener(usingMockData);
    }
}

export function subscribeUsingMockData(listener: MockDataStatusListener): () => void {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

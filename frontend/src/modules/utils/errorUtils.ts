export function getErrorMessages(error: any): string[] {
    if (!error) return [];

    const msg = error.message ?? '';

    if (Array.isArray(msg)) {
        return msg;
    }

    if (typeof msg === 'string') return [msg];

    return [String(error)];
}
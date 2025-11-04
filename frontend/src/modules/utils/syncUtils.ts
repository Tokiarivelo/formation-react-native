export function isoToTimestamp(iso?: string | number | Date): number | undefined {
    if (!iso) return undefined;
    const d = new Date(iso);
    return isNaN(d.getTime()) ? undefined : d.getTime();
}

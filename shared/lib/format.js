export function formatDurationLong(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours === 0)
        return `${minutes}m`;
    return `${hours}h ${minutes}m`;
}
export function formatClockTime(timestampMs) {
    return new Date(timestampMs).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
}

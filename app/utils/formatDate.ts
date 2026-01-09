/**
 * Date formatting utilities for consistent date display across the application.
 * Converts raw ISO date strings into human-readable formats.
 */

/**
 * Formats a date string into a readable format.
 * @param dateStr - ISO date string (e.g., "2026-01-08T04:15:53.880378Z")
 * @returns Formatted date string (e.g., "Jan 8, 2026")
 */
export function formatDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";

    try {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    } catch {
        return dateStr;
    }
}

/**
 * Formats a date string into a readable format with time.
 * @param dateStr - ISO date string (e.g., "2026-01-08T04:15:53.880378Z")
 * @returns Formatted date-time string (e.g., "Jan 8, 2026, 12:15 PM")
 */
export function formatDateTime(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";

    try {
        return new Date(dateStr).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    } catch {
        return dateStr;
    }
}

/**
 * Formats a date string into a relative time format (e.g., "2 days ago").
 * Falls back to formatted date if more than 30 days ago.
 * @param dateStr - ISO date string
 * @returns Relative time string or formatted date
 */
export function formatRelativeDate(dateStr: string | null | undefined): string {
    if (!dateStr) return "—";

    try {
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffMs / (1000 * 60));
                return diffMinutes <= 1 ? "Just now" : `${diffMinutes} minutes ago`;
            }
            return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
        }

        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7);
            return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
        }

        // Fallback to formatted date for older dates
        return formatDate(dateStr);
    } catch {
        return dateStr;
    }
}

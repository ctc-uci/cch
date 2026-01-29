export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  const answer = date.toISOString().split('T')[0] || ''; // Returns YYYY-MM-DD format
  return answer
};

/**
 * Parse a date string as a local calendar date when it's date-only (YYYY-MM-DD).
 * new Date("2005-02-13") is UTC midnight, which in US timezones shows as the previous day.
 */
function parseAsLocalDate(dateString: string): Date {
  const s = String(dateString).trim();
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (dateOnly) {
    const [, y, m, d] = dateOnly;
    return new Date(parseInt(y!, 10), parseInt(m!, 10) - 1, parseInt(d!, 10));
  }
  return new Date(dateString);
}

export const formatDateString = (dateString: string): string => {
  if (dateString === null || dateString === undefined || dateString === "") {
    return "";
  }
  const date = parseAsLocalDate(dateString);
  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Uses browser's timezone and returns M/D/YYYY format
  });
};

export const formatDateStringForAPI = (date: Date): string => {
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

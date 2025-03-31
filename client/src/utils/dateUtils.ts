export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  const answer = date.toISOString().split('T')[0] || ''; // Returns YYYY-MM-DD format
  return answer
};

export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, // Uses browser's timezone and returns MM/DD/YYYY format
  })
}

export const formatDateStringForAPI = (date: Date): string => {
  return date.toLocaleDateString("en-US", { timeZone: "UTC" });
}

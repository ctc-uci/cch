export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  const answer = date.toISOString().split('T')[0] || ''; // Returns YYYY-MM-DD format
  return answer
};

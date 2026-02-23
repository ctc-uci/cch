export const LOCATION_OPTIONS = [
  "Bridge",
  "Cypress",
  "Glencoe",
  "CCH Office",
  "CCH Other",
] as const;

export type LocationOption = (typeof LOCATION_OPTIONS)[number];

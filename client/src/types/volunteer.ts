export const eventTypes = [
  "Easter",
  "Thanksgiving",
  "Gala",
  "Christmas",
  "Office",
  "Other",
];

export type Volunteer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  eventType: string;
  date: string;
  hours: number;
  value: number;
  total: number;
};

export type VolunteerForm = {
  firstName: string;
  lastName: string;
  email: string;
  eventType: string;
  date: string;
  hours: string;
  value: string;
};

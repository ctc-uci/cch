export type UserType = "user" | "admin";

export type User = {
  id: number;
  email: string;
  firebaseUid: string;
  role: UserType;
};

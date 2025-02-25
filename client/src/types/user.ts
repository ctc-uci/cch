export type UserType = "user" | "admin" | "client";

export type User = {
  id: number;
  email: string;
  firebaseUid: string;
  role: UserType;
};

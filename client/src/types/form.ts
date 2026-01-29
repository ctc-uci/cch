import type { Table } from "@tanstack/react-table";

export type Form = {
  id: number;
  hashedId: number;
  date: string;
  name: string;
  title: FormType;
  cmId?: number;
  sessionId?: string; // For dynamic forms using intake_responses
};

export type FormType =
  | "All Forms"
  | "Initial Screeners"
  | "Exit Surveys"
  | "Success Stories"
  | "Random Client Surveys"
  | "Front Desk Monthly Statistics"
  | "Case Manager Monthly Statistics"
  | "Client Tracking Statistics (Intake Statistics)"
  | "Initial Screener Form"
  | "Success Story Form"
  | "Client Exit Survey Form"
  | "Random Client Survey Form";

  export type TabData = {
    tabName: string;
    table: Table<Form>;
    data: Form[];
  }

export type TableType = {
  type: string; 
};
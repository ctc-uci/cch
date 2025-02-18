export type MonthlyStat = {
  id?: number;
  date: string;
  cmId: number;
  babiesBorn: number;
  enrolledInSchool: string;
  earnedDegree: string;
  earnedDriversLicense: string;
  reunifiedWithChildren: string;
  womensBirthdays: string;
  childrensBirthdays: string;
  birthdayGiftCardValues: number;
  foodCardValues: number;
  busPasses: number;
  gasCardsValue: number;
  phoneContacts: number;
  inpersonContacts: number;
  emailContacts: number;
  interviewsScheduled: number;
  interviewsConducted: number;
  positiveTests: number;
  noCallNoShows: number;
  other: string;
};

// TODO: create shared types for monthly stats so frontend and backend are in sync
export type MonthlyCount = {
	month: string;
	count: number;
}

export type TableRow = {
	categoryName: string;
	monthlyCounts: MonthlyCount[];
	total: number;
}

export interface TableData {
  [key: string]: TableRow;
}

export type Table = {
  tableName: string;
  tableData: TableData;
};

export type TabData = {
  tabName: string;
  tables: Table[]
}

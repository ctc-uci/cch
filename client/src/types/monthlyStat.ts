export type CmMonthlyStat = {
  id: number;
  date: string;
  cm_id: number;
  total_number_of_contacts: number;
  women_birthdays: number;
  kid_birthdays: number;
  birthday_cards: number;
  birthday_cards_value: number;
  food_cards: number;
  food_cards_value: number;
  bus_passes: number;
  bus_passes_value: number;
  gas_cards: number;
  gas_cards_value: number;
  women_healthcare_referrals: number;
  kid_healthcare_referrals: number;
  women_counseling_referrals: number;
  kid_counseling_referrals: number;
  babies_born: number;
  women_degrees_earned: number;
  women_enrolled_in_school: number;
  women_licenses_earned: number;
  reunifications: number;
  number_of_interviews_conducted: number;
  number_of_positive_tests: number;
  number_of_ncns: number;
  number_of_others: number;
  number_of_interviews_accepted: number;
}


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

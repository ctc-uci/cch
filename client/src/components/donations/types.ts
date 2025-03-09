enum Category {
  FOOD = "food",
  CLIENT = "client",
}

enum Donor {
  PANERA = "panera",
  SPROUTS = "sprouts",
  COPIA = "copia",
  MCDONALDS = "mcdonalds",
  PANTRY = "pantry",
  GRAND_THEATER = "grand theater",
  COSTCO = "costco",
}
interface Donation {
  id: number;
  donor: Donor;
  date: string;
  category: Category;
  weight: number;
  value: number;
}

interface DonationBody{
  donor: Donor,
  date: string,
  category: Category,
  weight: number,
  value: number,
}

interface DonationForm {
  date: string;
  donor: string;
  category: string;
  weight: string;
  value: string;
}

export type { Donation, DonationBody};
export { Category, Donor };

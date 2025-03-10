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
  total: number;
}

interface DonationForm {
    donor: string;
    category: string;
    id: number | null;
    date: string;
    weight: number;
    value: number;
}

export type { Donation, DonationForm};
export { Category, Donor };

export type MonthlyStat = {
    id?: number; 
    date: Date | string;
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
  
export type IntakeStatisticsForm = {
  // Page 1 Fields
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  phoneNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  priorLivingSituation: string;
  entryDate: string;
  medical: boolean;
  assignedCaseManager: string;
  site: string;
  clientGrant: string;
  calOptimaFundedSite: boolean;
  uniqueId: string;
  disablingConditionForm: boolean;
  familySize: number;
  numberOfChildren: number;
  numberOfChildrenWithDisability: number;
  children: Array<{
    firstName: string;
    lastName: string;
    birthday: string;
    age: number;
    race: string;
  }>;
  month: string;
  caseManager: string;
  ethnicity: string;

  // Page 2 Fields
  pregnant: boolean;
  cityLastPermanentAddress: string;
  whereClientSleptLastNight: string;
  lastCityResided: string;
  lastCityHomeless: string;
  beenInShelterLast5Years: boolean;
  numberofSheltersLast5Years: number;
  durationHomeless: string;
  chronicallyHomeless: boolean;
  employedUponEntry: boolean;
  attendingSchoolUponEntry: boolean;
  signedPhotoRelease: boolean;
  highRisk: boolean;
  currentlyEmployed: boolean;
  dateLastEmployment: string;
  historyDomesticViolence: boolean;
  historySubstanceAbuse: boolean;
  supportSystem: boolean;
  supportHousing?: boolean;
  supportFood?: boolean;
  supportChildcare?: boolean;
  diagnosedMentalHealth: boolean;
  undiagnosedMentalHealth: boolean;
  transportation: boolean;
  convictedCrime: boolean;
};

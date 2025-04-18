export type IntakeStatisticsForm = {
  date: string;
  // Page 1 Fields
  firstName: string;
  lastName: string;
  birthday: string;
  age: number;
  phoneNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  priorLivingSituation: string;
  entryDate: string;
  medical: boolean | undefined;
  assignedCaseManager: string;
  site: string;
  clientGrant: string;
  calOptimaFundedSite: boolean | undefined;
  uniqueId: string;
  disablingConditionForm: boolean | undefined;
  familySize: number;
  numberOfChildren: number;
  numberOfChildrenWithDisability: number;
  children: Array<ChildData>;
  month: string;
  caseManager: string;
  ethnicity: string;
  race: string;

  // Page 2 Fields
  pregnant: boolean | undefined;
  cityLastPermanentAddress: string;
  whereClientSleptLastNight: string;
  lastCityResided: string;
  lastCityHomeless: string;
  beenInShelterLast5Years: boolean | undefined;
  numberofSheltersLast5Years: number;
  durationHomeless: string;
  chronicallyHomeless: boolean | undefined;
  employedUponEntry: boolean | undefined;
  attendingSchoolUponEntry: boolean | undefined;
  signedPhotoRelease: boolean | undefined;
  highRisk: boolean | undefined;
  currentlyEmployed: boolean | undefined;
  dateLastEmployment: string;
  historyDomesticViolence: boolean | undefined;
  historySubstanceAbuse: boolean | undefined;
  supportSystem: boolean | undefined;
  supportHousing?: boolean | undefined;
  supportFood?: boolean | undefined;
  supportChildcare?: boolean | undefined;
  diagnosedMentalHealth: boolean | undefined;
  undiagnosedMentalHealth: boolean | undefined;
  transportation: boolean | undefined;
  convictedCrime: boolean | undefined;
};

export type ChildData = {
  firstName: string;
  lastName: string;
  birthday: string;
  age: number;
  race: string;
};

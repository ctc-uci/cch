export type InitialScreener = {
  id: string;
  clientName: string;
  socialWorkerOfficeLocation: string;
  cmFirstName: string;
  cmLastName: string;
  phoneNumber: string;
  email: string;
  date: Date;
  clientId: number;
};

export type InitialInterview = {
  age: number;
  applicantType: string;
  beenConvicted: boolean;
  childDob: string;
  childName: string;
  cityOfSchool: string;
  clientId: number;
  convictedReasonAndTime: string;
  currentAddress: string;
  currentlyEmployed: boolean;
  currentlyHomeless: boolean;
  custodyOfChild: boolean;
  date: string;
  dateOfBirth: string;
  disabled: boolean;
  domesticViolenceHistory: string;
  educationHistory: string;
  email: string;
  ethnicity: string;
  eventLeadingToHomelessness: string;
  fatherName: string;
  futurePlansGoals: string;
  howHearAboutCch: string;
  howLongExperiencingHomelessness: string;
  id: number;
  lastAlcoholUse: string;
  lastDrugUse: string;
  lastEmployedDate: string;
  lastEmployer: string;
  lastPermAddress: string;
  lastPermanentResidenceHouseholdComposition: string;
  legalResident: boolean;
  lengthOfSobriety: string;
  maritalStatus: string;
  medical: boolean;
  medicalCity: string;
  medicalInsurance: string;
  medications: string;
  monthlyBills: string;
  monthlyIncome: string;
  name: string;
  nameSchoolChildrenAttend: string;
  personalReferenceTelephone: number;
  personalReferences: string;
  phoneNumber: number;
  presentWarrantExist: boolean;
  prevAppliedToCch: boolean;
  prevInCch: boolean;
  probationParoleOfficer: string;
  probationParoleOfficerTelephone: number;
  programsBeenInBefore: string;
  reasonForLeavingPermAddress: string;
  socialWorker: string;
  socialWorkerOfficeLocation: string;
  socialWorkerTelephone: number;
  sourcesOfIncome: string;
  ssnLastFour: number;
  timeUsingDrugsAlcohol: string;
  transportation: string;
  veteran: boolean;
  warrantCounty: string;
  whatCouldPreventHomeless: string;
  whenPrevAppliedToCch: string;
  whenPrevInCch: string;
  whereResideLastNight: string;
  whyNoLongerAtLastResidence: string;
};

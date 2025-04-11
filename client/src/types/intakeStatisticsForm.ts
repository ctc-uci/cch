export type IntakeStatisticsFormPage1 = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  phoneNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  priorLiving: string;
  entranceDate: string;
  medical: string;
  createdBy: string;
  locationId: string;
  grant: string;
  caloptimaFunded: string;
  id: string; // should be cmId
  disabled: string;
  numChildren: number;
  children: Array<{
    firstName: string;
    lastName: string;
    birthday: string;
    age: number;
    ethnicity: string;
  }>;
  month: string;
  caseManager: string;
  ethnicity: string;
}

export type IntakeStatisticsForm = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  phoneNumber: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhoneNumber: string;
  priorLiving: string;
  entranceDate: string;
  medical: string;
  createdBy: string;
  locationId: string;
  grant: string;
  caloptimaFunded: string;
  id: string;
  disabled: string;
  numChildren: number;
  children: Array<{
    firstName: string;
    lastName: string;
    birthday: string;
    age: number;
    ethnicity: string;
  }>;
  month: string;
  caseManager: string;
  ethnicity: string;
  cityOfLastPermanentResidence?: string;
  lastSlept?: string;
  priorLivingCity?: string;
  priorHomelessCity?: string;
  shelterLastFiveYears?: string;
  shelterInLastFiveYears?: string;
  homelessnessLength?: number;
  chronicallyHomeless?: string;
  employedUponEntry?: string;
  attendingSchoolUponEntry?: string;
  photoReleaseSigned?: string;
  employed?: string;
  lastEmployment?: string;
  domesticeViolenceHistory?: string;
  substanceHistory?: string;
  supportSystem?: string;
  housing?: string;
  foodPurchase?: string;
  childcareAssistance?: string;
  mentalHealth?: string;
  mentalHealthUndiagnosed?: string;
  transportation?: string;
  beenConvicted?: string;
}

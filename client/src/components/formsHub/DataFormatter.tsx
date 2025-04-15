export const interviewScreenerKeyLabelMap: Record<string, string> = {
  applicantType: "Applicant Type",
  name: "Name",
  age: "Age",
  date: "Date",
  phoneNumber: "Phone Number",
  maritalStatus: "Marital Status",
  dateOfBirth: "Date of Birth",
  email: "Email",
  ssnLastFour: "SSN (Last Four Digits)",
  ethnicity: "Ethnicity",
  veteran: "Veteran",
  disabled: "Disabled",
  currentAddress: "Current Address",
  lastPermAddress: "Last Permanent Address",
  reasonForLeavingPermAddress: "Reason for Leaving Permanent Address",
  whereResideLastNight: "Where Did You Reside Last Night",
  currentlyHomeless: "Currently Homeless",
  eventLeadingToHomelessness: "Event Leading to Homelessness",
  howLongExperiencingHomelessness: "Duration of Homelessness",
  prevAppliedToCch: "Previously Applied to CCH",
  whenPrevAppliedToCch: "When Previously Applied to CCH",
  prevInCch: "Previously in CCH",
  whenPrevInCch: "When Previously in CCH",
  childName: "Child's Name",
  childDob: "Child's Date of Birth",
  custodyOfChild: "Custody of Child",
  fatherName: "Father's Name",
  nameSchoolChildrenAttend: "Name of School Attended by Child(ren)",
  cityOfSchool: "City of School",
  howHearAboutCch: "How Did You Hear About CCH",
  programsBeenInBefore: "Programs Participated In Previously",
  monthlyIncome: "Monthly Income",
  sourcesOfIncome: "Sources of Income",
  monthlyBills: "Monthly Bills",
  currentlyEmployed: "Currently Employed",
  lastEmployer: "Last Employer",
  lastEmployedDate: "Last Employment Date",
  educationHistory: "Education History",
  transportation: "Transportation",
  legalResident: "Legal Resident",
  medical: "Medical Coverage",
  medicalCity: "City of Medical Coverage",
  medicalInsurance: "Medical Insurance Provider",
  medications: "Medications",
  domesticViolenceHistory: "Domestic Violence History",
  socialWorker: "Social Worker",
  socialWorkerTelephone: "Social Worker Telephone",
  socialWorkerOfficeLocation: "Social Worker Office Location",
  lengthOfSobriety: "Length of Sobriety",
  lastDrugUse: "Last Drug Use",
  lastAlcoholUse: "Last Alcohol Use",
  timeUsingDrugsAlcohol: "Time Using Drugs/Alcohol",
  beenConvicted: "Been Convicted",
  convictedReasonAndTime: "Conviction Reason and Time",
  presentWarrantExist: "Present Warrant Exists",
  warrantCounty: "Warrant County",
  probationParoleOfficer: "Probation/Parole Officer",
  probationParoleOfficerTelephone: "Probation/Parole Officer Telephone",
  personalReferences: "Personal Reference Name",
  personalReferenceTelephone: "Personal Reference Telephone",
  futurePlansGoals: "Future Plans and Goals",
  lastPermanentResidenceHouseholdComposition: "Previous Household Composition",
  whyNoLongerAtLastResidence: "Reason for Leaving Last Residence",
  whatCouldPreventHomeless: "What Could Prevent Homelessness",
};

export const frontDeskKeyLabelMap: Record<string, string> = {
  date: "Date",
  totalOfficeVisits: "Total Office Visits",
  totalCalls: "Total # of Calls",
  totalUnduplicatedCalls: "Total # of Unduplicated Calls",
  totalVisitsHbDonationsRoom: "Total Visits to HB Donations Room",
  totalServedHbDonationsRoom: "Total People Served in HB Donations Room",
  totalVisitsHbPantry: "Total Visits to HB Pantry",
  totalServedHbPantry: "Total People Served in HB Pantry",
  totalVisitsPlacentiaPantry: "Total Visits to Placentia Pantry",
  totalServedPlacentiaPantry: "Total People Served in Placentia Pantry",
  totalVisitsPlacentiaNeighborhood: "Total Visits to Placentia Neighborhood Room",
  totalServedPlacentiaNeighborhood: "Total People Served in Placentia Neighborhood Room",
  numberOfPeople: "Number of People"
};

export const caseManagerKeyLabelMap: Record<string, string> = {
  role: "Role",
  firstName: "First Name",
  lastName: "Last Name",
  phoneNumber: "Phone Number",
  email: "Email"
};

const config: Record<
  string,
  { labelMap: Record<string, string>; excludeKeys: string[] }
> = {
  "Initial Screeners": {
    labelMap: interviewScreenerKeyLabelMap,
    excludeKeys: ["id", "clientId"],
  },
  "Front Desk Monthly Statistics": {
    labelMap: frontDeskKeyLabelMap,
    excludeKeys: ["id"],
  },
  "Case Manager Monthly Statistics": {
    labelMap: caseManagerKeyLabelMap,
    excludeKeys: ["id"],
  },
};


export const formatDataWithLabels = (
  rawData: Record<string, any>,
  title: string
): Record<string, any> => {
  const formatted: Record<string, any> = {};

  const section = config[title];
  if (!section) return rawData;

  for (const [key, value] of Object.entries(rawData)) {
    if (section.excludeKeys.includes(key)) continue;

    const readableKey = section.labelMap[key] ?? key;
    formatted[readableKey] = value;
    console.log("set ", readableKey, "to ", value)
  }

  return formatted;
};

export const getKeyByValue = (
  value: string,
  title: string
): string | undefined | null => {

  const section = config[title];

  if (!section) return null;

  return Object.entries(section.labelMap).find(([_, val]) => val === value)?.[0];
};


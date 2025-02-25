import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const initialInterviewRouter = Router();

initialInterviewRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM initial_interview;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

initialInterviewRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.query(`SELECT * FROM initial_interview WHERE client_id = $1;`, [id]);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }

});
initialInterviewRouter.post("/", async (req, res) => {
  try{
    const {applicantType,
      name,
      age,
      date,
      phoneNumber,
      maritalStatus,
      dateOfBirth,
      email,
      ssnLastFour,
      ethnicity,
      veteran,
      disabled,
      currentAddress,
      lastPermAddress,
      reasonForLeavingPermAddress,
      whereResideLastNight,
      currentlyHomeless,
      eventLeadingToHomelessness,
      howLongExperiencingHomelessness,
      prevAppliedToCch,
      whenPrevAppliedToCch,
      prevInCch,
      whenPrevInCch,
      childName,
      childDOB,
      city,
      custodyOfChild,
      fatherName,
      nameSchoolChildrenAttend,
      cityOfSchool,
      howHearAboutCch,
      programsBeenInBefore,
      monthlyIncome,
      sourcesOfIncome,
      monthlyBills,
      currentlyEmployed,
      lastEmployer,
      lastEmployedDate,
      childrenAge,
      educationHistory,
      transportation,
      legalResident,
      medical,
      medicalCity,
      medicalInsurance,
      medications,
      domesticViolenceHistory,
      socialWorker,
      socialWorkerTelephone,
      socialWorkerOfficeLocation,
      lengthOfSobriety,
      lastDrugUse,
      lastAlcoholUse,
      timeUsingDrugsAlcohol,
      beenConvicted,
      convictedReasonAndTime,
      presentWarrantExist,
      warrantCounty,
      probationParoleOfficer,
      probationParoleOfficerTelephone,
      personalReferences,
      personalReferenceTelephone,
      futurePlansGoals,
      lastPermanentResidenceHouseholdComposition,
      whyNoLongerAtLastResidence,
      whatCouldPreventHomeless} = req.body;

      const query = `INSERT INTO initial_interview(applicantType, name, age, date, phoneNumber, maritalStatus, dateOfBirth, email, ssnLastFour, ethnicity, veteran, disabled, currentAddress, lastPermAddress, reasonForLeavingPermAddress, whereResideLastNight, currentlyHomeless, eventLeadingToHomelessness, howLongExperiencingHomelessness, prevAppliedToCch, whenPrevAppliedToCch, prevInCch, whenPrevInCch, childName, childDOB, city, custodyOfChild, fatherName, nameSchoolChildrenAttend, cityOfSchool, howHearAboutCch, programsBeenInBefore, monthlyIncome, sourcesOfIncome,
monthlyBills, currentlyEmployed, lastEmployer, lastEmployedDate, childrenAge, educationHistory, transportation, legalResident, medical, medicalCity, medicalInsurance, medications, domesticViolenceHistory, socialWorker, socialWorkerTelephone, socialWorkerOfficeLocation, lengthOfSobriety, lastDrugUse, lastAlcoholUse, timeUsingDrugsAlcohol, beenConvicted, convictedReasonAndTime, presentWarrantExist, warrantCounty, probationParoleOfficer, probationParoleOfficerTelephone,
personalReferences, personalReferenceTelephone, futurePlansGoals, lastPermanentResidenceHouseholdComposition, whyNoLongerAtLastResidence, whatCouldPreventHomeless
) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34,
$35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64,
$65, $66, $67
)`;

  const res = await db.query(query, [applicantType,
    name,
    age,
    date,
    phoneNumber,
    maritalStatus,
    dateOfBirth,
    email,
    ssnLastFour,
    ethnicity,
    veteran,
    disabled,
    currentAddress,
    lastPermAddress,
    reasonForLeavingPermAddress,
    whereResideLastNight,
    currentlyHomeless,
    eventLeadingToHomelessness,
    howLongExperiencingHomelessness,
    prevAppliedToCch,
    whenPrevAppliedToCch,
    prevInCch,
    whenPrevInCch,
    childName,
    childDOB,
    city,
    custodyOfChild,
    fatherName,
    nameSchoolChildrenAttend,
    cityOfSchool,
    howHearAboutCch,
    programsBeenInBefore,
    monthlyIncome,
    sourcesOfIncome,
    monthlyBills,
    currentlyEmployed,
    lastEmployer,
    lastEmployedDate,
    childrenAge,
    educationHistory,
    transportation,
    legalResident,
    medical,
    medicalCity,
    medicalInsurance,
    medications,
    domesticViolenceHistory,
    socialWorker,
    socialWorkerTelephone,
    socialWorkerOfficeLocation,
    lengthOfSobriety,
    lastDrugUse,
    lastAlcoholUse,
    timeUsingDrugsAlcohol,
    beenConvicted,
    convictedReasonAndTime,
    presentWarrantExist,
    warrantCounty,
    probationParoleOfficer,
    probationParoleOfficerTelephone,
    personalReferences,
    personalReferenceTelephone,
    futurePlansGoals,
    lastPermanentResidenceHouseholdComposition,
    whyNoLongerAtLastResidence,
    whatCouldPreventHomeless

  ]);

  } catch(err) {
    res.status(500).send(err.message);
  }
})


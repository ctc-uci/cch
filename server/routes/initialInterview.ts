import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const initialInterviewRouter = Router();

//getting the data needed for the list of initial screeners
initialInterviewRouter.get(
  "/initial-interview-table-data",
  async (req, res) => {
    try {
      const { search, page, filter } = req.query;
      const stringSearch = "'%" + String(search) + "%'";

      let queryStr = `
      SELECT
        i.name AS client_name,
        i.social_worker_office_location,
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        i.phone_number,
        i.email,
        i.date,
        i.client_id
      FROM initial_interview i
      INNER JOIN screener_comment AS s ON i.id = s.initial_interview_id
      INNER JOIN case_managers AS cm ON s.cm_id = cm.id
    `;

      if (search) {
        queryStr += `
        AND (
          i.name::TEXT ILIKE ${stringSearch}
          OR i.social_worker_office_location::TEXT ILIKE ${stringSearch}
          OR cm.first_name::TEXT ILIKE ${stringSearch}
          OR cm.last_name::TEXT ILIKE ${stringSearch}
          OR i.phone_number::TEXT ILIKE ${stringSearch}
          OR i.email::TEXT ILIKE ${stringSearch}
          OR i.date::TEXT ILIKE ${stringSearch}
        )`;
      }

      if (filter) {
        queryStr += ` AND ${filter}`;
      }

      queryStr += " ORDER BY i.id ASC";

      if (page) {
        queryStr += ` LIMIT ${page}`;
      }

      const data = await db.query(queryStr);
      res.status(200).json(keysToCamel(data));
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);


initialInterviewRouter.get("/search-filter", async (req, res) => {
  try {
    const { search, page, filter } = req.query;
    let queryStr = `
      SELECT initial_interview.*
      FROM initial_interview
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (initial_interview.id::TEXT ILIKE ${stringSearch}
        OR initial_interview.applicant_type::TEXT ILIKE ${stringSearch}
        OR initial_interview.name::TEXT ILIKE ${stringSearch}
        OR initial_interview.age::TEXT ILIKE ${stringSearch}
        OR initial_interview.date::TEXT ILIKE ${stringSearch}
        OR initial_interview.phone_number::TEXT ILIKE ${stringSearch}
        OR initial_interview.marital_status::TEXT ILIKE ${stringSearch}
        OR initial_interview.date_of_birth::TEXT ILIKE ${stringSearch}
        OR initial_interview.email::TEXT ILIKE ${stringSearch}
        OR initial_interview.ssn_last_four::TEXT ILIKE ${stringSearch}
        OR initial_interview.ethnicity::TEXT ILIKE ${stringSearch}
        OR initial_interview.disabled::TEXT ILIKE ${stringSearch}
        OR initial_interview.current_address::TEXT ILIKE ${stringSearch}
        OR initial_interview.last_perm_address::TEXT ILIKE ${stringSearch}
        OR initial_interview.reason_for_leaving_perm_address::TEXT ILIKE ${stringSearch}
        OR initial_interview.where_reside_last_night::TEXT ILIKE ${stringSearch}
        OR initial_interview.currently_homeless::TEXT ILIKE ${stringSearch}
        OR initial_interview.event_leading_to_homelessness::TEXT ILIKE ${stringSearch}
        OR initial_interview.how_long_experiencing_homelessness::TEXT ILIKE ${stringSearch}
        OR initial_interview.prev_applied_to_cch::TEXT ILIKE ${stringSearch}
        OR initial_interview.when_prev_applied_to_cch::TEXT ILIKE ${stringSearch}
        OR initial_interview.prev_in_cch::TEXT ILIKE ${stringSearch}
        OR initial_interview.child_name::TEXT ILIKE ${stringSearch}
        OR initial_interview.child_dob::TEXT ILIKE ${stringSearch}
        OR initial_interview.custody_of_child::TEXT ILIKE ${stringSearch}
        OR initial_interview.father_name::TEXT ILIKE ${stringSearch}
        OR initial_interview.name_school_children_attend::TEXT ILIKE ${stringSearch}
        OR initial_interview.city_of_school::TEXT ILIKE ${stringSearch}
        OR initial_interview.how_hear_about_cch::TEXT ILIKE ${stringSearch}
        OR initial_interview.programs_been_in_before::TEXT ILIKE ${stringSearch}
        OR initial_interview.monthly_income::TEXT ILIKE ${stringSearch}
        OR initial_interview.sources_of_income::TEXT ILIKE ${stringSearch}
        OR initial_interview.monthly_bills::TEXT ILIKE ${stringSearch}
        OR initial_interview.currently_employed::TEXT ILIKE ${stringSearch}
        OR initial_interview.last_employer::TEXT ILIKE ${stringSearch}
        OR initial_interview.last_employed_date::TEXT ILIKE ${stringSearch}
        OR initial_interview.education_history::TEXT ILIKE ${stringSearch}
        OR initial_interview.transportation::TEXT ILIKE ${stringSearch}
        OR initial_interview.legal_resident::TEXT ILIKE ${stringSearch}
        OR initial_interview.medical::TEXT ILIKE ${stringSearch}
        OR initial_interview.medical_city::TEXT ILIKE ${stringSearch}
        OR initial_interview.medical_insurance::TEXT ILIKE ${stringSearch}
        OR initial_interview.medications::TEXT ILIKE ${stringSearch}
        OR initial_interview.domestic_violence_history::TEXT ILIKE ${stringSearch}
        OR initial_interview.social_worker::TEXT ILIKE ${stringSearch}
        OR initial_interview.social_worker_telephone::TEXT ILIKE ${stringSearch}
        OR initial_interview.social_worker_office_location::TEXT ILIKE ${stringSearch}
        OR initial_interview.length_of_sobriety::TEXT ILIKE ${stringSearch}
        OR initial_interview.last_drug_use::TEXT ILIKE ${stringSearch}
        OR initial_interview.time_using_drugs_alcohol::TEXT ILIKE ${stringSearch}
        OR initial_interview.been_convicted::TEXT ILIKE ${stringSearch}
        OR initial_interview.convicted_reason_and_time::TEXT ILIKE ${stringSearch}
        OR initial_interview.present_warrant_exist::TEXT ILIKE ${stringSearch}
        OR initial_interview.warrant_county::TEXT ILIKE ${stringSearch}
        OR initial_interview.probation_parole_officer::TEXT ILIKE ${stringSearch}
        OR initial_interview.personal_references::TEXT ILIKE ${stringSearch}
        OR initial_interview.personal_reference_telephone::TEXT ILIKE ${stringSearch}
        OR initial_interview.future_plans_goals::TEXT ILIKE ${stringSearch}
        OR initial_interview.last_permanent_residence_household_composition::TEXT ILIKE ${stringSearch}
        OR initial_interview.why_no_longer_at_last_residence::TEXT ILIKE ${stringSearch}
        OR initial_interview.what_could_prevent_homeless::TEXT ILIKE ${stringSearch}
        OR initial_interview.client_id::TEXT ILIKE ${stringSearch}
      )`;
    }

    if (filter) {
      queryStr += `AND ${filter}`;
    }

    queryStr += " ORDER BY initial_interview.id ASC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }

    const initial_interview = await db.query(queryStr);
    res.status(200).json(keysToCamel(initial_interview));
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

initialInterviewRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM initial_interview;`);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Getting only comment form data with a client ID
initialInterviewRouter.get("/commentForm/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.query(`
      SELECT
        i.name AS client_name,
        cm.first_name AS cm_first_name,
        cm.last_name AS cm_last_name,
        i.id AS initialId,
        i.applicant_type,
        s.willingness,
        s.employability,
        s.attitude,
        s.length_of_sobriety,
        s.completed_tx,
        s.drug_test_results,
        s.homeless_episode_one,
        s.homeless_episode_two,
        s.homeless_episode_three,
        s.disabling_condition,
        s.employed,
        s.driver_license,
        s.num_of_children,
        s.children_in_custody,
        s.last_city_perm_residence,
        s.decision,
        s.additional_comments,
        s.id
      FROM initial_interview i
      INNER JOIN screener_comment AS s ON i.id = s.initial_interview_id
      INNER JOIN case_managers AS cm ON s.cm_id = cm.id
      WHERE i.client_id = ${id};
    `);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

initialInterviewRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.query(
      `SELECT * FROM initial_interview WHERE client_id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

initialInterviewRouter.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.query(
      `SELECT * FROM initial_interview WHERE id = $1;`,
      [id]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

initialInterviewRouter.patch("/app-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const query = `UPDATE initial_interview SET applicant_type = '${updates.applicant_type}' WHERE id = ${id} RETURNING *;`;
    const result = await db.query(query);

    res.status(200).json({
      message: "Client updated successfully",
      result: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

initialInterviewRouter.post("/", async (req, res) => {
  try {
    const {
      applicantType,
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
      whatCouldPreventHomeless,
    } = req.body;

    const query = `INSERT INTO initial_interview(applicantType, name, age, date, phoneNumber, maritalStatus, dateOfBirth, email, ssnLastFour, ethnicity, veteran, disabled, currentAddress, lastPermAddress, reasonForLeavingPermAddress, whereResideLastNight, currentlyHomeless, eventLeadingToHomelessness, howLongExperiencingHomelessness, prevAppliedToCch, whenPrevAppliedToCch, prevInCch, whenPrevInCch, childName, childDOB, city, custodyOfChild, fatherName, nameSchoolChildrenAttend, cityOfSchool, howHearAboutCch, programsBeenInBefore, monthlyIncome, sourcesOfIncome,
monthlyBills, currentlyEmployed, lastEmployer, lastEmployedDate, childrenAge, educationHistory, transportation, legalResident, medical, medicalCity, medicalInsurance, medications, domesticViolenceHistory, socialWorker, socialWorkerTelephone, socialWorkerOfficeLocation, lengthOfSobriety, lastDrugUse, lastAlcoholUse, timeUsingDrugsAlcohol, beenConvicted, convictedReasonAndTime, presentWarrantExist, warrantCounty, probationParoleOfficer, probationParoleOfficerTelephone,
personalReferences, personalReferenceTelephone, futurePlansGoals, lastPermanentResidenceHouseholdComposition, whyNoLongerAtLastResidence, whatCouldPreventHomeless
) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34,
$35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64,
$65, $66, $67
)`;

    const res = await db.query(query, [
      applicantType,
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
      whatCouldPreventHomeless,
    ]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

initialInterviewRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    applicant_type,
    name,
    age,
    date,
    phone_number,
    marital_status,
    date_of_birth,
    email,
    ssn_last_four,
    ethnicity,
    veteran,
    disabled,
    current_address,
    last_perm_address,
    reason_for_leaving_perm_address,
    where_reside_last_night,
    currently_homeless,
    event_leading_to_homelessness,
    how_long_experiencing_homelessness,
    prev_applied_to_cch,
    when_prev_applied_to_cch,
    prev_in_cch,
    when_prev_in_cch,
    child_name,
    child_dob,
    custody_of_child,
    father_name,
    name_school_children_attend,
    city_of_school,
    how_hear_about_cch,
    programs_been_in_before,
    monthly_income,
    sources_of_income,
    monthly_bills,
    currently_employed,
    last_employer,
    last_employed_date,
    education_history,
    transportation,
    legal_resident,
    medical,
    medical_city,
    medical_insurance,
    medications,
    domestic_violence_history,
    social_worker,
    social_worker_telephone,
    social_worker_office_location,
    length_of_sobriety,
    last_drug_use,
    last_alcohol_use,
    time_using_drugs_alcohol,
    been_convicted,
    convicted_reason_and_time,
    present_warrant_exist,
    warrant_county,
    probation_parole_officer,
    probation_parole_officer_telephone,
    personal_references,
    personal_reference_telephone,
    future_plans_goals,
    last_permanent_residence_household_composition,
    why_no_longer_at_last_residence,
    what_could_prevent_homeless,
  } = req.body;

  try {
    const result = await db.query(
      `
      UPDATE initial_interview
      SET
        applicant_type                        = $1,
        name                                  = $2,
        age                                   = $3,
        date                                  = $4,
        phone_number                          = $5,
        marital_status                        = $6,
        date_of_birth                         = $7,
        email                                 = $8,
        ssn_last_four                         = $9,
        ethnicity                             = $10,
        veteran                               = $11,
        disabled                              = $12,
        current_address                       = $13,
        last_perm_address                     = $14,
        reason_for_leaving_perm_address       = $15,
        where_reside_last_night               = $16,
        currently_homeless                    = $17,
        event_leading_to_homelessness         = $18,
        how_long_experiencing_homelessness    = $19,
        prev_applied_to_cch                   = $20,
        when_prev_applied_to_cch              = $21,
        prev_in_cch                           = $22,
        when_prev_in_cch                      = $23,
        child_name                            = $24,
        child_dob                             = $25,
        custody_of_child                      = $26,
        father_name                           = $27,
        name_school_children_attend           = $28,
        city_of_school                        = $29,
        how_hear_about_cch                    = $30,
        programs_been_in_before               = $31,
        monthly_income                        = $32,
        sources_of_income                     = $33,
        monthly_bills                         = $34,
        currently_employed                    = $35,
        last_employer                         = $36,
        last_employed_date                    = $37,
        education_history                     = $38,
        transportation                        = $39,
        legal_resident                        = $40,
        medical                               = $41,
        medical_city                          = $42,
        medical_insurance                     = $43,
        medications                           = $44,
        domestic_violence_history             = $45,
        social_worker                         = $46,
        social_worker_telephone               = $47,
        social_worker_office_location         = $48,
        length_of_sobriety                    = $49,
        last_drug_use                         = $50,
        last_alcohol_use                      = $51,
        time_using_drugs_alcohol              = $52,
        been_convicted                        = $53,
        convicted_reason_and_time             = $54,
        present_warrant_exist                 = $55,
        warrant_county                        = $56,
        probation_parole_officer              = $57,
        probation_parole_officer_telephone    = $58,
        personal_references                   = $59,
        personal_reference_telephone          = $60,
        future_plans_goals                    = $61,
        last_permanent_residence_household_composition = $62,
        why_no_longer_at_last_residence       = $63,
        what_could_prevent_homeless           = $64
      WHERE id = $65
      RETURNING *;
      `,
      [
        applicant_type,
        name,
        age,
        date,
        phone_number,
        marital_status,
        date_of_birth,
        email,
        ssn_last_four,
        ethnicity,
        veteran,
        disabled,
        current_address,
        last_perm_address,
        reason_for_leaving_perm_address,
        where_reside_last_night,
        currently_homeless,
        event_leading_to_homelessness,
        how_long_experiencing_homelessness,
        prev_applied_to_cch,
        when_prev_applied_to_cch,
        prev_in_cch,
        when_prev_in_cch,
        child_name,
        child_dob,
        custody_of_child,
        father_name,
        name_school_children_attend,
        city_of_school,
        how_hear_about_cch,
        programs_been_in_before,
        monthly_income,
        sources_of_income,
        monthly_bills,
        currently_employed,
        last_employer,
        last_employed_date,
        education_history,
        transportation,
        legal_resident,
        medical,
        medical_city,
        medical_insurance,
        medications,
        domestic_violence_history,
        social_worker,
        social_worker_telephone,
        social_worker_office_location,
        length_of_sobriety,
        last_drug_use,
        last_alcohol_use,
        time_using_drugs_alcohol,
        been_convicted,
        convicted_reason_and_time,
        present_warrant_exist,
        warrant_county,
        probation_parole_officer,
        probation_parole_officer_telephone,
        personal_references,
        personal_reference_telephone,
        future_plans_goals,
        last_permanent_residence_household_composition,
        why_no_longer_at_last_residence,
        what_could_prevent_homeless,
        id,
      ]
    );

    return res.status(200).json(keysToCamel(result));
  } catch (err: any) {
    console.error("Error", err);
    return res.status(500).send(err.message);
  }
});

// DELETE keyword = scary, and I don't wanna mess with it right now
// initialInterviewRouter.delete("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const query = `DELETE FROM initial_interview WHERE id = ${id};`;
//     const result = await db.query(query);

//     res.status(200).json({
//       message: "Interview deleted successfully",
//       result: result,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });
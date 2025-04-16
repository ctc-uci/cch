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

initialInterviewRouter.get("/get-interview/:id", async (req, res) => {
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
      childDob,
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

    console.log(req.body);

    const query = `
      INSERT INTO initial_interview (
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
        what_could_prevent_homeless
      ) VALUES (
                 $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
                 $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
                 $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
                 $31, $32, $33, $34, $35, $36, $37, $38, $39, $40,
                 $41, $42, $43, $44, $45, $46, $47, $48, $49, $50,
                 $51, $52, $53, $54, $55, $56, $57, $58, $59, $60,
                 $61, $62, $63, $64, $65, $66
               );
    `;

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
      childDob,
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

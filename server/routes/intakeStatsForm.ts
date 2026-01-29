import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const intakeStatsFormRouter = Router();

// Get all forms
intakeStatsFormRouter.get("/", async (req, res) => {
  try {
    const data = await db.query(`SELECT * FROM intake_statistics_form ORDER BY date DESC;`);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get single statistical intake form
intakeStatsFormRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await db.query(
      `SELECT * FROM intake_statistics_form WHERE id = ${id};`
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Post new form entry
intakeStatsFormRouter.post("/", async (req, res) => {
  try {
    const {
      date,
      month,
      caseManager,
      cmId,
      firstName,
      lastName,
      race,
      ethnicity,
      birthday,
      age,
      phoneNumber,
      email,
      emergencyContactName,
      emergencyContactPhoneNumber,
      priorLivingSituation,
      entryDate,
      medical,
      assignedCaseManager,
      site,
      clientGrant,
      calOptimaFundedSite,
      uniqueId,
      disablingConditionForm,
      familySize,
      numberOfChildren,
      numberOfChildrenWithDisability,
      pregnant,
      cityLastPermanentAddress,
      whereClientSleptLastNight,
      lastCityResided,
      lastCityHomeless,
      beenInShelterLast5Years,
      numberofSheltersLast5Years,
      durationHomeless,
      chronicallyHomeless,
      employedUponEntry,
      attendingSchoolUponEntry,
      signedPhotoRelease,
      highRisk,
      currentlyEmployed,
      dateLastEmployment,
      historyDomesticViolence,
      historySubstanceAbuse,
      supportSystem,
      supportHousing,
      supportFood,
      supportChildcare,
      diagnosedMentalHealth,
      undiagnosedMentalHealth,
      transportation,
      convictedCrime,
    } = req.body;

    const query = `
  INSERT INTO intake_statistics_form (
    date,
    month,
    case_manager,
    cm_id,
    first_name,
    last_name,
    race,
    ethnicity,
    birthday,
    age,
    phone_number,
    email,
    emergency_contact_name,
    emergency_contact_phone_number,
    prior_living_situation,
    entry_date,
    medical,
    assigned_case_manager,
    site,
    client_grant,
    cal_optima_funded_site,
    unique_id,
    disabling_condition_form,
    family_size,
    number_of_children,
    number_of_children_with_disability,
    pregnant,
    city_last_permanent_address,
    where_client_slept_last_night,
    last_city_resided,
    last_city_homeless,
    been_in_shelter_last_5_years,
    number_of_shelters_last_5_years,
    duration_homeless,
    chronically_homeless,
    employed_upon_entry,
    attending_school_upon_entry,
    signed_photo_release,
    high_risk,
    currently_employed,
    date_last_employment,
    history_domestic_violence,
    history_substance_abuse,
    support_system,
    support_housing,
    support_food,
    support_childcare,
    diagnosed_mental_health,
    undiagnosed_mental_health,
    transportation,
    convicted_crime
  )
  VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51
  )
  RETURNING id;
`;

    const values = [
      date,
      month,
      caseManager,
      cmId,
      firstName,
      lastName,
      race,
      ethnicity,
      birthday,
      age,
      phoneNumber,
      email,
      emergencyContactName,
      emergencyContactPhoneNumber,
      priorLivingSituation,
      entryDate,
      medical,
      assignedCaseManager,
      site,
      clientGrant,
      calOptimaFundedSite,
      uniqueId,
      disablingConditionForm,
      familySize,
      numberOfChildren,
      numberOfChildrenWithDisability,
      pregnant,
      cityLastPermanentAddress,
      whereClientSleptLastNight,
      lastCityResided,
      lastCityHomeless,
      beenInShelterLast5Years,
      numberofSheltersLast5Years,
      durationHomeless,
      chronicallyHomeless,
      employedUponEntry,
      attendingSchoolUponEntry,
      signedPhotoRelease,
      highRisk,
      currentlyEmployed,
      dateLastEmployment,
      historyDomesticViolence,
      historySubstanceAbuse,
      supportSystem,
      supportHousing,
      supportFood,
      supportChildcare,
      diagnosedMentalHealth,
      undiagnosedMentalHealth,
      transportation,
      convictedCrime,
    ];
    const result = await db.query(query, values);
    res.status(201).json({ id: result[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

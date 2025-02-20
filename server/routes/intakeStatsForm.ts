import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const intakeStatsFormRouter = Router();

// Get all initial interview form objects
intakeStatsFormRouter.post("/", async (req, res) => {
  try {
    // const {
    //   age,
    //   attendingSchoolUponEntry,
    //   beenConvicted,
    //   caloptimaFunded,
    //   caseManager,
    //   childcareAssistance,
    //   children,
    //   chronicallyHomeless,
    //   cityOfLastPermanentResidence,
    //   createdBy,
    //   dateOfBirth,
    //   disabled,
    //   domesticeViolenceHistory,
    //   email,
    //   emergencyContactName,
    //   emergencyContactPhoneNumber,
    //   employed,
    //   employedUponEntry,
    //   entranceDate,
    //   ethnicity,
    //   firstName,
    //   foodPurchase,
    //   grant,
    //   homelessnessLength,
    //   housing,
    //   id,
    //   lastEmployment,
    //   lastName,
    //   lastSlept,
    //   locationId,
    //   medical,
    //   mentalHealth,
    //   mentalHealthUndiagnosed,
    //   month,
    //   numChildren,
    //   phoneNumber,
    //   photoReleaseSigned,
    //   priorHomelessCity,
    //   priorLiving,
    //   priorLivingCity,
    //   shelterInLastFiveYears,
    //   shelterLastFiveYears,
    //   substanceHistory,
    // } = req.body;

    // const data = await db.query(
    //   `INSERT INTO clients (
    //       created_by,
    //       grant,
    //       first_name,
    //       last_name,
    //       date_of_birth,
    //       age,
    //       phone_number,
    //       email,
    //       emergency_contact_name,
    //       emergency_contact_phone_number,
    //       medical,
    //       entrance_date,
    //       estimated_exit_date,
    //       exit_date,
    //       bed_nights,
    //       bed_nights_children,
    //       pregnant_upon_entry,
    //       disabled_children,
    //       ethnicity,
    //       race,
    //       city_of_last_permanent_residence,
    //       prior_living,
    //       prior_living_city,
    //       shelter_in_last_five_years,
    //       homelessness_length,
    //       chronically_homeless,
    //       attending_school_upon_entry,
    //       employement_gained,
    //       reason_for_leaving,
    //       specific_reason_for_leaving,
    //       specific_destination,
    //       savings_amount,
    //       attending_school_upon_exit,
    //       reunified,
    //       successful_completion,
    //       destination_city,
    //     ) VALUES (
    //       $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $27,
    //       $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38
    //     )
    //     RETURNING id;
    //     `,

    //   [
    //     createdBy,
    //     grant,
    //     firstName,
    //     lastName,
    //     dateOfBirth,
    //     age,
    //     phoneNumber,
    //     email,
    //     emergencyContactName,
    //     emergencyContactPhoneNumber,
    //     medical,
    //   ]
    // );

    // res.status(200).json(keysToCamel(data));
    console.log("Posting to database");
  } catch (err) {
    res.status(500).send(err.message);
  }
  
  try {
    const id = req.body.id;
    const children = req.body.children;
    const numChildren = req.body.numChildren;
    for (let i = 0; i < numChildren; i++) {
      const data = await db.query(
        `INSERT INTO children (
          parent_id,
          first_name,
          last_name,
          date_of_birth VALUES ($1, $2, $3, $4)`, [id, ])
    }
  } catch (err) {
    res.status(500).send(err.message);
  }

});

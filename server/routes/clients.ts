import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp"; // TODO: replace this db with

export const clientsRouter = Router();

// Gets specific number of clients based on page count and returns either ALL or specific clients that have search keyword present.
clientsRouter.get("/:page?/:filter?/:search?", async (req, res) => {

    try {

        const { page, filter, search } = req.query;
        let queryStr = `SELECT * FROM clients`
        
        const stringSearch = "'" + String(search) + "'"
        
        if (search) {
          queryStr = queryStr.concat(" ", `WHERE id::TEXT = ${stringSearch} 
            OR created_by::TEXT = ${stringSearch} 
            OR unit_id::TEXT = ${stringSearch} 
            OR "grant"::TEXT = ${stringSearch} 
            OR "status"::TEXT = ${stringSearch} 
            OR first_name::TEXT = ${stringSearch} 
            OR last_name::TEXT = ${stringSearch} 
            OR date_of_birth::TEXT = ${stringSearch} 
            OR age::TEXT = ${stringSearch} 
            OR phone_number::TEXT = ${stringSearch} 
            OR email::TEXT = ${stringSearch} 
            OR emergency_contact_name::TEXT = ${stringSearch} 
            OR emergency_contact_phone_number::TEXT = ${stringSearch} 
            OR medical::TEXT = ${stringSearch} 
            OR entrance_date::TEXT = ${stringSearch} 
            OR estimated_exit_date::TEXT = ${stringSearch} 
            OR exit_date::TEXT = ${stringSearch} 
            OR bed_nights::TEXT = ${stringSearch} 
            OR bed_nights_children::TEXT = ${stringSearch} 
            OR pregnant_upon_entry::TEXT = ${stringSearch} 
            OR disabled_children::TEXT = ${stringSearch} 
            OR ethnicity::TEXT = ${stringSearch} 
            OR race::TEXT = ${stringSearch} 
            OR city_of_last_permanent_residence::TEXT = ${stringSearch} 
            OR prior_living::TEXT = ${stringSearch} 
            OR prior_living_city::TEXT = ${stringSearch} 
            OR shelter_in_last_five_years::TEXT = ${stringSearch} 
            OR homelessness_length::TEXT = ${stringSearch} 
            OR chronically_homeless::TEXT = ${stringSearch} 
            OR attending_school_upon_entry::TEXT = ${stringSearch} 
            OR employement_gained::TEXT = ${stringSearch} 
            OR reason_for_leaving::TEXT = ${stringSearch} 
            OR specific_reason_for_leaving::TEXT = ${stringSearch} 
            OR specific_destination::TEXT = ${stringSearch} 
            OR savings_amount::TEXT = ${stringSearch} 
            OR attending_school_upon_exit::TEXT = ${stringSearch} 
            OR reunified::TEXT = ${stringSearch} 
            OR successful_completion::TEXT = ${stringSearch} 
            OR destination_city::TEXT = ${stringSearch}`)
        }

        queryStr += ' ORDER BY id ASC'

        if (page) {
          queryStr = queryStr.concat(" ", `LIMIT ${page}`)
        }

        const clients = await db.query(queryStr);

        res.status(200).json(keysToCamel(clients));

    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Creates new client based on key values provided into request body.
clientsRouter.post('/', async (req, res) => {

  try {

      const { id, created_by, unit_id, grant, status, 
          first_name, last_name, date_of_birth, age,
          phone_number, email, emergency_contact_name,
          emergency_contact_phone_number, medical, entrance_date,
          estimated_exit_date, exit_date, bed_nights, bed_nights_children,
          pregnant_upon_entry, disabled_children, ethnicity, race,
          city_of_last_permanent_residence, prior_living, prior_living_city,
          shelter_in_last_five_years, homelessness_length, chronically_homeless,
          attending_school_upon_entry, employement_gained, reason_for_leaving,
          specific_reason_for_leaving, specific_destination,  savings_amount,
          attending_school_upon_exit, reunified, successful_completion,
          destination_city, 
      } = req.body;

      const data = await db.query(
        
        `INSERT INTO clients (
          id, 
          created_by, 
          unit_id, 
          "grant", 
          "status", 
          first_name, 
          last_name, 
          date_of_birth, 
          age,
          phone_number, 
          email, 
          emergency_contact_name,
          emergency_contact_phone_number, 
          medical, 
          entrance_date,
          estimated_exit_date, 
          exit_date, 
          bed_nights, 
          bed_nights_children,
          pregnant_upon_entry, 
          disabled_children, 
          ethnicity, 
          race,
          city_of_last_permanent_residence, 
          prior_living, 
          prior_living_city,
          shelter_in_last_five_years, 
          homelessness_length, 
          chronically_homeless,
          attending_school_upon_entry, 
          employement_gained, 
          reason_for_leaving,
          specific_reason_for_leaving, 
          specific_destination, 
          savings_amount,
          attending_school_upon_exit, 
          reunified, 
          successful_completion,
          destination_city, 
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $27, 
          $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39
        )
        RETURNING id;
        `,

        [
          id, created_by, unit_id, grant, status, 
          first_name, last_name, date_of_birth, age,
          phone_number, email, emergency_contact_name,
          emergency_contact_phone_number, medical, entrance_date,
          estimated_exit_date, exit_date, bed_nights, bed_nights_children,
          pregnant_upon_entry, disabled_children, ethnicity, race,
          city_of_last_permanent_residence, prior_living, prior_living_city,
          shelter_in_last_five_years, homelessness_length, chronically_homeless,
          attending_school_upon_entry, employement_gained, reason_for_leaving,
          specific_reason_for_leaving, specific_destination,  savings_amount,
          attending_school_upon_exit, reunified, successful_completion,
          destination_city 
        ]

      );

      res.status(200).json({id: data[0].id});

  } catch (err) {

      res.status(500).send(err.message);
      
  }
})

// Updates a client based on ID.
clientsRouter.put("/:id", async (req, res) => {

  try {

    const { created_by, unit_id, grant, status, 
        first_name, last_name, date_of_birth, age,
        phone_number, email, emergency_contact_name,
        emergency_contact_phone_number, medical, entrance_date,
        estimated_exit_date, exit_date, bed_nights, bed_nights_children,
        pregnant_upon_entry, disabled_children, ethnicity, race,
        city_of_last_permanent_residence, prior_living, prior_living_city,
        shelter_in_last_five_years, homelessness_length, chronically_homeless,
        attending_school_upon_entry, employement_gained, reason_for_leaving,
        specific_reason_for_leaving, specific_destination,  savings_amount,
        attending_school_upon_exit, reunified, successful_completion,
        destination_city } = req.body;

    const { id } = req.params;

    await db.query(
      `UPDATE clients 
      SET
        id = $1
        created_by = $2
        unit_id = $3
        "grant" = $4
        "status" = $5
        first_name = $6
        last_name = $7
        date_of_birth = $8 
        age = $9
        phone_number = $10 
        email = $11
        emergency_contact_name = $12
        emergency_contact_phone_number = $13 
        medical = $14
        entrance_date = $15
        estimated_exit_date = $16 
        exit_date = $17
        bed_nights = $18
        bed_nights_children = $19
        pregnant_upon_entry = $20
        disabled_children = $21
        ethnicity = $22
        race = $23
        city_of_last_permanent_residence = $24 
        prior_living = $25
        prior_living_city = $26
        shelter_in_last_five_years = $27 
        homelessness_length = $28
        chronically_homeless = $29
        attending_school_upon_entry = $30 
        employement_gained = $31
        reason_for_leaving = $32
        specific_reason_for_leaving = $33 
        specific_destination = $34
        savings_amount = $35
        attending_school_upon_exit = $36 
        reunified = $37
        successful_completion = $38
        destination_city = $39
      WHERE id=${id} 
      `,
        [
          id, created_by, unit_id, grant, status, 
          first_name, last_name, date_of_birth, age,
          phone_number, email, emergency_contact_name,
          emergency_contact_phone_number, medical, entrance_date,
          estimated_exit_date, exit_date, bed_nights, bed_nights_children,
          pregnant_upon_entry, disabled_children, ethnicity, race,
          city_of_last_permanent_residence, prior_living, prior_living_city,
          shelter_in_last_five_years, homelessness_length, chronically_homeless,
          attending_school_upon_entry, employement_gained, reason_for_leaving,
          specific_reason_for_leaving, specific_destination,  savings_amount,
          attending_school_upon_exit, reunified, successful_completion,
          destination_city 
        ]
    );

    res.status(200).json(keysToCamel({id}));

  } catch (err) {

    res.status(400).send(err.message);

  }
});

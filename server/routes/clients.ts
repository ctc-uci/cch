import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const clientsRouter = Router();
clientsRouter.get("/:id", async (req, res) => {
  try {
      const { id } = req.params;
      const clients = await db.query(`SELECT * FROM clients WHERE id = $1`, [id]);
      res.status(200).json(keysToCamel(clients));
  } catch (err) {
      res.status(500).send(err.message);
  }
});

// Gets specific number of clients based on page count and returns either ALL or specific clients that have search keyword present.
clientsRouter.get("/", async (req, res) => {

    try {

        const { page, filter, search } = req.query;
        let queryStr = `SELECT * FROM clients`

        const stringSearch = "'%" + String(search) + "%'"

        if (search) {
          queryStr = queryStr.concat(" ", `WHERE id::TEXT ILIKE ${stringSearch}
            OR created_by::TEXT ILIKE ${stringSearch}
            OR unit_id::TEXT ILIKE ${stringSearch}
            OR "grant"::TEXT ILIKE ${stringSearch}
            OR "status"::TEXT ILIKE ${stringSearch}
            OR first_name::TEXT ILIKE ${stringSearch}
            OR last_name::TEXT ILIKE ${stringSearch}
            OR date_of_birth::TEXT ILIKE ${stringSearch}
            OR age::TEXT ILIKE ${stringSearch}
            OR phone_number::TEXT ILIKE ${stringSearch}
            OR email::TEXT ILIKE ${stringSearch}
            OR emergency_contact_name::TEXT ILIKE ${stringSearch}
            OR emergency_contact_phone_number::TEXT ILIKE ${stringSearch}
            OR medical::TEXT ILIKE ${stringSearch}
            OR entrance_date::TEXT ILIKE ${stringSearch}
            OR estimated_exit_date::TEXT ILIKE ${stringSearch}
            OR exit_date::TEXT ILIKE ${stringSearch}
            OR bed_nights::TEXT ILIKE ${stringSearch}
            OR bed_nights_children::TEXT ILIKE ${stringSearch}
            OR pregnant_upon_entry::TEXT ILIKE ${stringSearch}
            OR disabled_children::TEXT ILIKE ${stringSearch}
            OR ethnicity::TEXT ILIKE ${stringSearch}
            OR race::TEXT ILIKE ${stringSearch}
            OR city_of_last_permanent_residence::TEXT ILIKE ${stringSearch}
            OR prior_living::TEXT ILIKE ${stringSearch}
            OR prior_living_city::TEXT ILIKE ${stringSearch}
            OR shelter_in_last_five_years::TEXT ILIKE ${stringSearch}
            OR homelessness_length::TEXT ILIKE ${stringSearch}
            OR chronically_homeless::TEXT ILIKE ${stringSearch}
            OR attending_school_upon_entry::TEXT ILIKE ${stringSearch}
            OR employement_gained::TEXT ILIKE ${stringSearch}
            OR reason_for_leaving::TEXT ILIKE ${stringSearch}
            OR specific_reason_for_leaving::TEXT ILIKE ${stringSearch}
            OR specific_destination::TEXT ILIKE ${stringSearch}
            OR savings_amount::TEXT ILIKE ${stringSearch}
            OR attending_school_upon_exit::TEXT ILIKE ${stringSearch}
            OR reunified::TEXT ILIKE ${stringSearch}
            OR successful_completion::TEXT ILIKE ${stringSearch}
            OR destination_city::TEXT ILIKE ${stringSearch}`)
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
          destination_city,
      } = req.body;

      const data = await db.query(

        `INSERT INTO clients (
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
          $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38
        )
        RETURNING id;
        `,

        [
          created_by, unit_id, grant, status,
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

    const {
      created_by,
      unit_id,
      grant,
      status,
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
      clientId,
    } = req.body;
    const { id } = req.params;

    const query = `
      UPDATE clients
      SET
        created_by = COALESCE($1, created_by),
        unit_id = COALESCE($2, unit_id),
        "grant" = COALESCE($3, "grant"),
        "status" = COALESCE($4, "status"),
        first_name = COALESCE($5, first_name),
        last_name = COALESCE($6, last_name),
        date_of_birth = COALESCE($7, date_of_birth),
        age = COALESCE($8, age),
        phone_number = COALESCE($9, phone_number),
        email = COALESCE($10, email),
        emergency_contact_name = COALESCE($11, emergency_contact_name),
        emergency_contact_phone_number = COALESCE($12, emergency_contact_phone_number),
        medical = COALESCE($13, medical),
        entrance_date = COALESCE($14, entrance_date),
        estimated_exit_date = COALESCE($15, estimated_exit_date),
        exit_date = COALESCE($16, exit_date),
        bed_nights = COALESCE($17, bed_nights),
        bed_nights_children = COALESCE($18, bed_nights_children),
        pregnant_upon_entry = COALESCE($19, pregnant_upon_entry),
        disabled_children = COALESCE($20, disabled_children),
        ethnicity = COALESCE($21, ethnicity),
        race = COALESCE($22, race),
        city_of_last_permanent_residence = COALESCE($23, city_of_last_permanent_residence),
        prior_living = COALESCE($24, prior_living),
        prior_living_city = COALESCE($25, prior_living_city),
        shelter_in_last_five_years = COALESCE($26, shelter_in_last_five_years),
        homelessness_length = COALESCE($27, homelessness_length),
        chronically_homeless = COALESCE($28, chronically_homeless),
        attending_school_upon_entry = COALESCE($29, attending_school_upon_entry),
        employement_gained = COALESCE($30, employement_gained),
        reason_for_leaving = COALESCE($31, reason_for_leaving),
        specific_reason_for_leaving = COALESCE($32, specific_reason_for_leaving),
        specific_destination = COALESCE($33, specific_destination),
        savings_amount = COALESCE($34, savings_amount),
        attending_school_upon_exit = COALESCE($35, attending_school_upon_exit),
        reunified = COALESCE($36, reunified),
        successful_completion = COALESCE($37, successful_completion),
        destination_city = COALESCE($38, destination_city)
      WHERE id = $39
      RETURNING *;
    `;

    const values = [
      created_by,
      unit_id,
      grant,
      status,
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
      clientId,
    ];

    await db.query(query, values);

    res.status(200).json(keysToCamel({id}));

  } catch (err) {

    res.status(400).send(err.message);

  }
});

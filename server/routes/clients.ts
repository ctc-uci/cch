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
    const { search, page, filter } = req.query;

    let queryStr = `
      SELECT 
        clients.*, 
        case_managers.first_name AS case_manager_first_name, 
        case_managers.last_name AS case_manager_last_name,
        locations.name AS location_name  -- Get location name
      FROM clients
      LEFT JOIN case_managers ON clients.created_by = case_managers.id
      LEFT JOIN units ON clients.unit_id = units.id
      LEFT JOIN locations ON units.location_id = locations.id
      WHERE 1=1
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += ` 
      AND (clients.id::TEXT ILIKE ${stringSearch}
        OR clients.created_by::TEXT ILIKE ${stringSearch}
        OR clients.unit_id::TEXT ILIKE ${stringSearch}
        OR clients."grant"::TEXT ILIKE ${stringSearch}
        OR clients."status"::TEXT ILIKE ${stringSearch}
        OR clients.first_name::TEXT ILIKE ${stringSearch}
        OR clients.last_name::TEXT ILIKE ${stringSearch}
        OR clients.date_of_birth::TEXT ILIKE ${stringSearch}
        OR clients.age::TEXT ILIKE ${stringSearch}
        OR clients.phone_number::TEXT ILIKE ${stringSearch}
        OR clients.email::TEXT ILIKE ${stringSearch}
        OR clients.emergency_contact_name::TEXT ILIKE ${stringSearch}
        OR clients.emergency_contact_phone_number::TEXT ILIKE ${stringSearch}
        OR clients.medical::TEXT ILIKE ${stringSearch}
        OR clients.entrance_date::TEXT ILIKE ${stringSearch}
        OR clients.estimated_exit_date::TEXT ILIKE ${stringSearch}
        OR clients.exit_date::TEXT ILIKE ${stringSearch}
        OR clients.bed_nights::TEXT ILIKE ${stringSearch}
        OR clients.bed_nights_children::TEXT ILIKE ${stringSearch}
        OR clients.pregnant_upon_entry::TEXT ILIKE ${stringSearch}
        OR clients.disabled_children::TEXT ILIKE ${stringSearch}
        OR clients.ethnicity::TEXT ILIKE ${stringSearch}
        OR clients.race::TEXT ILIKE ${stringSearch}
        OR clients.city_of_last_permanent_residence::TEXT ILIKE ${stringSearch}
        OR clients.prior_living::TEXT ILIKE ${stringSearch}
        OR clients.prior_living_city::TEXT ILIKE ${stringSearch}
        OR clients.shelter_in_last_five_years::TEXT ILIKE ${stringSearch}
        OR clients.homelessness_length::TEXT ILIKE ${stringSearch}
        OR clients.chronically_homeless::TEXT ILIKE ${stringSearch}
        OR clients.attending_school_upon_entry::TEXT ILIKE ${stringSearch}
        OR clients.employement_gained::TEXT ILIKE ${stringSearch}
        OR clients.reason_for_leaving::TEXT ILIKE ${stringSearch}
        OR clients.specific_reason_for_leaving::TEXT ILIKE ${stringSearch}
        OR clients.specific_destination::TEXT ILIKE ${stringSearch}
        OR clients.savings_amount::TEXT ILIKE ${stringSearch}
        OR clients.attending_school_upon_exit::TEXT ILIKE ${stringSearch}
        OR clients.reunified::TEXT ILIKE ${stringSearch}
        OR clients.successful_completion::TEXT ILIKE ${stringSearch}
        OR clients.destination_city::TEXT ILIKE ${stringSearch}
        OR case_managers.first_name::TEXT ILIKE ${stringSearch}
        OR case_managers.last_name::TEXT ILIKE ${stringSearch}
        OR locations.name::TEXT ILIKE ${stringSearch}
      )`;
    }

    if (filter) {
      queryStr += `AND ${filter}`;
    }

    queryStr += " ORDER BY clients.id DESC";

    if (page) {
      queryStr += ` LIMIT ${page}`;
    }
    const clients = await db.query(queryStr);
    res.status(200).json(keysToCamel(clients));
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

clientsRouter.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const clients = await db.query(
      `SELECT * FROM clients WHERE email COLLATE "C" = $1`,
      [email]
    );
    res.status(200).json(keysToCamel(clients));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Creates new client based on key values provided into request body.
clientsRouter.post("/", async (req, res) => {
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
      comments,
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
          comments
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
          $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39
        )
        RETURNING id;
        `,

      [
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
        comments,
      ]
    );

    res.status(200).json({ id: data[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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
      comments,
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
        destination_city = COALESCE($38, destination_city),
        comments = COALESCE($39, comments)
      WHERE id = $40
      RETURNING id;
    `;

    const data = await db.query(query, [
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
      comments,
      id,
    ]);

    res.status(200).json({ id: data[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Delete a client
clientsRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM clients WHERE id = $1", [id]);
    res.status(200).json();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

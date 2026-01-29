import { Router } from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

export const caseManagerMonthlyStatsRouter = Router();

caseManagerMonthlyStatsRouter.get("/", async (req, res) => {
  try {
    const { startMonth, endMonth } = req.query;
    // Do both startMonth and endMonth need to be provided?

    let query = "SELECT * FROM cm_monthly_stats";
    const conditions: string[] = [];
    const params: number[] = [];

    if (startMonth) {
      conditions.push(`EXTRACT(MONTH FROM date) >= $${conditions.length + 1}`);
      params.push(parseInt(startMonth as string, 10));
    }

    if (endMonth) {
      conditions.push(`EXTRACT(MONTH FROM date) <= $${conditions.length + 1}`);
      params.push(parseInt(endMonth as string, 10));
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY date DESC";

    const data = await db.any(query, params);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

caseManagerMonthlyStatsRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await db.query('SELECT * FROM cm_monthly_stats where id = $1', [id]);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

caseManagerMonthlyStatsRouter.post("/", async (req, res) => {
  try {
    const {
      date,
      cm_id,
      total_number_of_contacts,
      women_birthdays,
      kid_birthdays,
      birthday_cards,
      birthday_cards_value,
      food_cards,
      food_cards_value,
      bus_passes,
      bus_passes_value,
      gas_cards,
      gas_cards_value,
      women_healthcare_referrals,
      kid_healthcare_referrals,
      women_counseling_referrals,
      kid_counseling_referrals,
      babies_born,
      women_degrees_earned,
      women_enrolled_in_school,
      women_licenses_earned,
      reunifications,
      number_of_interviews_conducted,
      number_of_positive_tests,
      number_of_ncns,
      number_of_others,
      number_of_interviews_accpeted,
    } = req.body;
    const query = `
      INSERT INTO cm_monthly_stats (
        date,
        cm_id,
        total_number_of_contacts,
        women_birthdays,
        kid_birthdays,
        birthday_cards,
        birthday_cards_value,
        food_cards,
        food_cards_value,
        bus_passes,
        bus_passes_value,
        gas_cards,
        gas_cards_value,
        women_healthcare_referrals,
        kid_healthcare_referrals,
        women_counseling_referrals,
        kid_counseling_referrals,
        babies_born,
        women_degrees_earned,
        women_enrolled_in_school,
        women_licenses_earned,
        reunifications,
        number_of_interviews_conducted,
        number_of_positive_tests,
        number_of_ncns,
        number_of_others,
        number_of_interviews_accpeted
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
      )
      RETURNING id;
    `;

    const data = await db.query(query, [
      date,
      cm_id,
      total_number_of_contacts,
      women_birthdays,
      kid_birthdays,
      birthday_cards,
      birthday_cards_value,
      food_cards,
      food_cards_value,
      bus_passes,
      bus_passes_value,
      gas_cards,
      gas_cards_value,
      women_healthcare_referrals,
      kid_healthcare_referrals,
      women_counseling_referrals,
      kid_counseling_referrals,
      babies_born,
      women_degrees_earned,
      women_enrolled_in_school,
      women_licenses_earned,
      reunifications,
      number_of_interviews_conducted,
      number_of_positive_tests,
      number_of_ncns,
      number_of_others,
      number_of_interviews_accpeted,
    ]);

    res.status(200).json({ id: data[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

caseManagerMonthlyStatsRouter.put("/:id", async (req, res) => {
  // Do all the fields need to be provided? Or should the UPDATE still work
  // if some are not provided, in which case those attributes are left the same?
  try {
    const ID = req.params.id;

    const {
      cm_id,
      babies_born,
      enrolled_in_school,
      earned_degree,
      earned_drivers_license,
      reunified_with_children,
      womens_birthdays,
      childrens_birthdays,
      birthday_gift_card_values,
      food_card_values,
      bus_passes,
      gas_cards_value,
      phone_contacts,
      inperson_contacts,
      email_contacts,
      interviews_scheduled,
      interviews_conducted,
      positive_tests,
      no_call_no_shows,
      other,
    } = req.body;

    const query = `
      UPDATE cm_monthly_stats
      SET
        cm_id = $2,
        babies_born = $3,
        enrolled_in_school = $4,
        earned_degree = $5,
        earned_drivers_license = $6,
        reunified_with_children = $7,
        womens_birthdays = $8,
        childrens_birthdays = $9,
        birthday_gift_card_values = $10,
        food_card_values = $11,
        bus_passes = $12,
        gas_cards_value = $13,
        phone_contacts = $14,
        inperson_contacts = $15,
        email_contacts = $16,
        interviews_scheduled = $17,
        interviews_conducted = $18,
        positive_tests = $19,
        no_call_no_shows = $20,
        other = $21
      WHERE id = $1
      RETURNING id;
    `;

    const data = await db.query(query, [
      ID,
      cm_id,
      babies_born,
      enrolled_in_school,
      earned_degree,
      earned_drivers_license,
      reunified_with_children,
      womens_birthdays,
      childrens_birthdays,
      birthday_gift_card_values,
      food_card_values,
      bus_passes,
      gas_cards_value,
      phone_contacts,
      inperson_contacts,
      email_contacts,
      interviews_scheduled,
      interviews_conducted,
      positive_tests,
      no_call_no_shows,
      other,
    ]);

    if (!data.length) {
      return res.status(404).send("Record not found.");
    }

    res.status(200).json({ id: data[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

caseManagerMonthlyStatsRouter.delete("/:id", async (req, res) => {
  try {
    const ID = req.params.id;

    const query = `
      DELETE FROM cm_monthly_stats
      WHERE id = $1
      RETURNING id;
    `;

    const data = await db.query(query, [ID]);

    if (!data.length) {
      return res.status(404).send("Record not found.");
    }

    res.status(200).json({ id: data[0].id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

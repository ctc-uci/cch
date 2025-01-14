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

    const data = await db.any(query, params);

    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

caseManagerMonthlyStatsRouter.post("/", async (req, res) => {
  try {
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
      INSERT INTO cm_monthly_stats (
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
        other
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20
      )
      RETURNING id;
    `;

    const data = await db.query(query, [
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


// TODO: delete sample router file

import express from "express";

import { keysToCamel } from "../common/utils";
import { db } from "../db/db-pgp";

const donationRouter = express.Router();
donationRouter.use(express.json());

donationRouter.get("/", async (req, res) => {
  try {
    const { search, filter } = req.query;
    let queryStr = `
      SELECT
        donations.*,
        donors.name        AS donor,
        ROUND(donations.weight * donations.value, 2) AS total
      FROM donations
      JOIN donors
        ON donations.donor_id = donors.id
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      queryStr += `
      AND (donations.id::TEXT ILIKE ${stringSearch}
        OR donations.date::TEXT ILIKE ${stringSearch}
        OR donations.weight::TEXT ILIKE ${stringSearch}
        OR donations.value::TEXT ILIKE ${stringSearch}
        OR donations.category::TEXT ILIKE ${stringSearch}
        OR donors.name::TEXT ILIKE ${stringSearch}
      )`;
    }

    if (filter) {
      if (typeof filter === 'string') {
        queryStr += `AND (${filter.replace(/donations\.category/g, 'donations.category::TEXT')})`;
      }
    }

    queryStr += " ORDER BY donations.id ASC";

    const donations = await db.query(queryStr);
    res.status(200).json(keysToCamel(donations));
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

// donationRouter.get("/", async (req, res) => {
//   try {
//     // Query database
//     const data = await db.query(
//       `SELECT donations.*,
//       donors.name AS donor
//       FROM donations
//       LEFT JOIN donors ON donations.donor_id = donors.id`
//     );

//     res.status(200).json(keysToCamel(data));
//   } catch (err) {
//     res.status(500).send(err.message);
//   }
// });

donationRouter.get("/date", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const data = await db.query(
      `SELECT * FROM food_donations WHERE date >= $1 AND date < $2`,
      [startDate, endDate]
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/donors", async (req, res) => {
  try {
    const data = await db.query(
      `SELECT name from donors`
    );
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.post("/donors", async (req, res) => {
  try {
    const { name } = req.body;
    const data = await db.query(
      `INSERT INTO donors (name) VALUES ($1) RETURNING id`,
      [name]
    );
    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/valueSum", async (req, res) => {
  try {
    const { donor, startDate, endDate } = req.query;
    let query = `SELECT SUM(value*weight) FROM donations`;
    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donor = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    const data = await db.query(
        query
    );
    res.status(200).send(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/weightSum", async (req, res) => {
  try {
    const { donor, startDate, endDate } = req.query;
    let query = `SELECT SUM(ROUND(CAST(weight * value AS DECIMAL), 2)) FROM donations`;
    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donor = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");
    const data = await db.query(
        query
    );
    res.status(200).send(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/filter/", async (req, res) => {
  try {
    // Query database
    const { donor, startDate, endDate, search, filter} = req.query;
    let query = `
      SELECT
        donations.*,
        donors.name        AS donor,
        ROUND(donations.weight * donations.value, 2) AS total
      FROM donations
      JOIN donors
        ON donations.donor_id = donors.id
    `
    if (donor || startDate || endDate) {
      query += " WHERE ";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donors.name = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` donations.date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` donations.date <= '${endDate}'`);
    }
    query += queryParams.join(" AND ");

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      query += `
      AND (donations.id::TEXT ILIKE ${stringSearch}
        OR donations.date::TEXT ILIKE ${stringSearch}
        OR donations.weight::TEXT ILIKE ${stringSearch}
        OR donations.value::TEXT ILIKE ${stringSearch}
        OR donations.category::TEXT ILIKE ${stringSearch}
        OR donors.name::TEXT ILIKE ${stringSearch}
      )`;
    }

    if (filter) {
      if (typeof filter === 'string') {
        query += `AND (${filter.replace(/donations\.category/g, 'donations.category::TEXT')})`;
      }
    }

    query += " ORDER BY donations.date DESC;";
    const data = await db.query(query);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/monthfilter/", async (req, res) => {
  try {
    const { donor, startDate, endDate, search, filter} = req.query;
    let query = `
      SELECT
        donors.name              AS donor,
        donations.category,
        TO_CHAR(donations.date, 'FMMonth YYYY') AS month_year,
        ROUND(SUM(donations.weight * donations.value)::numeric, 2) AS total_value,
        ROUND(SUM(donations.weight)::numeric, 2)           AS total_weight,
        MAX(donations.date)                                AS latest_date
      FROM donations
      LEFT JOIN donors
        ON donations.donor_id = donors.id
    `;
    if (donor || startDate || endDate) {
      query += " WHERE ";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donors.name = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` donations.date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` donations.date <= '${endDate}'`);
    }
    query += queryParams.join(" AND ");
    query += `
      GROUP BY donors.name, donations.category, TO_CHAR(donations.date, 'FMMonth YYYY')
      ORDER BY latest_date DESC
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      query = `
        WITH filtered AS (${query})
        SELECT *
        FROM filtered
        WHERE
        month_year::TEXT ILIKE ${stringSearch}
        OR total_weight::TEXT ILIKE ${stringSearch}
        OR total_value::TEXT ILIKE ${stringSearch}
        OR category::TEXT ILIKE ${stringSearch}
        OR donor::TEXT ILIKE ${stringSearch}
      `;
    }

    if (filter) {
      if (typeof filter === 'string') {
        query += `AND (${filter.replace(/donations\.category/g, 'donations.category::TEXT')})`;
      }
    }

    const data = await db.query(query);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.get("/yearfilter/", async (req, res) => {
  try {
    const { donor, startDate, endDate, search, filter} = req.query;
    let query = `
      SELECT
        donors.name              AS donor,
        donations.category,
        TO_CHAR(donations.date, 'FMYYYY')       AS month_year,
        ROUND(SUM(donations.weight * donations.value)::numeric, 2) AS total_value,
        ROUND(SUM(donations.weight)::numeric, 2)           AS total_weight,
        MAX(donations.date)                                AS latest_date
      FROM donations
      LEFT JOIN donors
        ON donations.donor_id = donors.id
    `;

    if (donor || startDate || endDate) {
      query += " WHERE";
    }
    const queryParams = [];
    if (donor) {
      queryParams.push(` donors.name = '${donor}'`);
    }
    if (startDate) {
      queryParams.push(` donations.date >= '${startDate}'`);
    }
    if (endDate) {
      queryParams.push(` donations.date <= '${endDate}'`);
    }
    query += queryParams.join(" AND");

    query += `
      GROUP BY donor, category, month_year
      ORDER BY latest_date DESC
    `;

    const stringSearch = "'%" + String(search) + "%'";

    if (search) {
      query = `
        WITH filtered AS (${query})
        SELECT *
        FROM filtered
        WHERE
        month_year::TEXT ILIKE ${stringSearch}
        OR total_weight::TEXT ILIKE ${stringSearch}
        OR total_value::TEXT ILIKE ${stringSearch}
        OR category::TEXT ILIKE ${stringSearch}
        OR donor::TEXT ILIKE ${stringSearch}
      `;
    }

    if (filter) {
      if (typeof filter === 'string') {
        query += `AND (${filter.replace(/donations\.category/g, 'donations.category::TEXT')})`;
      }
    }

    const data = await db.query(query);
    res.status(200).json(keysToCamel(data));
  } catch (err) {
    res.status(500).send(err.message);
  }
});

donationRouter.post("/", async (req, res) => {
  try {
    const { date, weight, value, donor, category } = req.body;
    //console.log(donor);
    const data = await db.query(
      `SELECT id FROM donors WHERE name = $1`,
      [donor]
    ).then((donor_id) => {
      return db.query(
        `INSERT INTO donations (date, weight, value, donor_id, category) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        [date, weight, value, donor_id[0]['id'], category]
      );
    })

    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    res.status(500).send(err.message);
    //console.log(err);
  }
});

donationRouter.put("/:id", async (req, res) => {
  try {
    const { date, weight, value, donor } = req.body;
    console.log(req.body);
    const { id } = req.params;
    console.log(id);
    // Use the same pattern as POST request to ensure donor_id is properly retrieved
    const data = await db.query(
      `SELECT id FROM donors WHERE name = $1`,
      [donor]
    ).then((donor_id) => {
      return db.query(
        `UPDATE donations SET date = COALESCE($1, date), weight = COALESCE($2, weight), value = COALESCE($3, value),
        donor_id = COALESCE($4, donor_id) WHERE id = $5 RETURNING id`,
        [date, weight, value, donor_id[0]['id'], id]
      );
    });
    res.status(200).json(keysToCamel(data[0]["id"]));
  } catch (err) {
    console.log(err);
    res.status(400).send(err.message);
  }
});

donationRouter.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !ids.length) {
      return res.status(200).json();
    }
    const placeholders = ids.map((_item: number, index: number) => `$${index + 1}`).join(",");

    const query = `DELETE FROM donations WHERE id IN (${placeholders})`;
    await db.query(query, ids);

    res.status(200).json();
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export { donationRouter };

-- DEPRECATED: Do not use. Client unit is stored as clients.unit_name (VARCHAR).
-- This table is dropped by migration 005_drop_units_table.sql.

DROP TABLE IF EXISTS units;

CREATE TYPE type AS ENUM ('family', 'single');

CREATE TABLE units(
	id SERIAL NOT NULL PRIMARY KEY,
	location_id INT NOT NULL,
	name VARCHAR(64) NOT NULL,
	type type NOT NULL,
	FOREIGN KEY (location_id) REFERENCES locations(id)
);

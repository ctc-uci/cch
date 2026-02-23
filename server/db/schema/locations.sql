-- DEPRECATED: Do not use. Case manager location is now case_managers.location.
-- This table is dropped by migration 005_drop_locations_table.sql.
DROP TABLE IF EXISTS locations;

CREATE TABLE locations(
	id SERIAL NOT NULL PRIMARY KEY,
	cm_id INT NOT NULL,
	name VARCHAR(64) NOT NULL,
	date date NOT NULL,
	caloptima_funded BOOLEAN NOT NULL,
	FOREIGN KEY (cm_id) REFERENCES case_managers(id)
);

DROP TABLE IF EXISTS units;

CREATE TYPE type AS ENUM ('family', 'single');

CREATE TABLE units(
	id INT NOT NULL PRIMARY KEY,
	location_id INT NOT NULL,
	name VARCHAR(64) NOT NULL,
	type type NOT NULL,
	FOREIGN KEY (location_id) REFERENCES locations(id)
);

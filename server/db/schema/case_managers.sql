DROP TABLE IF EXISTS case_managers;

CREATE TYPE role AS ENUM ('superadmin', 'admin', 'case manager', 'intern');

CREATE TABLE case_managers(
	id SERIAL NOT NULL PRIMARY KEY,
	role role NOT NULL,
	first_name VARCHAR(16) NOT NULL,
	last_name VARCHAR(16) NOT NULL,
	phone_number VARCHAR(10) NOT NULL,
	email VARCHAR(32) NOT NULL UNIQUE,
	location VARCHAR(128)
);

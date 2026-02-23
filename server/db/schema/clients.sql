DROP TABLE IF EXISTS clients;

CREATE TYPE ethnicity AS ENUM ('Non-Hispanic', 'Hispanic', 'Refused');
CREATE TYPE race AS ENUM('Caucasian', 'Hispanic', 'African American', 'Asian', 'Pacific Islander/Hawaiian', 'Native American', 'Multi/Other');
CREATE TYPE client_status AS ENUM('Active', 'Exited');

CREATE TABLE clients (
    id SERIAL NOT NULL PRIMARY KEY,
    created_by INT NOT NULL,
    unit_name VARCHAR(256) NOT NULL,
    "grant" VARCHAR(256),
    "status" client_status NOT NULL,
    first_name VARCHAR(16) NOT NULL,
    last_name VARCHAR(16) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INT NOT NULL,
    phone_number VARCHAR(10) NOT NULL,
    email VARCHAR(32) NOT NULL,
    emergency_contact_name VARCHAR(32) NOT NULL,
    emergency_contact_phone_number VARCHAR(10) NOT NULL,
    medical BOOLEAN NOT NULL,
    entrance_date DATE NOT NULL,
    estimated_exit_date DATE NOT NULL,
    exit_date DATE,
    bed_nights INT NOT NULL,
    bed_nights_children INT NOT NULL,
    pregnant_upon_entry BOOLEAN NOT NULL,
    disabled_children BOOLEAN NOT NULL,
    ethnicity ethnicity NOT NULL,
    race race NOT NULL,
    city_of_last_permanent_residence VARCHAR(256) NOT NULL,
    prior_living VARCHAR(256) NOT NULL,
    prior_living_city VARCHAR(256) NOT NULL,
    shelter_in_last_five_years BOOLEAN NOT NULL,
    homelessness_length INT NOT NULL,
    chronically_homeless BOOLEAN NOT NULL,
    attending_school_upon_entry BOOLEAN NOT NULL,
    employement_gained BOOLEAN NOT NULL,
    reason_for_leaving VARCHAR(1024),
    specific_reason_for_leaving VARCHAR(1024),
    specific_destination VARCHAR(64),
    savings_amount NUMERIC(10, 2),
    attending_school_upon_exit BOOLEAN,
    reunified BOOLEAN,
    successful_completion BOOLEAN,
    destination_city VARCHAR(32),
    comments VARCHAR(2048),
    FOREIGN KEY (created_by) REFERENCES case_managers(id)
);

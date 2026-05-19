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
    date_of_birth DATE,
    age INT,
    phone_number VARCHAR(10),
    email VARCHAR(32),
    emergency_contact_name VARCHAR(32),
    emergency_contact_phone_number VARCHAR(10),
    medical BOOLEAN,
    entrance_date DATE,
    estimated_exit_date DATE,
    exit_date DATE,
    bed_nights INT,
    bed_nights_children INT,
    pregnant_upon_entry BOOLEAN,
    disabled_children BOOLEAN,
    ethnicity ethnicity,
    race race,
    city_of_last_permanent_residence VARCHAR(256),
    prior_living VARCHAR(256),
    prior_living_city VARCHAR(256),
    shelter_in_last_five_years BOOLEAN,
    homelessness_length INT,
    chronically_homeless BOOLEAN,
    attending_school_upon_entry BOOLEAN,
    employement_gained BOOLEAN,
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

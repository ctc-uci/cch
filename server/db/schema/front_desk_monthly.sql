DROP TABLE IF EXISTS front_desk_monthly CASCADE;


CREATE TABLE front_desk_monthly(
    id SERIAL PRIMARY KEY NOT NULL,
    month  varchar(256) NOT NULL,
    total_office_visits int NOT NULL,
    total_calls int NOT NULL,
    total_unduplicated_calles int NOT NULL,
    total_visits_to_pantry_and_donations_room int NOT NULL,
    total_number_of_people_served_in_pantry int NOT NULL,
    total_visits_to_placentia_pantry int NOT NULL,
    total_number_of_people_served_in_placentia_pantry int NOT NULL
);
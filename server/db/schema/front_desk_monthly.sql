DROP TABLE IF EXISTS front_desk_monthly CASCADE;


CREATE TABLE front_desk_monthly(
    id SERIAL PRIMARY KEY NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    total_office_visits int NOT NULL,
    total_calls int NOT NULL,
    total_unduplicated_calls int NOT NULL,
    total_visits_hb_donations_room int NOT NULL,
    total_served_hb_donations_room int NOT NULL,
    total_visits_hb_pantry int NOT NULL,
    total_served_hb_pantry int NOT NULL,
    total_visits_placentia_pantry int NOT NULL,
    total_served_placentia_pantry int NOT NULL,
    total_visits_placentia_neighborhood int NOT NULL,
    total_served_placentia_neighborhood int NOT NULL,
);

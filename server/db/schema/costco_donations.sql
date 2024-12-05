DROP TABLE IF EXISTS costco_donations CASCADE;

CREATE TYPE donation_category AS ENUM ('client', 'food');

CREATE TABLE costco_donations(
    id SERIAL PRIMARY KEY NOT NULL,
    date date NOT NULL,
    amount numeric NOT NULL,
    category donation_category NOT NULL
);
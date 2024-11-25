DROP TABLE IF EXISTS food_donations CASCADE;

CREATE TYPE donation_category AS ENUM ('panera', 'sprouts','mcdonalds','pantry','grand theater');

CREATE TABLE food_donations(
    id SERIAL PRIMARY KEY NOT NULL,
    date date NOT NULL,
    weight numeric NOT NULL,
    value numeric NOT NULL,
    category donation_category NOT NULL
);
DROP TABLE IF EXISTS food_donations CASCADE;

CREATE TYPE donation_donor AS ENUM ('panera', 'sprouts','mcdonalds','pantry','grand theater', 'costco', 'copia');
CREATE TYPE donation_category AS ENUM ('Food', 'Client');

CREATE TABLE donations(
    id SERIAL PRIMARY KEY NOT NULL,
    date date NOT NULL,
    weight numeric NOT NULL,
    value numeric NOT NULL,
    category donation_category NOT NULL,
    donor donation_donor NOT NULL
);

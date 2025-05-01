DROP TABLE IF EXISTS food_donations CASCADE;

-- CREATE TYPE donation_donor AS ENUM ('panera', 'sprouts','mcdonalds','pantry','grand theater', 'costco', 'copia');
CREATE TYPE donation_category AS ENUM ('food', 'client');

CREATE TABLE donations(
    id SERIAL PRIMARY KEY NOT NULL,
    date date NOT NULL,
    weight numeric NOT NULL,
    value numeric NOT NULL,
    category donation_category NOT NULL,
    donor_id INT FOREIGN KEY REFERENCES donors ON DELETE CASCADE NOT NULL
);

DROP TABLE IF EXISTS children CASCADE;

CREATE TABLE IF NOT EXISTS children (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(16) NOT NULL,
    last_name VARCHAR(16) NOT NULL,
    parent_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    reunified BOOL NOT NULL,
    comments VARCHAR(2048),
    FOREIGN KEY (parent_id) REFERENCES clients(id) ON DELETE CASCADE
);

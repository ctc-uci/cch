DROP TABLE IF EXISTS success_story CASCADE;

CREATE TABLE IF NOT EXISTS success_story (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    client_id INT,
    name VARCHAR(30) NOT NULL,
    cm_id INT NOT NULL,
    previous_situation VARCHAR(2048) NOT NULL,
    cch_impact VARCHAR(2048) NOT NULL,
    where_now VARCHAR(2048) NOT NULL,
    tell_donors VARCHAR(2048) NOT NULL,
    quote VARCHAR(2048) NOT NULL,
    consent BOOLEAN NOT NULL,

    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY(cm_id) REFERENCES case_managers(id)
);

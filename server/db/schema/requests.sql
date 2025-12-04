DROP TABLE IF EXISTS requests;
DROP TYPE IF EXISTS request_status;

CREATE TYPE request_status AS ENUM ('active', 'approved', 'rejected');

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    status request_status NOT NULL DEFAULT 'active',
    created_by INT NOT NULL,
    updated_by INT,
    comments VARCHAR(1024) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    client_id INT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (updated_by) REFERENCES users(id)
);
CREATE INDEX ON requests (created_at);

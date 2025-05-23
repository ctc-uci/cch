DROP TABLE IF EXISTS auth_codes;

CREATE TABLE auth_codes (
    id SERIAL NOT NULL PRIMARY KEY,
    code INT NOT NULL,
    email VARCHAR(256) NOT NULL REFERENCES users(email) ON DELETE CASCADE,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
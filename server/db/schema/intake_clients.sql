DROP TABLE IF EXISTS intake_clients CASCADE;

-- New dynamic intake clients table - only essential fields
-- All other form data is stored in intake_responses table for flexibility
-- This is separate from the original 'clients' table for safe rollback
CREATE TABLE intake_clients (
    id SERIAL NOT NULL PRIMARY KEY,
    created_by INT NOT NULL,
    unit_name VARCHAR(256) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'Active',
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES case_managers(id)
);

-- Create index for common queries
CREATE INDEX idx_intake_clients_status ON intake_clients(status);
CREATE INDEX idx_intake_clients_created_by ON intake_clients(created_by);
CREATE INDEX idx_intake_clients_unit ON intake_clients(unit_name);


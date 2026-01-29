DROP TABLE IF EXISTS intake_children CASCADE;

-- Children table for intake_clients (mirrors children table structure)
-- Separate from original children table for safe rollback
CREATE TABLE IF NOT EXISTS intake_children (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64) NOT NULL,
    parent_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    reunified BOOL NOT NULL DEFAULT false,
    comments VARCHAR(2048),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES intake_clients(id) ON DELETE CASCADE
);

-- Create indexes for common queries
CREATE INDEX idx_intake_children_parent ON intake_children(parent_id);


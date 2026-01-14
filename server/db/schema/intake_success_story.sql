DROP TABLE IF EXISTS intake_success_story CASCADE;

-- Success story table for intake_clients (mirrors success_story table structure)
-- Separate from original success_story table for safe rollback
CREATE TABLE IF NOT EXISTS intake_success_story (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    client_id INT,
    name VARCHAR(64) NOT NULL,
    cm_id INT NOT NULL,
    site INT,
    entrance_date DATE,
    exit_date DATE,
    previous_situation VARCHAR(2048) NOT NULL,
    cch_impact VARCHAR(2048) NOT NULL,
    where_now VARCHAR(2048) NOT NULL,
    tell_donors VARCHAR(2048) NOT NULL,
    quote VARCHAR(2048) NOT NULL,
    consent BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(client_id) REFERENCES intake_clients(id) ON DELETE CASCADE,
    FOREIGN KEY(cm_id) REFERENCES case_managers(id),
    FOREIGN KEY(site) REFERENCES locations(id)
);

-- Create indexes for common queries
CREATE INDEX idx_intake_success_story_client ON intake_success_story(client_id);
CREATE INDEX idx_intake_success_story_cm ON intake_success_story(cm_id);


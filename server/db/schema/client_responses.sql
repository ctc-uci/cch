DROP TABLE IF EXISTS intake_responses;

-- Stores dynamic form responses for intake_clients (EAV pattern)
-- Separate from original clients table for safe rollback
CREATE TABLE intake_responses (
    id SERIAL NOT NULL PRIMARY KEY,
    client_id INT NOT NULL,
    question_id INT NOT NULL,
    response_value TEXT,  -- stored as text, parsed based on question_type
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES intake_clients(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES form_questions(id) ON DELETE RESTRICT,
    UNIQUE(client_id, question_id)  -- one response per question per client
);

-- Create indexes for faster lookups
CREATE INDEX idx_intake_responses_client ON intake_responses(client_id);
CREATE INDEX idx_intake_responses_question ON intake_responses(question_id);


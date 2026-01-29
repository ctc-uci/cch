DROP TABLE IF EXISTS intake_responses;

-- Stores dynamic form responses for intake_clients (EAV pattern)
-- Separate from original clients table for safe rollback
CREATE TABLE intake_responses (
    id SERIAL NOT NULL PRIMARY KEY,
    client_id INT,  -- references clients.id when form data matches a client (nullable for unmatched forms)
    question_id INT NOT NULL,
    response_value TEXT,  -- stored as text, parsed based on question_type
    session_id UUID,  -- groups responses from the same survey submission
    form_id INT NOT NULL,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (question_id) REFERENCES form_questions(id) ON DELETE RESTRICT
);

-- Create indexes for faster lookups
CREATE INDEX idx_intake_responses_client ON intake_responses(client_id);
CREATE INDEX idx_intake_responses_question ON intake_responses(question_id);
CREATE INDEX idx_intake_responses_session ON intake_responses(session_id);


DROP TABLE IF EXISTS intake_responses;

-- Stores dynamic form responses for intake_clients (EAV pattern)
-- Supports multiple forms per client (intake form, surveys, etc.)
CREATE TABLE intake_responses (
    id SERIAL NOT NULL PRIMARY KEY,
    client_id INT NOT NULL,
    form_id INT NOT NULL,                    -- which form this response belongs to
    question_id INT NOT NULL,
    response_value TEXT,                     -- stored as text, parsed based on question_type
    submitted_at TIMESTAMP,                  -- when the form was submitted (null if draft)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES intake_clients(id) ON DELETE CASCADE,
    FOREIGN KEY (form_id) REFERENCES intake_forms(id) ON DELETE RESTRICT,
    FOREIGN KEY (question_id) REFERENCES form_questions(id) ON DELETE RESTRICT,
    UNIQUE(client_id, form_id, question_id)  -- one response per question per client per form
);

-- Create indexes for faster lookups
CREATE INDEX idx_intake_responses_client ON intake_responses(client_id);
CREATE INDEX idx_intake_responses_form ON intake_responses(form_id);
CREATE INDEX idx_intake_responses_question ON intake_responses(question_id);
CREATE INDEX idx_intake_responses_client_form ON intake_responses(client_id, form_id);

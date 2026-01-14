DROP TABLE IF EXISTS intake_forms CASCADE;

-- Defines different form types in the system
-- Each form can have its own set of questions
CREATE TABLE intake_forms (
    id SERIAL PRIMARY KEY,
    form_key VARCHAR(64) NOT NULL UNIQUE,     -- unique identifier: 'client_intake', 'random_survey', etc.
    form_name VARCHAR(128) NOT NULL,          -- display name: 'Client Intake Form'
    description TEXT,                          -- optional description of the form's purpose
    is_active BOOLEAN NOT NULL DEFAULT true,  -- soft delete / disable forms
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for common lookups
CREATE INDEX idx_intake_forms_key ON intake_forms(form_key);
CREATE INDEX idx_intake_forms_active ON intake_forms(is_active);

-- Seed with initial form types
INSERT INTO intake_forms (form_key, form_name, description) VALUES
('client_intake', 'Client Intake Form', 'Main intake form for new clients entering the program'),
('random_survey', 'Random Client Survey', 'Periodic survey for current clients'),
('exit_survey', 'Exit Survey Form', 'Survey completed when clients exit the program'),
('success_story', 'Success Story Form', 'Form to capture client success stories');

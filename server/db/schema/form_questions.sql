DROP TABLE IF EXISTS form_questions CASCADE;

CREATE TYPE question_type AS ENUM ('text', 'number', 'boolean', 'date', 'select', 'textarea', 'rating_grid', 'case_manager_select');
CREATE TYPE question_category AS ENUM ('personal', 'contact', 'housing', 'demographics', 'program', 'exit');

CREATE TABLE form_questions (
    id SERIAL NOT NULL PRIMARY KEY,
    field_key VARCHAR(512) NOT NULL UNIQUE,  -- unique identifier for the field (e.g., 'first_name', 'ethnicity')
    question_text VARCHAR(512) NOT NULL,     -- the label shown to users
    question_type question_type NOT NULL,    -- type of input field
    category question_category NOT NULL,     -- grouping for form sections
    options JSONB,                           -- for 'select' type: array of {value, label} options
    is_required BOOLEAN NOT NULL DEFAULT true,
    is_visible BOOLEAN NOT NULL DEFAULT true, -- soft delete: hide without removing
    is_core BOOLEAN NOT NULL DEFAULT false,   -- core fields can't be hidden (e.g., name, status)
    display_order INT NOT NULL DEFAULT 0,     -- order in which questions appear
    validation_rules JSONB,                   -- optional validation (min, max, pattern, etc.)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_form_questions_visible ON form_questions(is_visible);
CREATE INDEX idx_form_questions_category ON form_questions(category);
CREATE INDEX idx_form_questions_order ON form_questions(display_order);

-- Seed with the existing questions (migrated from original clients table columns)
-- Personal Information
INSERT INTO form_questions (field_key, question_text, question_type, category, is_required, is_core, display_order) VALUES
('first_name', 'First Name', 'text', 'personal', true, true, 1),
('last_name', 'Last Name', 'text', 'personal', true, true, 2),
('date_of_birth', 'Birthday', 'date', 'personal', true, false, 3),
('age', 'Age', 'number', 'personal', true, false, 4);

-- Contact Information
INSERT INTO form_questions (field_key, question_text, question_type, category, is_required, is_core, display_order) VALUES
('phone_number', 'Phone Number', 'text', 'contact', true, false, 10),
('email', 'Email', 'text', 'contact', true, false, 11),
('emergency_contact_name', 'Emergency Contact Name', 'text', 'contact', true, false, 12),
('emergency_contact_phone_number', 'Emergency Contact Phone', 'text', 'contact', true, false, 13);

-- Program Information
INSERT INTO form_questions (field_key, question_text, question_type, category, options, is_required, is_core, display_order) VALUES
('status', 'Status', 'select', 'program', '[{"value": "Active", "label": "Active"}, {"value": "Exited", "label": "Exited"}]', true, true, 20),
('grant', 'Grant', 'text', 'program', null, true, false, 21),
('medical', 'Medical', 'boolean', 'program', null, true, false, 22),
('entrance_date', 'Entry Date', 'date', 'program', null, true, false, 23),
('estimated_exit_date', 'Estimated Exit Date', 'date', 'program', null, true, false, 24),
('exit_date', 'Exit Date', 'date', 'program', null, false, false, 25),
('bed_nights', 'Bed Nights', 'number', 'program', null, true, false, 26),
('bed_nights_children', 'Bed Nights with Children', 'number', 'program', null, true, false, 27);

-- Demographics
INSERT INTO form_questions (field_key, question_text, question_type, category, options, is_required, display_order) VALUES
('pregnant_upon_entry', 'Pregnant Upon Entry?', 'boolean', 'demographics', null, true, 30),
('disabled_children', 'Disabled Children', 'boolean', 'demographics', null, true, 31),
('ethnicity', 'Ethnicity', 'select', 'demographics', '[{"value": "Hispanic", "label": "Hispanic"}, {"value": "Non-Hispanic", "label": "Non-Hispanic"}, {"value": "Refused", "label": "Refused"}]', true, 32),
('race', 'Race', 'select', 'demographics', '[{"value": "Hispanic", "label": "Hispanic"}, {"value": "Caucasian", "label": "Caucasian"}, {"value": "African American", "label": "African American"}, {"value": "Asian", "label": "Asian"}, {"value": "Native American", "label": "Native American"}, {"value": "Pacific Islander/Hawaiian", "label": "Pacific Islander/Hawaiian"}, {"value": "Multi/Other", "label": "Multi/Other"}]', true, 33);

-- Housing History
INSERT INTO form_questions (field_key, question_text, question_type, category, is_required, display_order) VALUES
('city_of_last_permanent_residence', 'City of Last Permanent Residence', 'text', 'housing', true, 40),
('prior_living', 'Prior Living', 'text', 'housing', true, 41),
('prior_living_city', 'Prior Living City', 'text', 'housing', true, 42),
('shelter_in_last_five_years', 'Shelter in Last 5 Years', 'boolean', 'housing', true, 43),
('homelessness_length', 'Length of Homelessness (months)', 'number', 'housing', true, 44),
('chronically_homeless', 'Chronically Homeless', 'boolean', 'housing', true, 45);

-- Program Progress
INSERT INTO form_questions (field_key, question_text, question_type, category, is_required, display_order) VALUES
('attending_school_upon_entry', 'Attending School Upon Entry', 'boolean', 'program', true, 50),
('employement_gained', 'Employment Gained', 'boolean', 'program', true, 51);

-- Exit Information
INSERT INTO form_questions (field_key, question_text, question_type, category, is_required, display_order) VALUES
('reason_for_leaving', 'Reason for Leaving', 'text', 'exit', false, 60),
('specific_reason_for_leaving', 'Specific Reason for Leaving', 'text', 'exit', false, 61),
('specific_destination', 'Specific Destination', 'text', 'exit', false, 62),
('savings_amount', 'Savings Amount ($)', 'number', 'exit', false, 63),
('attending_school_upon_exit', 'Attending School Upon Exit', 'boolean', 'exit', false, 64),
('reunified', 'Reunified', 'boolean', 'exit', false, 65),
('successful_completion', 'Successful Completion', 'boolean', 'exit', false, 66),
('destination_city', 'Destination City', 'text', 'exit', false, 67),
('comments', 'Comments', 'textarea', 'exit', false, 68);


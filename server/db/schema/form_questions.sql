DROP TABLE IF EXISTS form_questions CASCADE;

CREATE TYPE question_type AS ENUM ('text', 'number', 'boolean', 'date', 'select', 'textarea');
CREATE TYPE question_category AS ENUM ('personal', 'contact', 'housing', 'demographics', 'program', 'exit', 'survey', 'feedback', 'general');

CREATE TABLE form_questions (
    id SERIAL NOT NULL PRIMARY KEY,
    form_id INT NOT NULL,                         -- which form this question belongs to
    field_key VARCHAR(64) NOT NULL,               -- identifier for the field (e.g., 'first_name', 'ethnicity')
    question_text VARCHAR(256) NOT NULL,          -- the label shown to users
    question_type question_type NOT NULL,         -- type of input field
    category question_category NOT NULL,          -- grouping for form sections
    options JSONB,                                -- for 'select' type: array of {value, label} options
    is_required BOOLEAN NOT NULL DEFAULT true,
    is_visible BOOLEAN NOT NULL DEFAULT true,     -- soft delete: hide without removing
    is_core BOOLEAN NOT NULL DEFAULT false,       -- core fields can't be hidden (e.g., name, status)
    display_order INT NOT NULL DEFAULT 0,         -- order in which questions appear
    validation_rules JSONB,                       -- optional validation (min, max, pattern, etc.)
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (form_id) REFERENCES intake_forms(id) ON DELETE CASCADE,
    UNIQUE(form_id, field_key)                    -- field_key must be unique within each form
);

-- Create indexes for faster lookups
CREATE INDEX idx_form_questions_form ON form_questions(form_id);
CREATE INDEX idx_form_questions_visible ON form_questions(is_visible);
CREATE INDEX idx_form_questions_category ON form_questions(category);
CREATE INDEX idx_form_questions_order ON form_questions(display_order);

-- ============================================================================
-- SEED DATA: Client Intake Form (form_id = 1)
-- ============================================================================

-- Personal Information
INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, is_required, is_core, display_order) VALUES
(1, 'first_name', 'First Name', 'text', 'personal', true, true, 1),
(1, 'last_name', 'Last Name', 'text', 'personal', true, true, 2),
(1, 'date_of_birth', 'Birthday', 'date', 'personal', true, false, 3),
(1, 'age', 'Age', 'number', 'personal', true, false, 4);

-- Contact Information
INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, is_required, is_core, display_order) VALUES
(1, 'phone_number', 'Phone Number', 'text', 'contact', true, false, 10),
(1, 'email', 'Email', 'text', 'contact', true, false, 11),
(1, 'emergency_contact_name', 'Emergency Contact Name', 'text', 'contact', true, false, 12),
(1, 'emergency_contact_phone_number', 'Emergency Contact Phone', 'text', 'contact', true, false, 13);

-- Program Information
INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, options, is_required, is_core, display_order) VALUES
(1, 'status', 'Status', 'select', 'program', '[{"value": "Active", "label": "Active"}, {"value": "Exited", "label": "Exited"}]', true, true, 20),
(1, 'grant', 'Grant', 'text', 'program', null, true, false, 21),
(1, 'medical', 'Medical', 'boolean', 'program', null, true, false, 22),
(1, 'entrance_date', 'Entry Date', 'date', 'program', null, true, false, 23),
(1, 'estimated_exit_date', 'Estimated Exit Date', 'date', 'program', null, true, false, 24),
(1, 'exit_date', 'Exit Date', 'date', 'program', null, false, false, 25),
(1, 'bed_nights', 'Bed Nights', 'number', 'program', null, true, false, 26),
(1, 'bed_nights_children', 'Bed Nights with Children', 'number', 'program', null, true, false, 27);

-- Demographics
INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, options, is_required, display_order) VALUES
(1, 'pregnant_upon_entry', 'Pregnant Upon Entry?', 'boolean', 'demographics', null, true, 30),
(1, 'disabled_children', 'Disabled Children', 'boolean', 'demographics', null, true, 31),
(1, 'ethnicity', 'Ethnicity', 'select', 'demographics', '[{"value": "Hispanic", "label": "Hispanic"}, {"value": "Non-Hispanic", "label": "Non-Hispanic"}, {"value": "Refused", "label": "Refused"}]', true, 32),
(1, 'race', 'Race', 'select', 'demographics', '[{"value": "Hispanic", "label": "Hispanic"}, {"value": "Caucasian", "label": "Caucasian"}, {"value": "African American", "label": "African American"}, {"value": "Asian", "label": "Asian"}, {"value": "Native American", "label": "Native American"}, {"value": "Pacific Islander/Hawaiian", "label": "Pacific Islander/Hawaiian"}, {"value": "Multi/Other", "label": "Multi/Other"}]', true, 33);

-- Housing History
INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, is_required, display_order) VALUES
(1, 'city_of_last_permanent_residence', 'City of Last Permanent Residence', 'text', 'housing', true, 40),
(1, 'prior_living', 'Prior Living', 'text', 'housing', true, 41),
(1, 'prior_living_city', 'Prior Living City', 'text', 'housing', true, 42),
(1, 'shelter_in_last_five_years', 'Shelter in Last 5 Years', 'boolean', 'housing', true, 43),
(1, 'homelessness_length', 'Length of Homelessness (months)', 'number', 'housing', true, 44),
(1, 'chronically_homeless', 'Chronically Homeless', 'boolean', 'housing', true, 45);

-- Program Progress
INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, is_required, display_order) VALUES
(1, 'attending_school_upon_entry', 'Attending School Upon Entry', 'boolean', 'program', true, 50),
(1, 'employement_gained', 'Employment Gained', 'boolean', 'program', true, 51);

-- Exit Information
INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, is_required, display_order) VALUES
(1, 'reason_for_leaving', 'Reason for Leaving', 'text', 'exit', false, 60),
(1, 'specific_reason_for_leaving', 'Specific Reason for Leaving', 'text', 'exit', false, 61),
(1, 'specific_destination', 'Specific Destination', 'text', 'exit', false, 62),
(1, 'savings_amount', 'Savings Amount ($)', 'number', 'exit', false, 63),
(1, 'attending_school_upon_exit', 'Attending School Upon Exit', 'boolean', 'exit', false, 64),
(1, 'reunified', 'Reunified', 'boolean', 'exit', false, 65),
(1, 'successful_completion', 'Successful Completion', 'boolean', 'exit', false, 66),
(1, 'destination_city', 'Destination City', 'text', 'exit', false, 67),
(1, 'comments', 'Comments', 'textarea', 'exit', false, 68);

-- ============================================================================
-- SEED DATA: Random Survey Form (form_id = 2)
-- ============================================================================

INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, options, is_required, display_order) VALUES
(2, 'overall_satisfaction', 'How satisfied are you with the program?', 'select', 'survey', '[{"value": "very_satisfied", "label": "Very Satisfied"}, {"value": "satisfied", "label": "Satisfied"}, {"value": "neutral", "label": "Neutral"}, {"value": "dissatisfied", "label": "Dissatisfied"}, {"value": "very_dissatisfied", "label": "Very Dissatisfied"}]', true, 1),
(2, 'staff_helpfulness', 'How helpful has the staff been?', 'select', 'survey', '[{"value": "very_helpful", "label": "Very Helpful"}, {"value": "helpful", "label": "Helpful"}, {"value": "somewhat_helpful", "label": "Somewhat Helpful"}, {"value": "not_helpful", "label": "Not Helpful"}]', true, 2),
(2, 'goals_progress', 'Are you making progress toward your goals?', 'boolean', 'survey', null, true, 3),
(2, 'challenges', 'What challenges are you currently facing?', 'textarea', 'survey', null, false, 4),
(2, 'additional_support', 'What additional support do you need?', 'textarea', 'survey', null, false, 5),
(2, 'suggestions', 'Any suggestions for improvement?', 'textarea', 'feedback', null, false, 6);

-- ============================================================================
-- SEED DATA: Exit Survey Form (form_id = 3)
-- ============================================================================

INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, options, is_required, display_order) VALUES
(3, 'cch_rating', 'How would you rate CCH overall?', 'select', 'feedback', '[{"value": "Excellent", "label": "Excellent"}, {"value": "Good", "label": "Good"}, {"value": "Fair", "label": "Fair"}, {"value": "Unsatisfactory", "label": "Unsatisfactory"}]', true, 1),
(3, 'cch_like_most', 'What did you like most about CCH?', 'textarea', 'feedback', null, true, 2),
(3, 'cch_could_be_improved', 'What could be improved?', 'textarea', 'feedback', null, true, 3),
(3, 'life_skills_rating', 'How helpful were the life skills classes?', 'select', 'feedback', '[{"value": "very helpful", "label": "Very Helpful"}, {"value": "helpful", "label": "Helpful"}, {"value": "not very helpful", "label": "Not Very Helpful"}, {"value": "not helpful at all", "label": "Not Helpful At All"}]', true, 4),
(3, 'life_skills_helpful_topics', 'Which life skills topics were most helpful?', 'textarea', 'feedback', null, true, 5),
(3, 'life_skills_future_topics', 'What topics should be offered in the future?', 'textarea', 'feedback', null, false, 6),
(3, 'cm_rating', 'How helpful was your case manager?', 'select', 'feedback', '[{"value": "very helpful", "label": "Very Helpful"}, {"value": "helpful", "label": "Helpful"}, {"value": "not very helpful", "label": "Not Very Helpful"}, {"value": "not helpful at all", "label": "Not Helpful At All"}]', true, 7),
(3, 'cm_most_beneficial', 'What was most beneficial about working with your case manager?', 'textarea', 'feedback', null, true, 8),
(3, 'cm_change_about', 'What would you change about your case management experience?', 'textarea', 'feedback', null, false, 9),
(3, 'experience_takeaway', 'What is your biggest takeaway from this experience?', 'textarea', 'feedback', null, true, 10),
(3, 'experience_accomplished', 'What did you accomplish during your time here?', 'textarea', 'feedback', null, true, 11),
(3, 'additional_notes', 'Any additional comments?', 'textarea', 'feedback', null, false, 12);

-- ============================================================================
-- SEED DATA: Success Story Form (form_id = 4)
-- ============================================================================

INSERT INTO form_questions (form_id, field_key, question_text, question_type, category, is_required, display_order) VALUES
(4, 'previous_situation', 'Describe your situation before CCH', 'textarea', 'general', true, 1),
(4, 'cch_impact', 'How did CCH impact your life?', 'textarea', 'general', true, 2),
(4, 'where_now', 'Where are you now?', 'textarea', 'general', true, 3),
(4, 'tell_donors', 'What would you tell donors who support CCH?', 'textarea', 'general', true, 4),
(4, 'quote', 'A quote we can share (optional)', 'textarea', 'general', false, 5),
(4, 'consent', 'Do you consent to sharing your story?', 'boolean', 'general', true, 6);

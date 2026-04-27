-- Add question_text_spanish if not present (may have been added manually)
ALTER TABLE form_questions ADD COLUMN IF NOT EXISTS question_text_spanish VARCHAR(512);

-- Add form_id if not present
ALTER TABLE form_questions ADD COLUMN IF NOT EXISTS form_id INT;

-- Drop old unique constraint on field_key alone, then add (field_key, form_id)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'form_questions_field_key_key'
      AND conrelid = 'form_questions'::regclass
  ) THEN
    ALTER TABLE form_questions DROP CONSTRAINT form_questions_field_key_key;
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'form_questions_field_key_form_id_key'
      AND conrelid = 'form_questions'::regclass
  ) THEN
    ALTER TABLE form_questions ADD CONSTRAINT form_questions_field_key_form_id_key UNIQUE (field_key, form_id);
  END IF;
END $$;

-- Seed Add Client Form (form_id = 5)
INSERT INTO form_questions (field_key, question_text, question_type, form_id, options, is_required, is_visible, is_core, display_order) VALUES
('first_name',                      'First Name',                        'text',                 5, NULL, true,  true, true,  1),
('last_name',                       'Last Name',                         'text',                 5, NULL, true,  true, true,  2),
('status',                          'Status',                            'select',               5, '[{"value":"Active","label":"Active"},{"value":"Exited","label":"Exited"}]', true, true, true, 3),
('unit_name',                       'Unit',                              'select',               5, '[{"value":"Cy-A","label":"Cy-A"},{"value":"Cy-B","label":"Cy-B"},{"value":"Cy-C","label":"Cy-C"},{"value":"Cy-D","label":"Cy-D"},{"value":"Gl-1","label":"Gl-1"},{"value":"Gl-2","label":"Gl-2"},{"value":"Gl-3","label":"Gl-3"},{"value":"Gl-4","label":"Gl-4"},{"value":"1046","label":"1046"},{"value":"1048","label":"1048"},{"value":"1050","label":"1050"},{"value":"1052","label":"1052"},{"value":"FV","label":"FV"}]', true, true, true, 4),
('created_by',                      'Case Manager',                      'case_manager_select',  5, NULL, true,  true, true,  5),
('grant',                           'Grant',                             'text',                 5, NULL, false, true, false, 6),
('date_of_birth',                   'Birthday',                          'date',                 5, NULL, true,  true, true,  7),
('age',                             'Age',                               'number',               5, NULL, true,  true, true,  8),
('phone_number',                    'Phone Number',                      'text',                 5, NULL, true,  true, true,  9),
('email',                           'Email',                             'text',                 5, NULL, true,  true, true,  10),
('emergency_contact_name',          'Emergency Contact Name',            'text',                 5, NULL, true,  true, true,  11),
('emergency_contact_phone_number',  'Emergency Contact Phone',           'text',                 5, NULL, true,  true, true,  12),
('medical',                         'Medical',                           'boolean',              5, NULL, true,  true, true,  13),
('entrance_date',                   'Entry Date',                        'date',                 5, NULL, true,  true, true,  14),
('estimated_exit_date',             'Estimated Exit Date',               'date',                 5, NULL, true,  true, true,  15),
('exit_date',                       'Exit Date',                         'date',                 5, NULL, false, true, false, 16),
('bed_nights',                      'Bed Nights',                        'number',               5, NULL, true,  true, true,  17),
('bed_nights_children',             'Bed Nights with Children',          'number',               5, NULL, true,  true, true,  18),
('pregnant_upon_entry',             'Pregnant Upon Entry?',              'boolean',              5, NULL, true,  true, true,  19),
('disabled_children',               'Disabled Children',                 'boolean',              5, NULL, true,  true, true,  20),
('ethnicity',                       'Ethnicity',                         'select',               5, '[{"value":"Hispanic","label":"Hispanic"},{"value":"Non-Hispanic","label":"Non-Hispanic"},{"value":"Refused","label":"Refused"}]', true, true, true, 21),
('race',                            'Race',                              'select',               5, '[{"value":"Hispanic","label":"Hispanic"},{"value":"Caucasian","label":"Caucasian"},{"value":"African American","label":"African American"},{"value":"Asian","label":"Asian"},{"value":"Native American","label":"Native American"},{"value":"Pacific Islander/Hawaiian","label":"Pacific Islander/Hawaiian"},{"value":"Multi/Other","label":"Multi/Other"}]', true, true, true, 22),
('city_of_last_permanent_residence','City of Last Permanent Residence',  'text',                 5, NULL, true,  true, true,  23),
('prior_living',                    'Prior Living',                      'text',                 5, NULL, true,  true, true,  24),
('prior_living_city',               'Prior Living City',                 'text',                 5, NULL, true,  true, true,  25),
('shelter_in_last_five_years',      'Shelter in Last 5 Years',           'boolean',              5, NULL, true,  true, true,  26),
('homelessness_length',             'Length of Homelessness (months)',   'number',               5, NULL, true,  true, true,  27),
('chronically_homeless',            'Chronically Homeless',              'boolean',              5, NULL, true,  true, true,  28),
('attending_school_upon_entry',     'Attending School Upon Entry',       'boolean',              5, NULL, true,  true, true,  29),
('employement_gained',              'Employment Gained',                 'boolean',              5, NULL, true,  true, true,  30),
('reason_for_leaving',              'Reason for Leaving',                'text',                 5, NULL, false, true, false, 31),
('specific_reason_for_leaving',     'Specific Reason for Leaving',       'text',                 5, NULL, false, true, false, 32),
('specific_destination',            'Specific Destination',              'text',                 5, NULL, false, true, false, 33),
('savings_amount',                  'Savings Amount ($)',                 'number',               5, NULL, false, true, false, 34),
('attending_school_upon_exit',      'Attending School Upon Exit',        'boolean',              5, NULL, false, true, false, 35),
('reunified',                       'Reunified',                         'boolean',              5, NULL, false, true, false, 36),
('successful_completion',           'Successful Completion',             'boolean',              5, NULL, false, true, false, 37),
('destination_city',                'Destination City',                  'text',                 5, NULL, false, true, false, 38),
('comments',                        'Comments',                          'textarea',             5, NULL, false, true, false, 39)
ON CONFLICT (field_key, form_id) DO NOTHING;

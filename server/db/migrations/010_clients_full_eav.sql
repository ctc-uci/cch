-- Full EAV migration: move all client data into intake_responses (form_id=5),
-- then drop every data column from clients, leaving only id.

-- Step 1: Partial unique index so we can upsert per (client, question) for form_id=5.
CREATE UNIQUE INDEX IF NOT EXISTS intake_responses_client_question_form5_idx
  ON intake_responses (client_id, question_id)
  WHERE form_id = 5 AND client_id IS NOT NULL;

-- Step 2: For each existing client that has no form_id=5 responses yet,
-- migrate its column values into intake_responses.
DO $$
DECLARE
  client_rec RECORD;
  session_uuid UUID;
BEGIN
  FOR client_rec IN SELECT * FROM clients LOOP
    IF NOT EXISTS (
      SELECT 1 FROM intake_responses
      WHERE client_id = client_rec.id AND form_id = 5
    ) THEN
      SELECT uuid_generate_v4() INTO session_uuid;

      INSERT INTO intake_responses (client_id, question_id, response_value, session_id, form_id)
      SELECT client_rec.id, fq.id, fv.field_value, session_uuid, 5
      FROM (VALUES
        ('created_by',                      client_rec.created_by::text),
        ('unit_name',                        client_rec.unit_name),
        ('first_name',                       client_rec.first_name),
        ('last_name',                        client_rec.last_name),
        ('status',                           client_rec.status::text),
        ('grant',                            client_rec.grant),
        ('date_of_birth',                    client_rec.date_of_birth::text),
        ('age',                              client_rec.age::text),
        ('phone_number',                     client_rec.phone_number),
        ('email',                            client_rec.email),
        ('emergency_contact_name',           client_rec.emergency_contact_name),
        ('emergency_contact_phone_number',   client_rec.emergency_contact_phone_number),
        ('medical',                          client_rec.medical::text),
        ('entrance_date',                    client_rec.entrance_date::text),
        ('estimated_exit_date',              client_rec.estimated_exit_date::text),
        ('exit_date',                        client_rec.exit_date::text),
        ('bed_nights',                       client_rec.bed_nights::text),
        ('bed_nights_children',              client_rec.bed_nights_children::text),
        ('pregnant_upon_entry',              client_rec.pregnant_upon_entry::text),
        ('disabled_children',               client_rec.disabled_children::text),
        ('ethnicity',                        client_rec.ethnicity::text),
        ('race',                             client_rec.race::text),
        ('city_of_last_permanent_residence', client_rec.city_of_last_permanent_residence),
        ('prior_living',                     client_rec.prior_living),
        ('prior_living_city',                client_rec.prior_living_city),
        ('shelter_in_last_five_years',       client_rec.shelter_in_last_five_years::text),
        ('homelessness_length',              client_rec.homelessness_length::text),
        ('chronically_homeless',             client_rec.chronically_homeless::text),
        ('attending_school_upon_entry',      client_rec.attending_school_upon_entry::text),
        ('employement_gained',               client_rec.employement_gained::text),
        ('reason_for_leaving',               client_rec.reason_for_leaving),
        ('specific_reason_for_leaving',      client_rec.specific_reason_for_leaving),
        ('specific_destination',             client_rec.specific_destination),
        ('savings_amount',                   client_rec.savings_amount::text),
        ('attending_school_upon_exit',       client_rec.attending_school_upon_exit::text),
        ('reunified',                        client_rec.reunified::text),
        ('successful_completion',            client_rec.successful_completion::text),
        ('destination_city',                 client_rec.destination_city),
        ('comments',                         client_rec.comments)
      ) AS fv(field_key, field_value)
      JOIN form_questions fq ON fq.field_key = fv.field_key AND fq.form_id = 5
      WHERE fv.field_value IS NOT NULL AND fv.field_value != '';
    END IF;
  END LOOP;
END $$;

-- Step 3: Drop all data columns — only id and created_at remain.
ALTER TABLE clients
  DROP COLUMN IF EXISTS created_by,
  DROP COLUMN IF EXISTS unit_name,
  DROP COLUMN IF EXISTS "grant",
  DROP COLUMN IF EXISTS "status",
  DROP COLUMN IF EXISTS first_name,
  DROP COLUMN IF EXISTS last_name,
  DROP COLUMN IF EXISTS date_of_birth,
  DROP COLUMN IF EXISTS age,
  DROP COLUMN IF EXISTS phone_number,
  DROP COLUMN IF EXISTS email,
  DROP COLUMN IF EXISTS emergency_contact_name,
  DROP COLUMN IF EXISTS emergency_contact_phone_number,
  DROP COLUMN IF EXISTS medical,
  DROP COLUMN IF EXISTS entrance_date,
  DROP COLUMN IF EXISTS estimated_exit_date,
  DROP COLUMN IF EXISTS exit_date,
  DROP COLUMN IF EXISTS bed_nights,
  DROP COLUMN IF EXISTS bed_nights_children,
  DROP COLUMN IF EXISTS pregnant_upon_entry,
  DROP COLUMN IF EXISTS disabled_children,
  DROP COLUMN IF EXISTS ethnicity,
  DROP COLUMN IF EXISTS race,
  DROP COLUMN IF EXISTS city_of_last_permanent_residence,
  DROP COLUMN IF EXISTS prior_living,
  DROP COLUMN IF EXISTS prior_living_city,
  DROP COLUMN IF EXISTS shelter_in_last_five_years,
  DROP COLUMN IF EXISTS homelessness_length,
  DROP COLUMN IF EXISTS chronically_homeless,
  DROP COLUMN IF EXISTS attending_school_upon_entry,
  DROP COLUMN IF EXISTS employement_gained,
  DROP COLUMN IF EXISTS reason_for_leaving,
  DROP COLUMN IF EXISTS specific_reason_for_leaving,
  DROP COLUMN IF EXISTS specific_destination,
  DROP COLUMN IF EXISTS savings_amount,
  DROP COLUMN IF EXISTS attending_school_upon_exit,
  DROP COLUMN IF EXISTS reunified,
  DROP COLUMN IF EXISTS successful_completion,
  DROP COLUMN IF EXISTS destination_city,
  DROP COLUMN IF EXISTS comments;

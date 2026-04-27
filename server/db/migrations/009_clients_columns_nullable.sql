-- Make non-essential clients columns nullable so the add-client flow can
-- store detailed data in intake_responses instead of directly in clients columns.
-- Core identity columns (first_name, last_name, status, unit_name, created_by) stay NOT NULL.

ALTER TABLE clients
  ALTER COLUMN date_of_birth            DROP NOT NULL,
  ALTER COLUMN age                       DROP NOT NULL,
  ALTER COLUMN phone_number              DROP NOT NULL,
  ALTER COLUMN email                     DROP NOT NULL,
  ALTER COLUMN emergency_contact_name    DROP NOT NULL,
  ALTER COLUMN emergency_contact_phone_number DROP NOT NULL,
  ALTER COLUMN medical                   DROP NOT NULL,
  ALTER COLUMN entrance_date             DROP NOT NULL,
  ALTER COLUMN estimated_exit_date       DROP NOT NULL,
  ALTER COLUMN bed_nights                DROP NOT NULL,
  ALTER COLUMN bed_nights_children       DROP NOT NULL,
  ALTER COLUMN pregnant_upon_entry       DROP NOT NULL,
  ALTER COLUMN disabled_children         DROP NOT NULL,
  ALTER COLUMN ethnicity                 DROP NOT NULL,
  ALTER COLUMN race                      DROP NOT NULL,
  ALTER COLUMN city_of_last_permanent_residence DROP NOT NULL,
  ALTER COLUMN prior_living              DROP NOT NULL,
  ALTER COLUMN prior_living_city         DROP NOT NULL,
  ALTER COLUMN shelter_in_last_five_years DROP NOT NULL,
  ALTER COLUMN homelessness_length       DROP NOT NULL,
  ALTER COLUMN chronically_homeless      DROP NOT NULL,
  ALTER COLUMN attending_school_upon_entry DROP NOT NULL,
  ALTER COLUMN employement_gained        DROP NOT NULL;

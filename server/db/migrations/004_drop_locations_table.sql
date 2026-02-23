-- Deprecate and drop locations table. Case manager location is now case_managers.location.
-- Drop all foreign keys that reference locations, then drop the table.
-- After this migration, case manager delete no longer needs to touch locations (table is gone).

-- units: drop FK and allow location_id to be null (column becomes unused/orphaned)
ALTER TABLE units
  DROP CONSTRAINT IF EXISTS units_location_id_fkey;
ALTER TABLE units
  ALTER COLUMN location_id DROP NOT NULL;

-- exit_survey: drop FK to locations (site column keeps existing values as orphan ids)
ALTER TABLE exit_survey
  DROP CONSTRAINT IF EXISTS exit_survey_site_fkey;
ALTER TABLE exit_survey
  ALTER COLUMN site DROP NOT NULL;

-- intake_exit_survey: same
ALTER TABLE intake_exit_survey
  DROP CONSTRAINT IF EXISTS intake_exit_survey_site_fkey;
ALTER TABLE intake_exit_survey
  ALTER COLUMN site DROP NOT NULL;

-- intake_success_story: site already nullable
ALTER TABLE intake_success_story
  DROP CONSTRAINT IF EXISTS intake_success_story_site_fkey;

-- -- Drop the deprecated table
-- DROP TABLE IF EXISTS locations;

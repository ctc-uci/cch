-- Change intake_clients.unit_id from INT to unit_name VARCHAR (drops FK to units(id))
ALTER TABLE intake_clients
  DROP CONSTRAINT IF EXISTS intake_clients_unit_id_fkey;

ALTER TABLE intake_clients
  ALTER COLUMN unit_id TYPE VARCHAR(256) USING unit_id::text;

ALTER TABLE intake_clients
  RENAME COLUMN unit_id TO unit_name;
  
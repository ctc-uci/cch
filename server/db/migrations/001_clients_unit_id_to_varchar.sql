-- Change clients.unit_id from INT to VARCHAR (drops FK to units(id))
ALTER TABLE clients
  DROP CONSTRAINT IF EXISTS clients_unit_id_fkey;

ALTER TABLE clients
  ALTER COLUMN unit_id TYPE VARCHAR(256) USING unit_id::text;

ALTER TABLE clients
  RENAME COLUMN unit_id TO unit_name;

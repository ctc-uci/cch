-- Make grant optional for add client
ALTER TABLE clients
  ALTER COLUMN "grant" DROP NOT NULL;

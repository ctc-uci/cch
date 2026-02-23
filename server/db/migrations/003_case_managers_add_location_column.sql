-- Add location text column to case_managers (replaces use of locations table for CM assignment)
ALTER TABLE case_managers
  ADD COLUMN IF NOT EXISTS location VARCHAR(128);

-- Backfill from first location per case manager (if locations table has data)
UPDATE case_managers cm
SET location = sub.name
FROM (
  SELECT DISTINCT ON (cm_id) cm_id, name
  FROM locations
  ORDER BY cm_id, id
) sub
WHERE cm.id = sub.cm_id AND (cm.location IS NULL OR cm.location = '');

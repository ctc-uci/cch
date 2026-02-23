-- Fix last_updated: store Pacific local time (America/Los_Angeles) so DST is respected
CREATE OR REPLACE FUNCTION update_last_updated_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO last_updated (table_name, last_updated_at)
    VALUES (TG_TABLE_NAME, CURRENT_TIMESTAMP AT TIME ZONE 'America/Los_Angeles')
    ON CONFLICT (table_name)
    DO UPDATE SET last_updated_at = CURRENT_TIMESTAMP AT TIME ZONE 'America/Los_Angeles';
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

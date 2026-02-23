DROP TABLE IF EXISTS last_updated;

CREATE TABLE last_updated(
	table_name VARCHAR(64) NOT NULL PRIMARY KEY,
    last_updated_at TIMESTAMP NOT NULL,
);

-- create the function that will update the specified last updated table
-- Store Pacific local time (America/Los_Angeles) so DST is respected; client displays as-is in local context
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

-- last updated trigger for clients
CREATE TRIGGER update_clients_last_updated
AFTER INSERT OR UPDATE OR DELETE ON clients
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

-- last updated trigger for donations
CREATE TRIGGER update_donations_last_updated
AFTER INSERT OR UPDATE OR DELETE ON donations
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

-- last updated trigger for volunteers
CREATE TRIGGER update_volunteers_last_updated
AFTER INSERT OR UPDATE OR DELETE ON volunteers
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

-- last updated trigger for cm_monthly_stats
CREATE TRIGGER update_cm_monthly_stats_last_updated
AFTER INSERT OR UPDATE OR DELETE ON cm_monthly_stats
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

-- last updated trigger for initial_interview
CREATE TRIGGER update_initial_interview_last_updated
AFTER INSERT OR UPDATE OR DELETE ON initial_interview
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

-- last updated trigger for front_desk_monthly
CREATE TRIGGER update_front_desk_monthly_last_updated
AFTER INSERT OR UPDATE OR DELETE ON front_desk_monthly
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

-- last updated trigger for case_managers
CREATE TRIGGER update_case_managers_last_updated
AFTER INSERT OR UPDATE OR DELETE ON case_managers
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

CREATE TRIGGER update_screener_comment_last_updated
AFTER INSERT OR UPDATE OR DELETE ON screener_comment
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

CREATE TRIGGER update_success_story_last_updated
AFTER INSERT OR UPDATE OR DELETE ON success_story
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

CREATE TRIGGER update_exit_survey_last_updated
AFTER INSERT OR UPDATE OR DELETE ON exit_survey
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();

CREATE TRIGGER update_random_survey_table_last_updated
AFTER INSERT OR UPDATE OR DELETE ON random_survey_table
FOR EACH STATEMENT
EXECUTE FUNCTION update_last_updated_timestamp();
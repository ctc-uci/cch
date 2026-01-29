DROP TABLE IF EXISTS screener_comment_table CASCADE;

CREATE TABLE screener_comment (
    id SERIAL PRIMARY KEY NOT NULL,
    -- Legacy reference to initial_interview; kept for backwards compatibility
    -- but no longer enforced as a foreign key. New records should instead use
    -- session_id to associate with dynamic initial interview forms stored in
    -- intake_responses.
    initial_interview_id int,
    -- New association to dynamic intake_responses submissions. This links a
    -- screener comment to a specific intake_responses.session_id.
    session_id uuid,
    cm_id int NOT NULL,
    willingness int NOT NULL,
    employability int NOT NULL,
    attitude int NOT NULL,
    length_of_sobriety int NOT NULL,
    completed_tx boolean NOT NULL,
    drug_test_results varchar(256),
    homeless_episode_one varchar(1024),
    homeless_episode_two varchar(1024),
    homeless_episode_three varchar(1024),
    homeless_episode_four varchar(1024),
    disabling_condition varchar(256),
    employed boolean,
    driver_license varchar(16),
    num_of_children int,
    children_in_custody int,
    last_city_perm_residence varchar(32),
    decision boolean,
    additional_comments varchar(1024),
    FOREIGN KEY(cm_id) REFERENCES case_managers(id)
);

-- Index to efficiently look up screener comments by associated session_id
CREATE INDEX IF NOT EXISTS idx_screener_comment_session
ON screener_comment(session_id);


DROP TABLE IF EXISTS intake_exit_survey CASCADE;

-- Exit survey table for intake_clients (mirrors exit_survey table structure)
-- Separate from original exit_survey table for safe rollback
-- Note: Uses existing ENUMs (rating, rating_help) from exit_survey.sql
CREATE TABLE intake_exit_survey (
    id SERIAL PRIMARY KEY,
    cm_id INT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    name VARCHAR(64) NOT NULL,
    client_id INT NOT NULL,
    site INT NOT NULL,
    program_date_completion DATE NOT NULL,
    cch_rating rating NOT NULL,
    cch_like_most VARCHAR(2048) NOT NULL,
    life_skills_rating rating_help NOT NULL,
    life_skills_helpful_topics VARCHAR(2048) NOT NULL,
    life_skills_offer_topics_in_the_future VARCHAR(2048) NOT NULL,
    cm_rating rating_help NOT NULL,
    cm_change_about VARCHAR(2048) NOT NULL,
    cm_most_beneficial VARCHAR(2048) NOT NULL,
    cch_could_be_improved VARCHAR(2048) NOT NULL,
    experience_takeaway VARCHAR(2048) NOT NULL,
    experience_accomplished VARCHAR(2048) NOT NULL,
    experience_extra_notes VARCHAR(2048),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(cm_id) REFERENCES case_managers(id),
    FOREIGN KEY(client_id) REFERENCES intake_clients(id) ON DELETE CASCADE,
    FOREIGN KEY(site) REFERENCES locations(id)
);

-- Create indexes for common queries
CREATE INDEX idx_intake_exit_survey_client ON intake_exit_survey(client_id);
CREATE INDEX idx_intake_exit_survey_cm ON intake_exit_survey(cm_id);
CREATE INDEX idx_intake_exit_survey_site ON intake_exit_survey(site);


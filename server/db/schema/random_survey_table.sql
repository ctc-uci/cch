CREATE TABLE random_survey_table (
    id SERIAL PRIMARY KEY NOT NULL,    
    date DATE NOT NULL,
    cch_qos integer NOT NULL,
    cm_qos integer NOT NULL,
    courteous boolean NOT NULL,
    informative boolean NOT NULL,
    prompt_and_helpful boolean NOT NULL,
    entry_quality integer NOT NULL,
    unit_quality integer NOT NULL,
    clean integer NOT NULL,
    overall_experience integer NOT NULL,
    case_meeting_frequency varchar(30) NOT NULL,
    lifeskills boolean NOT NULL,
    recommend boolean NOT NULL,
    recommend_reasoning varchar(2048) NOT NULL,
    make_cch_more_helpful varchar(2048) NOT NULL,
    cm_id INT NOT NULL,
    cm_feedback varchar(2048) NOT NULL,
    other_comments varchar(2048),

    FOREIGN KEY(cm_id) REFERENCES case_manager(id)
);

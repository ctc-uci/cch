DROP TABLE IF EXISTS screener_comment_table CASCADE;
CREATE TABLE screener_comment (
    id SERIAL PRIMARY KEY NOT NULL,
    initial_interview_id int NOT NULL,
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
    additional_comments varchar(1024)
    FOREIGN KEY(cm_id) REFERENCES case_manager(id)
    FOREIGN KEY(initial_interview_id) REFERENCES initial_interview(id)
);

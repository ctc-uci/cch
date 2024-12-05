CREATE TYPE rating AS ENUM ('Excellent', 'Good', 'Fair', 'Unsatisfactory');
CREATE TYPE rating_help as ENUM('very helpful', 'helpful', 'not very helpful', 'not helpful at all');


CREATE TABLE exit_survey (
    id SERIAL PRIMARY KEY,
    cm_id INT NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "site" INT NOT NULL,
    program_date_completion DATE NOT NULL,
    cch_rating rating NOT NULL,
    cch_like_most VARCHAR(2048) NOT NULL,
    life_skills_rating rating_help NOT NULL,
    life_skills_helpful_topics VARCHAR(2048) NOT NULL,
    life_skills_offer_topics_in_the_future VARCHAR(2048) NOT NULL,
    cm_rating rating_help NOT NULL,
    cm_change_about VARCHAR(2048) NOT NULL,
    cm_most_beneficial VARCHAR(2048) NOT NULL,
    experience_takeaway VARCHAR(2048) NOT NULL,
    experience_accomplished VARCHAR(2048) NOT NULL,
    experience_extra_notes VARCHAR(2048) NOT NULL,
	
    FOREIGN KEY(cm_id) REFERENCES case_managers(id),
    FOREIGN KEY("site") REFERENCES locations(id)
);

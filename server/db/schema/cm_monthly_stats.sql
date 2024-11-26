
DROP TABLE IF EXISTS cm_monthly_stats;

CREATE TABLE IF NOT EXISTS cm_monthly_stats(
	id SERIAL PRIMARY KEY,
	date DATE,
	cm_id VARCHAR(256) REFERENCES case_managers(id),
	babies_born INT,
	enrolled_in_school INT,
	earned_degree INT,
	earned_drivers_license INT,
	reunified_with_children INT,
	womens_birthdays INT,
	childrens_birthdays INT,
	birthday_gift_card_values INT,
	food_card_values INT,
	bus_passes INT,
	gas_cards_values INT,
	phone_contacts INT,
	inperson_contacts INT,
	email_contacts INT,
	interviews_scheduled INT,
	interviews_conducted INT,
	positive_tests INT,
	no_call_no_shows INT,
	other INT
);



DROP TABLE IF EXISTS cm_monthly_stats;

CREATE TABLE IF NOT EXISTS cm_monthly_stats(
	id SERIAL PRIMARY KEY,
	date DATE NOT NULL,
	cm_id VARCHAR(256) NOT NULL,
	babies_born INT NOT NULL,
	enrolled_in_school INT NOT NULL,
	earned_degree INT NOT NULL,
	earned_drivers_license INT NOT NULL,
	reunified_with_children INT NOT NULL,
	womens_birthdays INT NOT NULL,
	childrens_birthdays INT NOT NULL,
	birthday_gift_card_values INT NOT NULL,
	food_card_values INT NOT NULL,
	bus_passes INT NOT NULL,
	gas_cards_value INT NOT NULL,
	phone_contacts INT NOT NULL,
	inperson_contacts INT NOT NULL,
	email_contacts INT NOT NULL,
	interviews_scheduled INT NOT NULL,
	interviews_conducted INT NOT NULL,
	positive_tests INT NOT NULL,
	no_call_no_shows INT NOT NULL,
	other INT NOT NULL

	FOREIGN KEY(cm_id) REFERENCES case_managers(id)
);



DROP TABLE IF EXISTS cm_monthly_stats;

CREATE TABLE IF NOT EXISTS cm_monthly_stats(
	id SERIAL PRIMARY KEY,
	date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
	cm_id INT NOT NULL,
	total_number_of_contacts int NOT NULL,
  women_birthdays int NOT NULL,
  kid_birthdays int NOT NULL,
  birthday_cards int NOT NULL,
  birthday_cards_value numeric NOT NULL,
  food_cards int NOT NULL,
  food_cards_value numeric NOT NULL,
  bus_passes int NOT NULL,
  bus_passes_value numeric NOT NULL,
  gas_cards int NOT NULL,
  gas_cards_value numeric NOT NULL,
  women_healthcare_referrals int NOT NULL,
  kid_healthcare_referrals int NOT NULL,
  women_counseling_referrals int NOT NULL,
  kid_counseling_referrals int NOT NULL,
  babies_born int NOT NULL,
  women_degrees_earned int NOT NULL,
  women_enrolled_in_school int NOT NULL,
  women_licenses_earned int NOT NULL,
  reunifications int NOT NULL,
  number_of_interviews_conducted int NOT NULL,
  number_of_positive_tests int NOT NULL,
  number_of_ncns int NOT NULL,
  number_of_others int NOT NULL,
  number_of_interviews_accpeted int NOT NULL,
	FOREIGN KEY(cm_id) REFERENCES case_managers(id)
);


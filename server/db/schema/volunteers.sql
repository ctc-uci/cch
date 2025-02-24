DROP TABLE IF EXISTS volunteers;
DROP TYPE IF EXISTS type_of_event;
CREATE TYPE type_of_event AS ENUM ('Easter', 'Thanksgiving', 'Gala', 'Christmas', 'Office', 'Other');

CREATE TABLE volunteers(
  id SERIAL NOT NULL PRIMARY KEY,
  first_name VARCHAR(16) NOT NULL,
  last_name VARCHAR(16) NOT NULL,
  email VARCHAR(32) NOT NULL,
  event_type type_of_event NOT NULL,
  date DATE NOT NULL,
  hours numeric NOT NULL,
  value numeric NOT NULL
);

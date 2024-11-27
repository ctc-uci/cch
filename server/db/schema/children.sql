CREATE TABLE IF NOT EXISTS public.children (
    first_name VARCHAR(16) NOT NULL,
    last_name VARCHAR(16) NOT NULL,
    id INT PRIMARY KEY,
    parent_id INT NOT NULL,
    date_of_birth DATE NOT NULL,
    reunified BOOL NOT NULL,
    FOREIGN KEY (parent_id) REFERENCES public.clients(id)
);
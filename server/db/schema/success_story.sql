CREATE TABLE IF NOT EXISTS public.success_story (
    id INT PRIMARY KEY,
    date DATE NOT NULL,
    client_id INT NOT NULL,
    cm_id INT NOT NULL,
    previous_situation VARCHAR(2048) NOT NULL,
    cch_impact VARCHAR(2048) NOT NULL,
    where_now VARCHAR(2048) NOT NULL,
    tell_donors VARCHAR(2048) NOT NULL,
    quote VARCHAR(2048) NOT NULL,
    consent BOOLEAN NOT NULL,

    FOREIGN KEY(client_id) REFERENCES public.clients(id),
    FOREIGN KEY(cm_id) REFERENCES public.case_managers(id)
);
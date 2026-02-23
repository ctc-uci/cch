-- Deprecate and drop units table. Client unit is now clients.unit_name (VARCHAR).
-- No remaining FKs reference units (clients and intake_clients use unit_name).

DROP TABLE IF EXISTS units;

-- Remove the enum type used only by units (optional cleanup)
DROP TYPE IF EXISTS type;

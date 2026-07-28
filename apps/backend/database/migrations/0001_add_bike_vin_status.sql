ALTER TABLE bikes
    ADD COLUMN vin VARCHAR(17) AFTER year,
    ADD COLUMN status ENUM('active', 'ready', 'maintenance') NOT NULL DEFAULT 'active' AFTER vin;

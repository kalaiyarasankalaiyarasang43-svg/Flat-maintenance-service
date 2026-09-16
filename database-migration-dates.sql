-- Run this once against an existing Flat Maintenance database.
ALTER TABLE service_requests ADD COLUMN preferred_date DATE NULL AFTER service_id;
ALTER TABLE complaints ADD COLUMN complaint_date DATE NULL AFTER subject;

-- Existing records have no user-selected date. Keep them readable until they are updated.
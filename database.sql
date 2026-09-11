-- ============================================================
-- FLAT MAINTENANCE SERVICE - DATABASE SCHEMA
-- ============================================================

CREATE DATABASE IF NOT EXISTS flat_maintenance;
USE flat_maintenance;

-- ---------------------------
-- USERS (Residents)
-- ---------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------
-- WORKERS
-- ---------------------------
CREATE TABLE workers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NOT NULL,
    password VARCHAR(255) NOT NULL,
    specialization VARCHAR(50) NOT NULL, -- Water / Electricity / Painting / Mason
    status ENUM('Available','Busy') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------
-- ADMINS
-- ---------------------------
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- ---------------------------
-- FLATS
-- ---------------------------
CREATE TABLE flats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flat_number VARCHAR(20) NOT NULL,
    floor_number VARCHAR(10) NOT NULL,
    block_name VARCHAR(50) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------
-- SERVICES (master list)
-- ---------------------------
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO services (name, description) VALUES
('Water Service', 'Plumbing, leakage, water supply issues'),
('Electricity Service', 'Wiring, switches, power issues'),
('Painting Service', 'Wall painting and touch-ups'),
('Mason Service', 'Civil / masonry repair work');

-- ---------------------------
-- SERVICE REQUESTS
-- ---------------------------
CREATE TABLE service_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    flat_id INT NOT NULL,
    service_id INT NOT NULL,
    description TEXT,
    worker_id INT DEFAULT NULL,
    status ENUM('Pending','Assigned','In Progress','Completed') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (flat_id) REFERENCES flats(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (worker_id) REFERENCES workers(id) ON DELETE SET NULL
);

-- ---------------------------
-- COMPLAINTS
-- ---------------------------
CREATE TABLE complaints (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('Open','Resolved') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ---------------------------
-- DEFAULT ADMIN LOGIN
-- Email: admin@flatcare.com | Password: admin123
-- ---------------------------
INSERT INTO admins (name, email, password) VALUES
('Super Admin', 'admin@flatcare.com', '$2b$12$6YJ9sXhNifnVDCdSBu.jB.309yqmmNQbqZtKdptWBYk3sRW2UkB7O');

-- ---------------------------
-- SAMPLE WORKERS (password for all = worker123)
-- ---------------------------
INSERT INTO workers (name, email, phone, password, specialization) VALUES
('Ravi Kumar', 'ravi.water@flatcare.com', '9000000001', '$2b$12$GLC8i/h0CIft6kLcopUwvelxM6rN0wPfxNWugaoxpFPLNvDNioXKm', 'Water Service'),
('Suresh M', 'suresh.elec@flatcare.com', '9000000002', '$2b$12$GLC8i/h0CIft6kLcopUwvelxM6rN0wPfxNWugaoxpFPLNvDNioXKm', 'Electricity Service'),
('Anitha P', 'anitha.paint@flatcare.com', '9000000003', '$2b$12$GLC8i/h0CIft6kLcopUwvelxM6rN0wPfxNWugaoxpFPLNvDNioXKm', 'Painting Service'),
('Murugan S', 'murugan.mason@flatcare.com', '9000000004', '$2b$12$GLC8i/h0CIft6kLcopUwvelxM6rN0wPfxNWugaoxpFPLNvDNioXKm', 'Mason Service');

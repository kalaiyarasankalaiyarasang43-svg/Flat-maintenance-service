<?php
// ============================================================
// DATABASE CONFIGURATION
// Update these values to match your local / server MySQL setup
// ============================================================
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'flat_maintenance');

$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}

// Start session everywhere config.php is included
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

date_default_timezone_set('Asia/Kolkata');

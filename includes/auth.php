<?php
// ============================================================
// AUTH HELPERS — role-based access guards
// Include this AFTER config.php
// ============================================================

function require_user() {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'user') {
        header("Location: /login.php");
        exit;
    }
}

function require_worker() {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'worker') {
        header("Location: /login.php");
        exit;
    }
}

function require_admin() {
    if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        header("Location: /login.php");
        exit;
    }
}

function current_id() {
    return $_SESSION['id'] ?? null;
}

function current_name() {
    return $_SESSION['name'] ?? '';
}

function e($str) {
    return htmlspecialchars($str ?? '', ENT_QUOTES, 'UTF-8');
}

function status_badge($status) {
    $map = [
        'Pending'     => 'secondary',
        'Assigned'    => 'info',
        'In Progress' => 'warning',
        'Completed'   => 'success',
        'Open'        => 'danger',
        'Resolved'    => 'success',
    ];
    $color = $map[$status] ?? 'secondary';
    return "<span class=\"badge bg-$color\">" . e($status) . "</span>";
}

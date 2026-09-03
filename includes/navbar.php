<?php
$role = $_SESSION['role'] ?? null;
?>
<nav class="navbar navbar-expand-lg navbar-dark" style="background:#1e3a5f;">
  <div class="container">
    <a class="navbar-brand fw-bold" href="/index.php">🏢 FlatCare Maintenance</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="nav">
      <ul class="navbar-nav ms-auto align-items-lg-center">
        <?php if ($role === 'user'): ?>
          <li class="nav-item"><a class="nav-link" href="/user/dashboard.php">Dashboard</a></li>
          <li class="nav-item"><a class="nav-link" href="/user/flat_details.php">My Flats</a></li>
          <li class="nav-item"><a class="nav-link" href="/user/book_service.php">Book Service</a></li>
          <li class="nav-item"><a class="nav-link" href="/user/track_status.php">Track Status</a></li>
          <li class="nav-item"><a class="nav-link" href="/user/complaint.php">Complaints</a></li>
          <li class="nav-item"><span class="nav-link text-warning">Hi, <?= e(current_name()) ?></span></li>
          <li class="nav-item"><a class="nav-link" href="/logout.php">Logout</a></li>
        <?php elseif ($role === 'worker'): ?>
          <li class="nav-item"><a class="nav-link" href="/worker/dashboard.php">My Work</a></li>
          <li class="nav-item"><span class="nav-link text-warning">Hi, <?= e(current_name()) ?></span></li>
          <li class="nav-item"><a class="nav-link" href="/logout.php">Logout</a></li>
        <?php elseif ($role === 'admin'): ?>
          <li class="nav-item"><a class="nav-link" href="/admin/dashboard.php">Requests</a></li>
          <li class="nav-item"><a class="nav-link" href="/admin/manage_workers.php">Workers</a></li>
          <li class="nav-item"><a class="nav-link" href="/admin/manage_services.php">Services</a></li>
          <li class="nav-item"><a class="nav-link" href="/admin/complaints.php">Complaints</a></li>
          <li class="nav-item"><span class="nav-link text-warning">Hi, <?= e(current_name()) ?></span></li>
          <li class="nav-item"><a class="nav-link" href="/logout.php">Logout</a></li>
        <?php else: ?>
          <li class="nav-item"><a class="nav-link" href="/login.php">Login</a></li>
          <li class="nav-item"><a class="nav-link" href="/register.php">Register</a></li>
        <?php endif; ?>
      </ul>
    </div>
  </div>
</nav>

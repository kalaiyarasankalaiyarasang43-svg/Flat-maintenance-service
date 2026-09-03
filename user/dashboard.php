<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_user();

$uid = current_id();

$flats = $conn->query("SELECT COUNT(*) c FROM flats WHERE user_id=$uid")->fetch_assoc()['c'];
$pending = $conn->query("SELECT COUNT(*) c FROM service_requests WHERE user_id=$uid AND status='Pending'")->fetch_assoc()['c'];
$inprogress = $conn->query("SELECT COUNT(*) c FROM service_requests WHERE user_id=$uid AND status IN ('Assigned','In Progress')")->fetch_assoc()['c'];
$completed = $conn->query("SELECT COUNT(*) c FROM service_requests WHERE user_id=$uid AND status='Completed'")->fetch_assoc()['c'];

$recent = $conn->query("
  SELECT sr.*, s.name AS service_name, f.flat_number
  FROM service_requests sr
  JOIN services s ON s.id = sr.service_id
  JOIN flats f ON f.id = sr.flat_id
  WHERE sr.user_id = $uid
  ORDER BY sr.created_at DESC LIMIT 5
");

$page_title = "Dashboard";
include __DIR__ . '/../includes/header.php';
?>

<h4 class="mb-4">Welcome, <?= e(current_name()) ?> 👋</h4>

<div class="row g-3 mb-4">
  <div class="col-md-3 col-6">
    <div class="stat-box" style="background:#1e3a5f;"><h3><?= $flats ?></h3><small>My Flats</small></div>
  </div>
  <div class="col-md-3 col-6">
    <div class="stat-box" style="background:#6c757d;"><h3><?= $pending ?></h3><small>Pending Requests</small></div>
  </div>
  <div class="col-md-3 col-6">
    <div class="stat-box" style="background:#e0a800;"><h3><?= $inprogress ?></h3><small>In Progress</small></div>
  </div>
  <div class="col-md-3 col-6">
    <div class="stat-box" style="background:#198754;"><h3><?= $completed ?></h3><small>Completed</small></div>
  </div>
</div>

<div class="row g-3 mb-4">
  <div class="col-md-3 col-6"><a href="/user/flat_details.php" class="btn btn-outline-primary w-100 py-3"><i class="fa-solid fa-building me-2"></i>Manage Flats</a></div>
  <div class="col-md-3 col-6"><a href="/user/book_service.php" class="btn btn-primary w-100 py-3"><i class="fa-solid fa-plus me-2"></i>Book Service</a></div>
  <div class="col-md-3 col-6"><a href="/user/track_status.php" class="btn btn-outline-primary w-100 py-3"><i class="fa-solid fa-magnifying-glass me-2"></i>Track Status</a></div>
  <div class="col-md-3 col-6"><a href="/user/complaint.php" class="btn btn-outline-danger w-100 py-3"><i class="fa-solid fa-triangle-exclamation me-2"></i>Raise Complaint</a></div>
</div>

<div class="card p-3">
  <h6 class="mb-3">Recent Service Requests</h6>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead><tr><th>Flat</th><th>Service</th><th>Description</th><th>Status</th><th>Requested On</th></tr></thead>
      <tbody>
        <?php if ($recent->num_rows === 0): ?>
          <tr><td colspan="5" class="text-center text-muted py-3">No service requests yet.</td></tr>
        <?php endif; ?>
        <?php while ($r = $recent->fetch_assoc()): ?>
          <tr>
            <td><?= e($r['flat_number']) ?></td>
            <td><?= e($r['service_name']) ?></td>
            <td><?= e(mb_strimwidth($r['description'], 0, 40, '...')) ?></td>
            <td><?= status_badge($r['status']) ?></td>
            <td><?= e(date('d M Y', strtotime($r['created_at']))) ?></td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

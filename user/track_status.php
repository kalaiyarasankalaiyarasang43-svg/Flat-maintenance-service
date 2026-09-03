<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_user();
$uid = current_id();

$requests = $conn->query("
  SELECT sr.*, s.name AS service_name, f.flat_number, f.block_name, w.name AS worker_name, w.phone AS worker_phone
  FROM service_requests sr
  JOIN services s ON s.id = sr.service_id
  JOIN flats f ON f.id = sr.flat_id
  LEFT JOIN workers w ON w.id = sr.worker_id
  WHERE sr.user_id = $uid
  ORDER BY sr.created_at DESC
");

$page_title = "Track Status";
include __DIR__ . '/../includes/header.php';
?>

<div class="card p-3">
  <h5 class="mb-3">My Service Requests</h5>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead>
        <tr>
          <th>#</th><th>Flat</th><th>Service</th><th>Description</th>
          <th>Assigned Worker</th><th>Status</th><th>Requested On</th>
        </tr>
      </thead>
      <tbody>
        <?php if ($requests->num_rows === 0): ?>
          <tr><td colspan="7" class="text-center text-muted py-3">No service requests found.</td></tr>
        <?php endif; ?>
        <?php while ($r = $requests->fetch_assoc()): ?>
          <tr>
            <td>#<?= $r['id'] ?></td>
            <td><?= e($r['block_name']) ?> - <?= e($r['flat_number']) ?></td>
            <td><?= e($r['service_name']) ?></td>
            <td><?= e(mb_strimwidth($r['description'], 0, 50, '...')) ?></td>
            <td><?= $r['worker_name'] ? e($r['worker_name']) . '<br><small class="text-muted">' . e($r['worker_phone']) . '</small>' : '<span class="text-muted">Not yet assigned</span>' ?></td>
            <td><?= status_badge($r['status']) ?></td>
            <td><?= e(date('d M Y, h:i A', strtotime($r['created_at']))) ?></td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</div>

<div class="card p-3 mt-4">
  <h6 class="mb-3">Status Flow</h6>
  <div class="d-flex flex-wrap gap-2 align-items-center">
    <span class="badge bg-secondary p-2">Pending</span> <i class="fa-solid fa-arrow-right"></i>
    <span class="badge bg-info p-2">Assigned</span> <i class="fa-solid fa-arrow-right"></i>
    <span class="badge bg-warning p-2">In Progress</span> <i class="fa-solid fa-arrow-right"></i>
    <span class="badge bg-success p-2">Completed</span>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

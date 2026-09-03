<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_worker();
$wid = current_id();

// Handle status update
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['request_id'])) {
    $rid = (int) $_POST['request_id'];
    $new_status = $_POST['new_status'];
    $allowed = ['In Progress', 'Completed'];
    if (in_array($new_status, $allowed, true)) {
        $stmt = $conn->prepare("UPDATE service_requests SET status=? WHERE id=? AND worker_id=?");
        $stmt->bind_param("sii", $new_status, $rid, $wid);
        $stmt->execute();
        $stmt->close();
        $_SESSION['flash'] = ['type' => 'success', 'msg' => "Request #$rid updated to \"$new_status\"."];
    }
    header("Location: /worker/dashboard.php");
    exit;
}

$jobs = $conn->query("
  SELECT sr.*, s.name AS service_name, f.flat_number, f.floor_number, f.block_name, f.address,
         u.name AS customer_name, u.phone AS customer_phone
  FROM service_requests sr
  JOIN services s ON s.id = sr.service_id
  JOIN flats f ON f.id = sr.flat_id
  JOIN users u ON u.id = sr.user_id
  WHERE sr.worker_id = $wid
  ORDER BY FIELD(sr.status,'Assigned','In Progress','Completed'), sr.created_at DESC
");

$active = $conn->query("SELECT COUNT(*) c FROM service_requests WHERE worker_id=$wid AND status IN ('Assigned','In Progress')")->fetch_assoc()['c'];
$done   = $conn->query("SELECT COUNT(*) c FROM service_requests WHERE worker_id=$wid AND status='Completed'")->fetch_assoc()['c'];

$page_title = "My Work";
include __DIR__ . '/../includes/header.php';
?>

<h4 class="mb-4">Welcome, <?= e(current_name()) ?> 🔧</h4>

<div class="row g-3 mb-4">
  <div class="col-md-3 col-6">
    <div class="stat-box" style="background:#e0a800;"><h3><?= $active ?></h3><small>Active Jobs</small></div>
  </div>
  <div class="col-md-3 col-6">
    <div class="stat-box" style="background:#198754;"><h3><?= $done ?></h3><small>Completed Jobs</small></div>
  </div>
</div>

<div class="row g-3">
  <?php if ($jobs->num_rows === 0): ?>
    <div class="col-12"><div class="card p-4 text-center text-muted">No work assigned yet.</div></div>
  <?php endif; ?>

  <?php while ($j = $jobs->fetch_assoc()): ?>
    <div class="col-md-6">
      <div class="card p-3 h-100">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="mb-0">Request #<?= $j['id'] ?> — <?= e($j['service_name']) ?></h6>
          <?= status_badge($j['status']) ?>
        </div>
        <p class="mb-1"><i class="fa-solid fa-building me-2 text-muted"></i><?= e($j['block_name']) ?>, Flat <?= e($j['flat_number']) ?> (Floor <?= e($j['floor_number']) ?>)</p>
        <p class="mb-1"><i class="fa-solid fa-location-dot me-2 text-muted"></i><?= e($j['address']) ?></p>
        <p class="mb-1"><i class="fa-solid fa-user me-2 text-muted"></i><?= e($j['customer_name']) ?> — <?= e($j['customer_phone']) ?></p>
        <p class="mb-2"><i class="fa-solid fa-note-sticky me-2 text-muted"></i><?= e($j['description']) ?></p>

        <?php if ($j['status'] !== 'Completed'): ?>
          <form method="post" class="d-flex gap-2 mt-2">
            <input type="hidden" name="request_id" value="<?= $j['id'] ?>">
            <?php if ($j['status'] === 'Assigned'): ?>
              <button type="submit" name="new_status" value="In Progress" class="btn btn-sm btn-warning">Start Work</button>
            <?php elseif ($j['status'] === 'In Progress'): ?>
              <button type="submit" name="new_status" value="Completed" class="btn btn-sm btn-success">Mark Completed</button>
            <?php endif; ?>
          </form>
        <?php endif; ?>
      </div>
    </div>
  <?php endwhile; ?>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

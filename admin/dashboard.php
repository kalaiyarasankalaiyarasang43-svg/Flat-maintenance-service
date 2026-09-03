<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_admin();

// Assign worker to a request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['assign'])) {
    $rid = (int) $_POST['request_id'];
    $wid = (int) $_POST['worker_id'];
    if ($wid > 0) {
        $stmt = $conn->prepare("UPDATE service_requests SET worker_id=?, status='Assigned' WHERE id=?");
        $stmt->bind_param("ii", $wid, $rid);
        $stmt->execute();
        $stmt->close();
        $_SESSION['flash'] = ['type' => 'success', 'msg' => "Worker assigned to request #$rid."];
    }
    header("Location: /admin/dashboard.php");
    exit;
}

$total = $conn->query("SELECT COUNT(*) c FROM service_requests")->fetch_assoc()['c'];
$pending = $conn->query("SELECT COUNT(*) c FROM service_requests WHERE status='Pending'")->fetch_assoc()['c'];
$active = $conn->query("SELECT COUNT(*) c FROM service_requests WHERE status IN ('Assigned','In Progress')")->fetch_assoc()['c'];
$completed = $conn->query("SELECT COUNT(*) c FROM service_requests WHERE status='Completed'")->fetch_assoc()['c'];

$requests = $conn->query("
  SELECT sr.*, s.name AS service_name, s.id AS service_id, f.flat_number, f.block_name,
         u.name AS customer_name, u.phone AS customer_phone, w.name AS worker_name
  FROM service_requests sr
  JOIN services s ON s.id = sr.service_id
  JOIN flats f ON f.id = sr.flat_id
  JOIN users u ON u.id = sr.user_id
  LEFT JOIN workers w ON w.id = sr.worker_id
  ORDER BY FIELD(sr.status,'Pending','Assigned','In Progress','Completed'), sr.created_at DESC
");

$page_title = "Service Requests";
include __DIR__ . '/../includes/header.php';
?>

<h4 class="mb-4">Admin Dashboard</h4>

<div class="row g-3 mb-4">
  <div class="col-md-3 col-6"><div class="stat-box" style="background:#1e3a5f;"><h3><?= $total ?></h3><small>Total Requests</small></div></div>
  <div class="col-md-3 col-6"><div class="stat-box" style="background:#6c757d;"><h3><?= $pending ?></h3><small>Pending</small></div></div>
  <div class="col-md-3 col-6"><div class="stat-box" style="background:#e0a800;"><h3><?= $active ?></h3><small>Active</small></div></div>
  <div class="col-md-3 col-6"><div class="stat-box" style="background:#198754;"><h3><?= $completed ?></h3><small>Completed</small></div></div>
</div>

<div class="card p-3">
  <h6 class="mb-3">All Service Requests</h6>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead>
        <tr>
          <th>#</th><th>Customer</th><th>Flat</th><th>Service</th><th>Description</th>
          <th>Status</th><th>Assign Worker</th>
        </tr>
      </thead>
      <tbody>
        <?php if ($requests->num_rows === 0): ?>
          <tr><td colspan="7" class="text-center text-muted py-3">No requests yet.</td></tr>
        <?php endif; ?>
        <?php while ($r = $requests->fetch_assoc()): ?>
          <tr>
            <td>#<?= $r['id'] ?></td>
            <td><?= e($r['customer_name']) ?><br><small class="text-muted"><?= e($r['customer_phone']) ?></small></td>
            <td><?= e($r['block_name']) ?> - <?= e($r['flat_number']) ?></td>
            <td><?= e($r['service_name']) ?></td>
            <td><?= e(mb_strimwidth($r['description'], 0, 35, '...')) ?></td>
            <td><?= status_badge($r['status']) ?></td>
            <td>
              <?php if ($r['status'] === 'Pending'): ?>
                <?php
                  $workers = $conn->query("SELECT id, name FROM workers WHERE specialization = (SELECT name FROM services WHERE id={$r['service_id']}) ORDER BY name");
                ?>
                <form method="post" class="d-flex gap-1">
                  <input type="hidden" name="request_id" value="<?= $r['id'] ?>">
                  <select name="worker_id" class="form-select form-select-sm" required>
                    <option value="">Select worker</option>
                    <?php while ($w = $workers->fetch_assoc()): ?>
                      <option value="<?= $w['id'] ?>"><?= e($w['name']) ?></option>
                    <?php endwhile; ?>
                  </select>
                  <button type="submit" name="assign" value="1" class="btn btn-sm btn-primary">Assign</button>
                </form>
              <?php else: ?>
                <span class="text-muted"><?= $r['worker_name'] ? e($r['worker_name']) : '—' ?></span>
              <?php endif; ?>
            </td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

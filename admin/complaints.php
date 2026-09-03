<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['resolve'])) {
    $cid = (int) $_POST['complaint_id'];
    $stmt = $conn->prepare("UPDATE complaints SET status='Resolved' WHERE id=?");
    $stmt->bind_param("i", $cid);
    $stmt->execute();
    $stmt->close();
    header("Location: /admin/complaints.php");
    exit;
}

$complaints = $conn->query("
  SELECT c.*, u.name AS customer_name, u.phone AS customer_phone
  FROM complaints c JOIN users u ON u.id = c.user_id
  ORDER BY FIELD(c.status,'Open','Resolved'), c.created_at DESC
");

$page_title = "Complaints";
include __DIR__ . '/../includes/header.php';
?>

<div class="card p-3">
  <h5 class="mb-3">Resident Complaints</h5>
  <div class="table-responsive">
    <table class="table align-middle">
      <thead><tr><th>Customer</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th><th></th></tr></thead>
      <tbody>
        <?php if ($complaints->num_rows === 0): ?>
          <tr><td colspan="6" class="text-center text-muted py-3">No complaints yet.</td></tr>
        <?php endif; ?>
        <?php while ($c = $complaints->fetch_assoc()): ?>
          <tr>
            <td><?= e($c['customer_name']) ?><br><small class="text-muted"><?= e($c['customer_phone']) ?></small></td>
            <td><?= e($c['subject']) ?></td>
            <td><?= e($c['message']) ?></td>
            <td><?= status_badge($c['status']) ?></td>
            <td><?= e(date('d M Y', strtotime($c['created_at']))) ?></td>
            <td>
              <?php if ($c['status'] === 'Open'): ?>
                <form method="post">
                  <input type="hidden" name="complaint_id" value="<?= $c['id'] ?>">
                  <button type="submit" name="resolve" value="1" class="btn btn-sm btn-success">Mark Resolved</button>
                </form>
              <?php endif; ?>
            </td>
          </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

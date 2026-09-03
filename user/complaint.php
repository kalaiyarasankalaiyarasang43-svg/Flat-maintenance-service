<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_user();
$uid = current_id();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $subject = trim($_POST['subject'] ?? '');
    $message = trim($_POST['message'] ?? '');
    if ($subject && $message) {
        $stmt = $conn->prepare("INSERT INTO complaints (user_id, subject, message) VALUES (?,?,?)");
        $stmt->bind_param("iss", $uid, $subject, $message);
        $stmt->execute();
        $stmt->close();
        $_SESSION['flash'] = ['type' => 'success', 'msg' => 'Complaint submitted. Our admin team will review it shortly.'];
        header("Location: /user/complaint.php");
        exit;
    }
}

$complaints = $conn->query("SELECT * FROM complaints WHERE user_id=$uid ORDER BY created_at DESC");

$page_title = "Complaints";
include __DIR__ . '/../includes/header.php';
?>

<div class="row g-4">
  <div class="col-lg-5">
    <div class="card p-4">
      <h5 class="mb-3">Raise a Complaint</h5>
      <form method="post">
        <div class="mb-3">
          <label class="form-label">Subject</label>
          <input type="text" name="subject" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Message</label>
          <textarea name="message" class="form-control" rows="5" required></textarea>
        </div>
        <button type="submit" class="btn btn-danger w-100">Submit Complaint</button>
      </form>
    </div>
  </div>
  <div class="col-lg-7">
    <div class="card p-3">
      <h5 class="mb-3">My Complaints</h5>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>Subject</th><th>Message</th><th>Status</th><th>Date</th></tr></thead>
          <tbody>
            <?php if ($complaints->num_rows === 0): ?>
              <tr><td colspan="4" class="text-center text-muted py-3">No complaints raised yet.</td></tr>
            <?php endif; ?>
            <?php while ($c = $complaints->fetch_assoc()): ?>
              <tr>
                <td><?= e($c['subject']) ?></td>
                <td><?= e(mb_strimwidth($c['message'], 0, 40, '...')) ?></td>
                <td><?= status_badge($c['status']) ?></td>
                <td><?= e(date('d M Y', strtotime($c['created_at']))) ?></td>
              </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

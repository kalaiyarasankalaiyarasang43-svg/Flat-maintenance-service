<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_user();
$uid = current_id();

$flats = $conn->query("SELECT * FROM flats WHERE user_id=$uid");
$services = $conn->query("SELECT * FROM services ORDER BY name");

$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $flat_id = (int) ($_POST['flat_id'] ?? 0);
    $service_id = (int) ($_POST['service_id'] ?? 0);
    $description = trim($_POST['description'] ?? '');

    if (!$flat_id || !$service_id || $description === '') {
        $errors[] = "Please select a flat, a service, and describe the issue.";
    } else {
        $stmt = $conn->prepare("INSERT INTO service_requests (user_id, flat_id, service_id, description, status) VALUES (?,?,?,?,'Pending')");
        $stmt->bind_param("iiis", $uid, $flat_id, $service_id, $description);
        $stmt->execute();
        $stmt->close();
        $_SESSION['flash'] = ['type' => 'success', 'msg' => 'Service request submitted! Status: Pending.'];
        header("Location: /user/track_status.php");
        exit;
    }
}

$page_title = "Book Service";
include __DIR__ . '/../includes/header.php';
?>

<div class="row justify-content-center">
  <div class="col-lg-7">
    <div class="card p-4">
      <h5 class="mb-3">Book a Service</h5>

      <?php foreach ($errors as $err): ?>
        <div class="alert alert-danger py-2"><?= e($err) ?></div>
      <?php endforeach; ?>

      <?php if ($flats->num_rows === 0): ?>
        <div class="alert alert-warning">You need to add a flat before booking a service.
          <a href="/user/flat_details.php">Add flat now</a>.
        </div>
      <?php else: ?>
        <form method="post">
          <div class="mb-3">
            <label class="form-label">Select Flat</label>
            <select name="flat_id" class="form-select" required>
              <option value="">-- Choose Flat --</option>
              <?php while ($f = $flats->fetch_assoc()): ?>
                <option value="<?= $f['id'] ?>">
                  <?= e($f['block_name']) ?> - Flat <?= e($f['flat_number']) ?> (Floor <?= e($f['floor_number']) ?>)
                </option>
              <?php endwhile; ?>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Select Service</label>
            <select name="service_id" class="form-select" required>
              <option value="">-- Choose Service --</option>
              <?php while ($s = $services->fetch_assoc()): ?>
                <option value="<?= $s['id'] ?>"><?= e($s['name']) ?></option>
              <?php endwhile; ?>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Problem Description</label>
            <textarea name="description" class="form-control" rows="4" placeholder="Describe the issue in detail..." required></textarea>
          </div>
          <button type="submit" class="btn btn-primary w-100">Submit Request</button>
        </form>
      <?php endif; ?>
    </div>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

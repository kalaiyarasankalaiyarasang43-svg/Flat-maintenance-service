<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_user();
$uid = current_id();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $flat_number  = trim($_POST['flat_number']);
    $floor_number = trim($_POST['floor_number']);
    $block_name   = trim($_POST['block_name']);
    $address      = trim($_POST['address']);

    if ($flat_number && $floor_number && $block_name && $address) {
        $stmt = $conn->prepare("INSERT INTO flats (user_id, flat_number, floor_number, block_name, address) VALUES (?,?,?,?,?)");
        $stmt->bind_param("issss", $uid, $flat_number, $floor_number, $block_name, $address);
        $stmt->execute();
        $stmt->close();
        $_SESSION['flash'] = ['type' => 'success', 'msg' => 'Flat added successfully.'];
    } else {
        $_SESSION['flash'] = ['type' => 'danger', 'msg' => 'Please fill all fields.'];
    }
    header("Location: /user/flat_details.php");
    exit;
}

if (isset($_GET['delete'])) {
    $fid = (int) $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM flats WHERE id=? AND user_id=?");
    $stmt->bind_param("ii", $fid, $uid);
    $stmt->execute();
    $stmt->close();
    header("Location: /user/flat_details.php");
    exit;
}

$flats = $conn->query("SELECT * FROM flats WHERE user_id=$uid ORDER BY created_at DESC");

$page_title = "My Flats";
include __DIR__ . '/../includes/header.php';
?>

<div class="row g-4">
  <div class="col-lg-5">
    <div class="card p-4">
      <h5 class="mb-3">Add New Flat</h5>
      <form method="post">
        <div class="mb-3">
          <label class="form-label">Flat Number</label>
          <input type="text" name="flat_number" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Floor Number</label>
          <input type="text" name="floor_number" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Block Name</label>
          <input type="text" name="block_name" class="form-control" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Address</label>
          <textarea name="address" class="form-control" rows="2" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary w-100">Save Flat</button>
      </form>
    </div>
  </div>

  <div class="col-lg-7">
    <div class="card p-3">
      <h5 class="mb-3">My Flats</h5>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>Flat No.</th><th>Floor</th><th>Block</th><th>Address</th><th></th></tr></thead>
          <tbody>
            <?php if ($flats->num_rows === 0): ?>
              <tr><td colspan="5" class="text-center text-muted py-3">No flats added yet.</td></tr>
            <?php endif; ?>
            <?php while ($f = $flats->fetch_assoc()): ?>
              <tr>
                <td><?= e($f['flat_number']) ?></td>
                <td><?= e($f['floor_number']) ?></td>
                <td><?= e($f['block_name']) ?></td>
                <td><?= e($f['address']) ?></td>
                <td>
                  <a href="?delete=<?= $f['id'] ?>" class="btn btn-sm btn-outline-danger"
                     onclick="return confirm('Delete this flat?');">Delete</a>
                </td>
              </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

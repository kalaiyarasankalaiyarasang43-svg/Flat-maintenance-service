<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_service'])) {
    $name = trim($_POST['name']);
    $desc = trim($_POST['description']);
    if ($name) {
        $stmt = $conn->prepare("INSERT INTO services (name, description) VALUES (?,?)");
        $stmt->bind_param("ss", $name, $desc);
        $stmt->execute();
        $stmt->close();
        $_SESSION['flash'] = ['type' => 'success', 'msg' => 'Service added.'];
    }
    header("Location: /admin/manage_services.php");
    exit;
}

if (isset($_GET['delete'])) {
    $sid = (int) $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM services WHERE id=?");
    $stmt->bind_param("i", $sid);
    $stmt->execute();
    $stmt->close();
    header("Location: /admin/manage_services.php");
    exit;
}

$services = $conn->query("SELECT * FROM services ORDER BY name");

$page_title = "Manage Services";
include __DIR__ . '/../includes/header.php';
?>

<div class="row g-4">
  <div class="col-lg-5">
    <div class="card p-4">
      <h5 class="mb-3">Add New Service</h5>
      <form method="post">
        <div class="mb-3"><label class="form-label">Service Name</label>
          <input type="text" name="name" class="form-control" required></div>
        <div class="mb-3"><label class="form-label">Description</label>
          <textarea name="description" class="form-control" rows="2"></textarea></div>
        <button type="submit" name="add_service" value="1" class="btn btn-primary w-100">Add Service</button>
      </form>
    </div>
  </div>
  <div class="col-lg-7">
    <div class="card p-3">
      <h5 class="mb-3">All Services</h5>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>Name</th><th>Description</th><th></th></tr></thead>
          <tbody>
            <?php while ($s = $services->fetch_assoc()): ?>
              <tr>
                <td><?= e($s['name']) ?></td>
                <td><?= e($s['description']) ?></td>
                <td><a href="?delete=<?= $s['id'] ?>" class="btn btn-sm btn-outline-danger"
                       onclick="return confirm('Delete this service?');">Delete</a></td>
              </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

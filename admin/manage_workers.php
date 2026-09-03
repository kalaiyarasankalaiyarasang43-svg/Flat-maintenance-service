<?php
require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../includes/auth.php';
require_admin();

$errors = [];
$services = $conn->query("SELECT * FROM services ORDER BY name");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_worker'])) {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $phone = trim($_POST['phone']);
    $specialization = trim($_POST['specialization']);
    $pass = $_POST['password'];

    if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || !preg_match('/^[0-9]{10}$/', $phone) || !$specialization || strlen($pass) < 6) {
        $errors[] = "Please fill all fields correctly (10-digit phone, password 6+ chars).";
    } else {
        $chk = $conn->prepare("SELECT id FROM workers WHERE email=?");
        $chk->bind_param("s", $email);
        $chk->execute();
        if ($chk->get_result()->num_rows > 0) {
            $errors[] = "A worker with this email already exists.";
        }
        $chk->close();
    }

    if (empty($errors)) {
        $hash = password_hash($pass, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("INSERT INTO workers (name, email, phone, password, specialization) VALUES (?,?,?,?,?)");
        $stmt->bind_param("sssss", $name, $email, $phone, $hash, $specialization);
        $stmt->execute();
        $stmt->close();
        $_SESSION['flash'] = ['type' => 'success', 'msg' => 'Worker added successfully.'];
        header("Location: /admin/manage_workers.php");
        exit;
    }
}

if (isset($_GET['delete'])) {
    $wid = (int) $_GET['delete'];
    $stmt = $conn->prepare("DELETE FROM workers WHERE id=?");
    $stmt->bind_param("i", $wid);
    $stmt->execute();
    $stmt->close();
    header("Location: /admin/manage_workers.php");
    exit;
}

$workers = $conn->query("SELECT * FROM workers ORDER BY specialization, name");

$page_title = "Manage Workers";
include __DIR__ . '/../includes/header.php';
?>

<div class="row g-4">
  <div class="col-lg-5">
    <div class="card p-4">
      <h5 class="mb-3">Add New Worker</h5>
      <?php foreach ($errors as $err): ?>
        <div class="alert alert-danger py-2"><?= e($err) ?></div>
      <?php endforeach; ?>
      <form method="post">
        <div class="mb-3"><label class="form-label">Full Name</label>
          <input type="text" name="name" class="form-control" required></div>
        <div class="mb-3"><label class="form-label">Email</label>
          <input type="email" name="email" class="form-control" required></div>
        <div class="mb-3"><label class="form-label">Phone</label>
          <input type="text" name="phone" maxlength="10" class="form-control" required></div>
        <div class="mb-3"><label class="form-label">Specialization</label>
          <select name="specialization" class="form-select" required>
            <?php
            $services->data_seek(0);
            while ($s = $services->fetch_assoc()): ?>
              <option value="<?= e($s['name']) ?>"><?= e($s['name']) ?></option>
            <?php endwhile; ?>
          </select>
        </div>
        <div class="mb-3"><label class="form-label">Password</label>
          <input type="password" name="password" class="form-control" required></div>
        <button type="submit" name="add_worker" value="1" class="btn btn-primary w-100">Add Worker</button>
      </form>
    </div>
  </div>

  <div class="col-lg-7">
    <div class="card p-3">
      <h5 class="mb-3">All Workers</h5>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead><tr><th>Name</th><th>Contact</th><th>Specialization</th><th></th></tr></thead>
          <tbody>
            <?php if ($workers->num_rows === 0): ?>
              <tr><td colspan="4" class="text-center text-muted py-3">No workers added yet.</td></tr>
            <?php endif; ?>
            <?php while ($w = $workers->fetch_assoc()): ?>
              <tr>
                <td><?= e($w['name']) ?></td>
                <td><?= e($w['email']) ?><br><small class="text-muted"><?= e($w['phone']) ?></small></td>
                <td><span class="badge bg-primary"><?= e($w['specialization']) ?></span></td>
                <td><a href="?delete=<?= $w['id'] ?>" class="btn btn-sm btn-outline-danger"
                       onclick="return confirm('Remove this worker?');">Remove</a></td>
              </tr>
            <?php endwhile; ?>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

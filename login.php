<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth.php';

$errors = [];
$role   = $_POST['role'] ?? 'user';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $pass  = $_POST['password'] ?? '';

    $table = match ($role) {
        'worker' => 'workers',
        'admin'  => 'admins',
        default  => 'users',
    };

    if ($email === '' || $pass === '') {
        $errors[] = "Please enter both email and password.";
    } else {
        $stmt = $conn->prepare("SELECT * FROM $table WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $account = $result->fetch_assoc();
        $stmt->close();

        if ($account && password_verify($pass, $account['password'])) {
            $_SESSION['id']   = $account['id'];
            $_SESSION['name'] = $account['name'];
            $_SESSION['role'] = $role;

            if ($role === 'worker') {
                header("Location: /worker/dashboard.php");
            } elseif ($role === 'admin') {
                header("Location: /admin/dashboard.php");
            } else {
                header("Location: /user/dashboard.php");
            }
            exit;
        } else {
            $errors[] = "Invalid email or password.";
        }
    }
}

$page_title = "Login";
include __DIR__ . '/includes/header.php';
?>

<div class="row justify-content-center">
  <div class="col-md-6 col-lg-5">
    <div class="card p-4">
      <h4 class="mb-3 text-center">Login to FlatCare</h4>

      <?php foreach ($errors as $err): ?>
        <div class="alert alert-danger py-2"><?= e($err) ?></div>
      <?php endforeach; ?>

      <form method="post">
        <div class="mb-3">
          <label class="form-label">Login as</label>
          <select name="role" class="form-select">
            <option value="user"   <?= $role === 'user'   ? 'selected' : '' ?>>Resident (User)</option>
            <option value="worker" <?= $role === 'worker' ? 'selected' : '' ?>>Worker</option>
            <option value="admin"  <?= $role === 'admin'  ? 'selected' : '' ?>>Admin</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" name="email" class="form-control" value="<?= e($_POST['email'] ?? '') ?>" required>
        </div>
        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" name="password" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary w-100">Login</button>
      </form>
      <p class="text-center mt-3 mb-0">New here? <a href="/register.php">Create an account</a></p>
      <p class="text-center text-muted small mt-2 mb-0">
        Demo admin: admin@flatcare.com / admin123<br>
        Demo worker: ravi.water@flatcare.com / worker123
      </p>
    </div>
  </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>

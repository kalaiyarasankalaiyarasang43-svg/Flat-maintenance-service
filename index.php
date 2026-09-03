<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/includes/auth.php';
$page_title = "Home";
include __DIR__ . '/includes/header.php';
?>

<div class="hero mb-5">
  <div class="row align-items-center">
    <div class="col-lg-7">
      <h1 class="fw-bold mb-3">Flat Maintenance, Simplified.</h1>
      <p class="lead">Book water, electricity, painting and mason services for your flat, track requests in
      real time, and get issues resolved by verified workers — all in one place.</p>
      <?php if (empty($_SESSION['role'])): ?>
        <a href="/register.php" class="btn btn-light btn-lg me-2">Get Started</a>
        <a href="/login.php" class="btn btn-outline-light btn-lg">Login</a>
      <?php endif; ?>
    </div>
  </div>
</div>

<div class="row g-4 mb-5">
  <div class="col-md-3 col-6">
    <div class="card text-center p-4">
      <div class="service-icon"><i class="fa-solid fa-faucet-drip"></i></div>
      <h6 class="mt-2 mb-0">Water Service</h6>
    </div>
  </div>
  <div class="col-md-3 col-6">
    <div class="card text-center p-4">
      <div class="service-icon"><i class="fa-solid fa-bolt"></i></div>
      <h6 class="mt-2 mb-0">Electricity Service</h6>
    </div>
  </div>
  <div class="col-md-3 col-6">
    <div class="card text-center p-4">
      <div class="service-icon"><i class="fa-solid fa-paint-roller"></i></div>
      <h6 class="mt-2 mb-0">Painting Service</h6>
    </div>
  </div>
  <div class="col-md-3 col-6">
    <div class="card text-center p-4">
      <div class="service-icon"><i class="fa-solid fa-trowel-bricks"></i></div>
      <h6 class="mt-2 mb-0">Mason Service</h6>
    </div>
  </div>
</div>

<div class="row g-4">
  <div class="col-md-4">
    <div class="card p-4 h-100">
      <h5><i class="fa-solid fa-user text-primary me-2"></i>Residents</h5>
      <p class="text-muted">Register your flat, raise a service request in seconds, and track its status
      from Pending to Completed.</p>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card p-4 h-100">
      <h5><i class="fa-solid fa-screwdriver-wrench text-primary me-2"></i>Workers</h5>
      <p class="text-muted">View assigned jobs with full flat &amp; customer details, and update work
      status as you progress.</p>
    </div>
  </div>
  <div class="col-md-4">
    <div class="card p-4 h-100">
      <h5><i class="fa-solid fa-user-shield text-primary me-2"></i>Admin</h5>
      <p class="text-muted">Review incoming requests, assign the right worker, manage services and
      resolve complaints.</p>
    </div>
  </div>
</div>

<?php include __DIR__ . '/includes/footer.php'; ?>

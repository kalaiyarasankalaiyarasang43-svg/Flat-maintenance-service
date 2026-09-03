# FlatCare — Flat Maintenance Service (PHP + MySQL + Bootstrap 5)

A complete 3-module web app: **User (Resident)**, **Worker**, **Admin** — matching the
architecture: Client Layer (HTML5/CSS3/Bootstrap/JS) → Server Layer (PHP) → Data Layer (MySQL).

## Features

- **User**: register/login, add & manage flats, book a service (Water/Electricity/Painting/Mason),
  track request status (Pending → Assigned → In Progress → Completed), raise complaints.
- **Worker**: login, view assigned jobs with full customer & flat details, update job status
  (Start Work → Mark Completed).
- **Admin**: login, view all service requests, assign the right worker (auto-filtered by
  specialization matching the requested service), manage workers, manage the service catalog,
  view & resolve complaints.
- Session-based auth per role, passwords hashed with bcrypt (`password_hash`/`password_verify`),
  prepared statements everywhere (SQL-injection safe).

## Requirements

- PHP 8.0+ with the `mysqli` extension
- MySQL / MariaDB
- A local server: XAMPP / WAMP / MAMP, or PHP's built-in server

## Setup

1. **Create the database**
   - Open phpMyAdmin (or the `mysql` CLI) and import `database.sql`. It creates the
     `flat_maintenance` database, all tables, the default services, one demo admin, and
     4 demo workers (one per service).

2. **Configure the connection**
   - Edit `config.php` if your MySQL user/password differ from the defaults
     (`root` / empty password).

3. **Run it**
   - **XAMPP/WAMP**: copy this whole folder into `htdocs/flatcare`, start Apache + MySQL,
     visit `http://localhost/flatcare/`.
   - **PHP built-in server**: from this folder run:
     ```
     php -S localhost:8000
     ```
     then visit `http://localhost:8000/`.

   > Note: the navbar and links use root-relative paths (e.g. `/login.php`). If you deploy
   > into a subfolder (like `/flatcare/`), either use a virtual host pointing at this folder
   > as the web root, or update the links in `includes/navbar.php` and redirect calls to
   > include your subfolder prefix.

## Demo logins

| Role   | Email                          | Password   |
|--------|---------------------------------|------------|
| Admin  | admin@flatcare.com              | admin123   |
| Worker | ravi.water@flatcare.com         | worker123  |
| Worker | suresh.elec@flatcare.com        | worker123  |
| Worker | anitha.paint@flatcare.com       | worker123  |
| Worker | murugan.mason@flatcare.com      | worker123  |

Register a new account at `/register.php` to try the User flow.

## Folder structure

```
flat-maintenance/
├── database.sql             # schema + seed data
├── config.php                # DB connection + session start
├── index.php                  # landing page
├── register.php / login.php / logout.php
├── includes/
│   ├── auth.php               # role guards + helpers
│   ├── header.php / footer.php
│   └── navbar.php
├── user/
│   ├── dashboard.php
│   ├── flat_details.php
│   ├── book_service.php
│   ├── track_status.php
│   └── complaint.php
├── worker/
│   └── dashboard.php          # assigned jobs + status update
├── admin/
│   ├── dashboard.php          # all requests + assign worker
│   ├── manage_workers.php
│   ├── manage_services.php
│   └── complaints.php
└── css/style.css
```

## End-to-end flow (matches the architecture doc)

Register → Login → Add Flat → Select Service → Book Service (status: Pending) →
Admin reviews request → Admin assigns a matching worker (status: Assigned) →
Worker starts work (status: In Progress) → Worker completes (status: Completed) →
User tracks status throughout → User can raise a Complaint any time → Admin resolves it.

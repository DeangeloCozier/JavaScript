# COMP2245 Assignment 2 supplied XAMPP service

This package supplies the PHP API and JSON records for the Campus Equipment Loan Desk assignment. Implement the browser HTML, CSS and JavaScript yourself, starting from Assignment 1. This package does not contain the assessed frontend solution.

## Install and start XAMPP

1. Install XAMPP from https://www.apachefriends.org/ using the installer for your operating system. Use its bundled Apache and PHP 8 or later.
2. Open the XAMPP control panel and start **Apache**. MySQL, FileZilla and Mercury are not needed for this assignment.
3. Open `http://localhost/` to confirm Apache is running. If Apache cannot start because its port is in use, resolve the conflict or ask the instructor to arrange an alternative port consistently. Do not change the assignment's server code to resolve a port conflict.

The following steps assume Apache uses its standard HTTP port 80. If the instructor specifies another port, include it in every URL, for example `http://localhost:8080/COMP2245/loan_desk/`. Keep the same hostname and port throughout because Web Storage belongs to the origin.

## Put the assignment under htdocs

1. In XAMPP's `htdocs` directory, create a folder named `COMP2245`. On a standard Windows installation this is `C:\xampp\htdocs\COMP2245`. On macOS/Linux use the `htdocs` directory inside your XAMPP installation; on standard macOS XAMPP it is `/Applications/XAMPP/xamppfiles/htdocs`.
2. Extract the ZIP's **loan_desk** folder directly into `COMP2245`. Do not add a second enclosing folder. The Windows path to the PHP entry point must be `C:\xampp\htdocs\COMP2245\loan_desk\api.php`.
3. Keep the supplied `.htaccess` file in `loan_desk`. It is included in the ZIP even if your file browser hides dotfiles. It routes API requests to PHP and serves your `public` files at the application URL.
4. Copy your Assignment 1 `index.html`, CSS, JavaScript and images into `loan_desk/public/`, replacing the supplied setup page. Keep the supplied `public/data/parishes.json` and `public/data/levels.json`.
5. Open **`http://localhost/COMP2245/loan_desk/`**, including the final slash. Do not open `index.html` directly, browse to `public/`, or use a separate static server.
6. Before replacing the setup page, its links can be used to check the service. Open `http://localhost/COMP2245/loan_desk/health`; it should return JSON with `"ok": true`. Then open `http://localhost/COMP2245/loan_desk/data/borrowers.json`; it should return the two initial borrower records.

Apache serves your HTML/CSS/JavaScript and runs the supplied PHP for API requests. No command-line server, additional package installation or database is needed.

## Paths and supplied files

All API and data paths below are **relative to the application URL** `http://localhost/COMP2245/loan_desk/`. Use `fetch('data/borrowers.json')`, not `fetch('/data/borrowers.json')`. Use form `action="borrower/new"`, not `action="/borrower/new"`. A leading slash starts at `http://localhost/` and leaves the assignment folder. HTML asset references such as `js/app.js` and `css/styles.css` are also relative to the application URL. The browser URL stays at the application root while your single-document interface switches views.

- `api.php`: supplied PHP service; do not modify for assessment.
- `.htaccess`: supplied Apache 2.4 routing and local-access rules; do not modify for assessment.
- `seed/borrowers.json`, `seed/technicians.json`, `seed/managers.json`: initial fictional accounts; do not modify.
- `public/data/parishes.json`, `public/data/levels.json`: lookup data; do not modify.
- `public/`: place your assessed frontend here.
- `server_data/`: created on the first API request. Account POST requests update its JSON files. Stopping/restarting Apache preserves registrations.

The server JSON records are authoritative. The client maintains localStorage copies as described in the brief. Browser storage cannot write these JSON files directly. The account-data URLs are handled by PHP and read the same current records as the `/all` API operations. There are no static account copies in `public/data`.

## HTTP contract

Successful account GETs return JSON arrays and have `Cache-Control: no-store`. The parish lookup returns an array; levels.json returns an object with borrower and technician arrays.

| Method | Relative endpoint | Result |
|---|---|---|
| GET | health | JSON with ok:true |
| GET | data/borrowers.json | Current full borrower array |
| GET | data/technicians.json | Current full technician array |
| GET | data/managers.json | Current full manager array |
| GET | data/parishes.json | Array of code/name pairs |
| GET | data/levels.json | Object keyed by borrower and technician; values are code/name arrays |
| GET | borrower/all | Current full borrower array |
| GET | technician/all | Current full technician array |
| POST | borrower/new | Create a borrower |
| POST | technician/new | Create a technician |

POST bodies must use `application/x-www-form-urlencoded`. Use the form action and method in your fetch request. One supported encoding is `new URLSearchParams(new FormData(form))`. Give controls the names below; generate IDs in read-only, not disabled, inputs.

Both POSTs require: firstName, lastName, email, password, address1, parishCode, enrollmentDate, levelCode and collectionPoint. Borrower POST also requires studentId; technician POST also requires technicianId. address2 is optional and defaults to an empty string. Do not send confirmPassword. Extra fields, including role, are ignored by the service.

- 201: `{ "ok": true, "message": "Registration successful.", "record": { ... } }`.
- 400: `{ "ok": false, "message": "Missing required field: firstName", "field": "firstName" }` (example).
- 409: duplicate full ID across borrower/technician datasets, or duplicate email within the selected role. The JSON response includes ok:false, message, and field.
- 415: wrong body encoding. 413: request body exceeds 32 KiB. 405: wrong method for an API endpoint. 500: service/read/save error. A stopped Apache server produces a browser network failure, not an HTTP status.

These endpoints perform basic required-field and duplicate checks. They intentionally do not provide the assessed validation algorithms. This is a local classroom service with no real authentication, database or email delivery. Use fictional data only. The supplied Apache rules restrict access to local requests and deny direct access to seed/server_data files.

## Account data

All account values are strings. New records use the same schema as the seeds. Managers have managerId, firstName, lastName, email and password; they are not registered in this assignment. Parish/level codes and collectionPoint values are as specified in the brief. Parish codes P01–P11 are internal exercise codes.

| Role | Login credential | Password | Record ID |
|---|---|---|---|
| Borrower | 4000000001 | LoanDesk2026@ | 4000000001 |
| Borrower | 4000000002 | NoahBorrow26# | 4000000002 |
| Technician | maya@uwi.edu | TechDesk2026# | 4000000101-7 |
| Technician | liam@cavehill.uwi.edu | LiamService26@ | 4000000102-7 |
| Manager | rhea@uwi.edu | ManageDesk26$ | M001 |
| Manager | omar@cavehill.uwi.edu | OmarManager26# | M002 |

The second password in each role differs from Assignment 1 to permit meaningful mismatched-credential tests. The first account in each role retains its original password.

## Loading checks and resets

Account GET endpoints accept `?delay=1000`, delaying the response by one second; for example `http://localhost/COMP2245/loan_desk/borrower/all?delay=1000`. The supported delay is bounded at two seconds. This is optional observation support; do not add a fake client-side delay to earn loading-state marks.

For a clean marking run, use a fresh extracted package and browser profile, or stop Apache, delete only the generated `loan_desk/server_data` folder, restart Apache, and remove only the three loandesk.* account keys from localStorage, loandesk.session from sessionStorage, and the LoanDeskSessID cookie. The next API request recreates the initial records. Do not reset while testing persistence.

## Troubleshooting

- **Application URL gives 404:** check the folder placement. There must be one `loan_desk` folder directly under `htdocs/COMP2245`, not `loan_desk/loan_desk`.
- **Setup page loads but health/API paths give 404:** confirm `.htaccess` was extracted. Apache must have `mod_rewrite` enabled and `AllowOverride All` for the relevant htdocs directory. Ask the instructor to check the Apache configuration; students are not assessed on configuring it.
- **HTTP 500 or Apache configuration error:** inspect the XAMPP Apache error log through the control panel. Confirm PHP 8 or later, `.htaccess` support and that Apache can create/write `loan_desk/server_data`. On macOS/Linux an instructor may need to grant the Apache account write access to this assignment folder. Do not make the entire htdocs directory broadly writable.
- **PHP code appears as text or downloads:** PHP is not being executed. Confirm you started Apache through XAMPP and used its localhost URL; ask the instructor to check the PHP configuration.
- **Wrong data or absent login after switching URLs:** do not mix localhost with 127.0.0.1, ports, or old application paths. They may use different browser storage. Use the required application URL consistently.
- **Failed POST despite filled fields:** check the request's encoding, control names and response field. Confirm password is intentionally excluded; Address 2 is optional.

The PHP API derives its folder prefix automatically, so no application-root constant needs to be edited. Use the prescribed folder name for consistent teaching and marking.

## Submission

Follow the Word brief. Submit your public folder, README.txt, screenshots and AI disclosure if applicable. Keep the supplied public/data lookups. The marker supplies a clean service and seed accounts; omit server_data and modified PHP, .htaccess or seed files.

## Setup reference

This XAMPP/htdocs workflow follows the previous Study Group Server guidance. General XAMPP setup reference: https://www.apachefriends.org/faq_windows.html. Apache .htaccess reference: https://httpd.apache.org/docs/2.4/howto/htaccess.html.

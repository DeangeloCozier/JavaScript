COMP2245 SUPPORTING LAB 1 — COMMUNITY WORKSHOP BOOKING

Use the student Word guide alongside these files. Do not copy this example as your
Equipment Loan Desk assignment. The contexts, fields and rules differ.

SETUP BEFORE CLASS
If PHP 8 or later is already installed, skip XAMPP installation:
1. Open a terminal in the workshop_lab folder (the folder containing public and storage).
2. Run: php -v
3. Run: php -S localhost:8000 -t public
4. Keep the terminal open. Visit http://localhost:8000/ . Ctrl+C stops the server.
If php is not recognised, use the path to your installed PHP executable or use XAMPP.
For XAMPP PHP in Windows PowerShell:
  & "C:\xampp\php\php.exe" -S localhost:8000 -t public

XAMPP OPTION (WINDOWS EXAMPLE)
Download the desktop installer from https://www.apachefriends.org/download.html .
Install XAMPP (Apache and PHP are needed) into C:\xampp, or your chosen folder.
Start Apache in the XAMPP Control Panel. Do not start MySQL for this lab.
Extract workshop_lab into C:\xampp\htdocs\COMP2245\ . Keep both public and storage.
Open http://localhost/COMP2245/workshop_lab/public/ . Use the final slash.
Do not double-click index.html. PHP needs to run through the local server.
On Linux/macOS, use the equivalent htdocs directory or the PHP-only option above.

PRECHECK
Open data/locations.json and api/bookings.php using the same base URL.
They should show JSON. The initial booking array contains N1001 for Morgan.
The starter New booking button does nothing until Part 1. Dropdown options and
the table appear after Part 3. Starter mistakes are intentional and labelled TODO.
Only edit public/css/styles.css and public/js/*.js. Do not edit PHP or JSON data.

RESET
Stop the local server. Copy storage/seed-bookings.json over storage/bookings.json.
Restart the server and reload the page. This removes only this lab's test bookings.

FILES AND EXERCISES
css/styles.css: CSS1 (two-column layout at 768px).
js/app.js: E1-E4 (event listeners), V3 (display-name check).
js/validation.js: V1 (confirmation), V2 (optional text).
js/data.js: D1a-D1b (GET), D2 (options), D3 (unique code), P1a-P1b (POST).
Supplied functions illustrate the other checks and application steps.
No localStorage, sessionStorage, cookie or real login implementation is required here.

SERVICE
GET data/locations.json -> location code/name array.
GET data/tracks.json -> newcomer/returning code/name arrays.
GET api/bookings.php -> current booking array.
POST api/bookings.php -> URLSearchParams form body; exclude confirmPhrase.
Success: status 201, {ok:true,message,record}.
Errors: status 400/409/415/500, {ok:false,message,field?}.
Duplicate codes/emails are rejected. The server stores only fictional booking data;
it discards the passphrase. A 0.4-second service delay aids the loading demonstration.
Coordinator mode is a supplied checkbox to illustrate stopping an action; it is not
authentication. Session and storage work belong to later supporting labs.

TROUBLESHOOTING
404: check for a duplicate folder after extraction and check the full URL.
PHP code shown/downloaded: use a PHP-enabled server, not a file URL or static preview.
Apache won't start: use the PHP-only command on port 8000; do not disable other services.
Port 8000 busy: use 8001 in the command and browser URL.
500 storage error: keep storage beside public and ensure PHP can write bookings.json.
Stale JavaScript/CSS: save the file and refresh with Ctrl+F5 (Cmd+Shift+R on macOS).

Official setup references:
https://www.apachefriends.org/faq_windows.html
https://www.php.net/manual/en/features.commandline.webserver.php

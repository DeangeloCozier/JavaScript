COMP2245 Supporting Lab 5 — Workshop Access and Lists

This independent starter does not include the completed Lab 4 booking code.
Use the Lab 5 student Word guide. PHP, HTML, CSS, events and test controls are supplied.
Edit only public/js/data.js, access.js and app.js. Use fictional credentials only.

SETUP BEFORE CLASS
If PHP is installed, skip XAMPP installation. PHP 8 or later is recommended.
Otherwise download the desktop XAMPP installer from https://www.apachefriends.org/download.html.
Install Apache and PHP (other bundled components may remain). MySQL is not used.
Windows example: install at C:\xampp, open XAMPP Control Panel and start Apache.
Extract workshop_access_lab under C:\xampp\htdocs\COMP2245.
The extracted folder directly contains public, storage and this README.
Visit http://localhost/COMP2245/workshop_access_lab/public/ including the final slash.
On macOS/Linux use your installation's htdocs, or the PHP-only option.

PHP-ONLY OPTION
In a terminal opened at this folder:
php -v
php -S localhost:8000 -t public
Keep the terminal open. Visit http://localhost:8000/.
For XAMPP's PHP in Windows PowerShell, use:
& "C:\xampp\php\php.exe" -S localhost:8000 -t public
Use 8001 in command and URL if 8000 is busy. Stop with Ctrl+C.
Do not double-click index.html. Do not put this lab over your Lab 1 or assignment files.

PRECHECK
Append api/accounts.php?group=learner to the chosen base URL. Expect a two-record JSON array.
Append api/levels.php?group=learner. Expect an array of code/name objects.
The starter opens, but completed storage/login/list behaviour requires its labelled gaps.
There are no Node.js dependencies, database setup, PHP editing or Apache rewrite rules.

FILES AND GAPS
public/js/data.js: A1-A3 guided requests; T1-T2 independent account storage.
public/js/access.js: L1-L2 guided login; R1-R2/G1-G2 guided session checks;
T3a-T3b independent session writing; T4a-T4b cookies; T5 sign-out; K1 recovery checkpoint.
public/js/app.js: M1-M4 guided lists; C1 creation-to-refresh connection checkpoint.
The Word guide distinguishes guided practice, independent code and supplied code to trace.

TEST ACCOUNTS
Learner W101 / Workshop8!; learner W102 / Repairer9!
Coach maya@example.org / CoachDesk8!; coach liam@example.org / GuideDesk9!
Coordinator rhea@example.org / CoordDesk8!; coordinator omar@example.org / FrontDesk9!
An identifier from one record with another record's password must fail.

STORAGE
localStorage keys: wslab2.learners, wslab2.coaches, wslab2.coordinators.
sessionStorage key: wslab2.session. Cookie: WorkshopAccessID.
These names keep lab data separate from the loandesk assignment.
Use one browser tab and one base URL throughout. Browser storage belongs to an origin:
switching hostname or port changes the browser storage area. Cookie Path=/ is shared
throughout localhost; this lab's distinct cookie name avoids the assignment's name.

TEST MODES
While signed in as coordinator, choose Normal, Empty, Failed request or Wrong data shape,
then open a list or use Refresh. Only the list response changes; login data is unaffected.
Practise refresh after creation saves nothing and includes no booking/POST implementation.
Its callback represents steps after another form has received a confirmed save.

RESET
Stop the server. Copy storage/seed-accounts.json over storage/accounts.json only if changed.
For a clean browser start, remove the three wslab2 account keys with localStorage.removeItem,
remove wslab2.session with sessionStorage.removeItem and delete WorkshopAccessID only.
Do not use storage.clear() or delete other applications' data.
Never reset data at ordinary page startup or sign-out.

TROUBLESHOOT
404: check the extracted folder and full URL. PHP displayed/downloaded: use a PHP server.
Apache busy: use the PHP-only option. No sign-in: complete A/T/L gaps; inspect Console.
Storage missing: use the same origin and await loadAccounts before reading.
Old code: save and hard-refresh (Ctrl+F5; Cmd+Shift+R on macOS).

Official setup: https://www.apachefriends.org/faq_windows.html
PHP server: https://www.php.net/manual/en/features.commandline.webserver.php

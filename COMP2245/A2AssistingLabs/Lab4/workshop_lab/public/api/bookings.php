<?php
// Supplied classroom service. Students do not edit PHP.
// Run with XAMPP Apache, or: php -S localhost:8000 -t public
header('Content-Type: application/json; charset=utf-8');
function reply($status, $value) {
    http_response_code($status);
    echo json_encode($value, JSON_UNESCAPED_SLASHES);
    exit;
}
$file = dirname(__DIR__, 2) . '/storage/bookings.json';
if (!is_dir(dirname($file))) reply(500, ['ok'=>false, 'message'=>'The storage folder is missing']);
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'GET' && $method !== 'POST') reply(405, ['ok'=>false, 'message'=>'Use GET or POST']);
// A short delay makes the loading message visible in a teaching demonstration.
usleep(400000);
$handle = fopen($file, 'c+');
if (!$handle || !flock($handle, LOCK_EX)) reply(500, ['ok'=>false, 'message'=>'Cannot open the booking file. Check folder permissions']);
$text = stream_get_contents($handle);
$records = $text === '' ? [] : json_decode($text, true);
if (!is_array($records)) reply(500, ['ok'=>false, 'message'=>'Booking data cannot be read. Restore the seed file']);
if ($method === 'GET') { flock($handle, LOCK_UN); fclose($handle); reply(200, $records); }
if (strpos($_SERVER['CONTENT_TYPE'] ?? '', 'application/x-www-form-urlencoded') !== 0) reply(415, ['ok'=>false, 'message'=>'Send URLSearchParams form data']);
if (array_key_exists('confirmPhrase', $_POST)) reply(400, ['ok'=>false, 'message'=>'Remove confirmPhrase before sending the form', 'field'=>'confirmPhrase']);
$required = ['formPurpose','participantType','bookingCode','displayName','email','passphrase','orientationDate','locationCode','trackCode','collectionPoint'];
foreach ($required as $field) {
    if (!isset($_POST[$field]) || !is_string($_POST[$field]) || trim($_POST[$field]) === '') reply(400, ['ok'=>false, 'message'=>'Missing field: '.$field, 'field'=>$field]);
}
$type = $_POST['participantType'];
if ($_POST['formPurpose'] !== 'workshop-booking' || !in_array($type, ['newcomer','returning'], true)) reply(400, ['ok'=>false, 'message'=>'Unknown participant type', 'field'=>'participantType']);
$email = strtolower($_POST['email']);
foreach ($records as $record) {
    if ($record['bookingCode'] === $_POST['bookingCode']) reply(409, ['ok'=>false, 'message'=>'Code is already used. Generate another code', 'field'=>'bookingCode']);
    if ($record['email'] === $email) reply(409, ['ok'=>false, 'message'=>'Email is already booked. Use another fictional email', 'field'=>'email']);
}
$locations = json_decode(file_get_contents(dirname(__DIR__).'/data/locations.json'), true);
$tracks = json_decode(file_get_contents(dirname(__DIR__).'/data/tracks.json'), true);
if (!in_array($_POST['locationCode'], array_column($locations,'code'), true)) reply(400, ['ok'=>false, 'message'=>'Choose a listed location','field'=>'locationCode']);
if (!in_array($_POST['trackCode'], array_column($tracks[$type],'code'), true)) reply(400, ['ok'=>false, 'message'=>'Choose a track for this participant type','field'=>'trackCode']);
if (!in_array($_POST['collectionPoint'], ['east','west'], true)) reply(400, ['ok'=>false, 'message'=>'Choose a collection point','field'=>'collectionPoint']);
$new = [];
foreach (['participantType','bookingCode','displayName','orientationDate','locationCode','trackCode','collectionPoint'] as $field) $new[$field] = $_POST[$field];
$new['email'] = $email;
$new['deliveryNote'] = isset($_POST['deliveryNote']) && is_string($_POST['deliveryNote']) ? $_POST['deliveryNote'] : '';
// The classroom passphrase is checked in JavaScript and discarded by this service.
$records[] = $new;
$encoded = json_encode($records, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
if ($encoded === false || !ftruncate($handle,0) || !rewind($handle) || fwrite($handle,$encoded) !== strlen($encoded)) reply(500, ['ok'=>false, 'message'=>'Could not save booking']);
fflush($handle); flock($handle, LOCK_UN); fclose($handle);
reply(201, ['ok'=>true,'message'=>'Booking saved','record'=>$new]);

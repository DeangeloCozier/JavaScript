<?php
// Supplied PHP. Students do not write or change the service.
header('Content-Type: application/json; charset=utf-8');
function send_reply($status, $data) { http_response_code($status); echo json_encode($data, JSON_UNESCAPED_SLASHES); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') send_reply(405, ['message'=>'This lab service reads data only']);
usleep(350000); // a real request delay makes the loading panel visible
$kind = $_GET['group'] ?? '';
if (!in_array($kind, ['learner','coach','coordinator'], true)) send_reply(400, ['message'=>'Unknown workshop role']);
function accounts($kind) {
    $data = json_decode(file_get_contents(dirname(__DIR__,2).'/storage/accounts.json'), true);
    if (!is_array($data) || !isset($data[$kind]) || !is_array($data[$kind])) send_reply(500, ['message'=>'Restore the account seed file']);
    return $data[$kind];
}

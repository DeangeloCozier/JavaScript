<?php
require __DIR__.'/common.php';
$data=json_decode(file_get_contents(dirname(__DIR__).'/data/levels.json'), true);
if (!isset($data[$kind]) || !is_array($data[$kind])) send_reply(400, ['message'=>'No levels for this role']);
send_reply(200, $data[$kind]);

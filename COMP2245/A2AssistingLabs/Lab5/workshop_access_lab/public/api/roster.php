<?php
require __DIR__.'/common.php';
if ($kind === 'coordinator') send_reply(400, ['message'=>'Choose learners or coaches']);
$case = $_GET['case'] ?? 'normal';
if ($case === 'error') send_reply(503, ['message'=>'Supplied test failure']);
if ($case === 'object') send_reply(200, ['message'=>'An object instead of an array']);
if ($case === 'empty') send_reply(200, []);
if ($case !== 'normal') send_reply(400, ['message'=>'Unknown test case']);
send_reply(200, accounts($kind));

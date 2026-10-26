<?php
/**
 * COMP2245 supplied Apache/PHP service for XAMPP (PHP 8 or later).
 * Fictional local classroom data; this is not an authentication server.
 * The assessed client validation algorithms are deliberately not included.
 */
declare(strict_types=1);
ini_set('display_errors', '0');

const DATASETS = ['borrower' => 'borrowers', 'technician' => 'technicians', 'manager' => 'managers'];
const ID_FIELDS = ['borrower' => 'studentId', 'technician' => 'technicianId', 'manager' => 'managerId'];

function respond(int $status, $value): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($value, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);
}

function readRecords(string $type): array
{
    $text = file_get_contents(__DIR__ . '/server_data/' . DATASETS[$type] . '.json');
    if ($text === false || substr(ltrim($text), 0, 1) !== '[') {
        throw new RuntimeException('Account file must contain a JSON array.');
    }
    $rows = json_decode($text, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($rows)) {
        throw new RuntimeException('Invalid account data.');
    }
    return $rows;
}

function registerRecord(string $type, array $input): array
{
    $idField = ID_FIELDS[$type];
    $required = [$idField, 'firstName', 'lastName', 'email', 'password', 'address1',
        'parishCode', 'enrollmentDate', 'levelCode', 'collectionPoint'];
    foreach ($required as $field) {
        if (!isset($input[$field]) || !is_string($input[$field]) || trim($input[$field]) === '') {
            return [400, ['ok' => false, 'message' => 'Missing required field: ' . $field, 'field' => $field]];
        }
    }
    $rows = readRecords($type);
    foreach (array_merge(readRecords('borrower'), readRecords('technician')) as $row) {
        if (($row['studentId'] ?? $row['technicianId'] ?? '') === $input[$idField]) {
            return [409, ['ok' => false, 'message' => 'ID already exists. Generate another ID.', 'field' => $idField]];
        }
    }
    foreach ($rows as $row) {
        if (strtolower($row['email']) === strtolower($input['email'])) {
            return [409, ['ok' => false, 'message' => 'Email already exists for this role.', 'field' => 'email']];
        }
    }
    $record = [];
    foreach ($required as $field) {
        $record[$field] = $input[$field];
    }
    $record['email'] = strtolower($record['email']);
    $record['address2'] = isset($input['address2']) && is_string($input['address2']) ? $input['address2'] : '';
    $rows[] = $record;
    $target = __DIR__ . '/server_data/' . DATASETS[$type] . '.json';
    $json = json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . "\n";
    if (file_put_contents($target . '.tmp', $json) === false || !rename($target . '.tmp', $target)) {
        throw new RuntimeException('Unable to write account data.');
    }
    return [201, ['ok' => true, 'message' => 'Registration successful.', 'record' => $record]];
}

function routeRequest(string $route, string $method): array
{
    if ($route === 'health') {
        return $method === 'GET' ? [200, ['ok' => true, 'service' => 'Campus Equipment Loan Desk PHP API']]
            : [405, ['ok' => false, 'message' => 'Method not allowed.']];
    }
    foreach (DATASETS as $type => $dataset) {
        if ($route === 'data/' . $dataset . '.json' || $route === $type . '/all') {
            return $method === 'GET' ? [200, readRecords($type)]
                : [405, ['ok' => false, 'message' => 'Method not allowed.']];
        }
    }
    if ($route === 'borrower/new' || $route === 'technician/new') {
        if ($method !== 'POST') {
            return [405, ['ok' => false, 'message' => 'Method not allowed.']];
        }
        $contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
        if ($contentType !== 'application/x-www-form-urlencoded') {
            return [415, ['ok' => false, 'message' => 'Use application/x-www-form-urlencoded.']];
        }
        if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) {
            return [413, ['ok' => false, 'message' => 'Request body too large.']];
        }
        return registerRecord(explode('/', $route)[0], $_POST);
    }
    return [404, ['ok' => false, 'message' => 'Endpoint not found.']];
}

try {
    // SCRIPT_NAME remains the PHP target after Apache's internal rewrite.
    // Derive the application prefix so no student must edit a server constant.
    $base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/') . '/';
    $path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '');
    $route = strpos($path, $base) === 0 ? trim(substr($path, strlen($base)), '/') : '';
    $method = $_SERVER['REQUEST_METHOD'];
    $directory = __DIR__ . '/server_data';
    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
        throw new RuntimeException('Unable to create server_data.');
    }
    $lock = fopen($directory . '/.records.lock', 'c');
    if ($lock === false || !flock($lock, LOCK_EX)) {
        throw new RuntimeException('Unable to lock account data.');
    }
    try {
        foreach (DATASETS as $dataset) {
            $target = $directory . '/' . $dataset . '.json';
            if (!file_exists($target) && !copy(__DIR__ . '/seed/' . $dataset . '.json', $target)) {
                throw new RuntimeException('Unable to initialize account data.');
            }
        }
        [$status, $value] = routeRequest($route, $method);
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
    // Optional observation delay applies to account GETs only, after unlocking.
    if ($method === 'GET' && $status === 200 && $route !== 'health') {
        $delay = isset($_GET['delay']) && is_numeric($_GET['delay']) ? (float) $_GET['delay'] : 0;
        usleep((int) (min(2000, max(0, $delay)) * 1000));
    }
    respond($status, $value);
} catch (Throwable $error) {
    error_log('Loan Desk API: ' . $error->getMessage());
    respond(500, ['ok' => false, 'message' => 'Service error. Check the Apache error log and server_data write access.']);
}

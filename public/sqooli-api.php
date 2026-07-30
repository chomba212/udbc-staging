<?php
// Same-origin relay for the Sqooli API. This is required because the upstream
// service does not return Access-Control-Allow-Origin for browser requests.
declare(strict_types=1);

$path = $_GET['path'] ?? '';
if (!is_string($path) || !preg_match('#^/Enrollment(?:/.*)?$#', $path)) {
    http_response_code(400);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Invalid Sqooli API path.']);
    exit;
}

$query = $_GET;
unset($query['path']);
$url = 'https://api.antodb.com/api' . $path;
if ($query) {
    $url .= '?' . http_build_query($query);
}

$curl = curl_init($url);
curl_setopt_array($curl, [
    CURLOPT_CUSTOMREQUEST => $_SERVER['REQUEST_METHOD'] ?? 'GET',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HEADER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'Content-Type: ' . ($_SERVER['CONTENT_TYPE'] ?? 'application/json'),
    ],
]);

if (in_array($_SERVER['REQUEST_METHOD'] ?? 'GET', ['POST', 'PUT', 'PATCH'], true)) {
    curl_setopt($curl, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

$response = curl_exec($curl);
if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Unable to reach the Sqooli API.']);
    exit;
}

$status = curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
$headerSize = curl_getinfo($curl, CURLINFO_HEADER_SIZE);
$body = substr($response, $headerSize);
curl_close($curl);

http_response_code($status ?: 502);
header('Content-Type: application/json');
echo $body;

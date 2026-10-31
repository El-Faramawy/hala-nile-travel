<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'طريقة الطلب غير مسموح بها']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$name = trim($input['name'] ?? '');
$phone = trim($input['phone'] ?? '');
$job = trim($input['job'] ?? 'طلب توظيف عام');
$age = trim($input['age'] ?? '');
$gov = trim($input['gov'] ?? '');
$passport = trim($input['passport'] ?? '');
$notes = trim($input['notes'] ?? '');

if (empty($name) || empty($phone)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'يرجى كتابة الاسم ورقم الهاتف للمتابعة']);
    exit;
}

$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}

$refId = 'HS-' . rand(100000, 999999);
$applyEntry = [
    'code' => $refId,
    'name' => htmlspecialchars($name),
    'phone' => htmlspecialchars($phone),
    'job' => htmlspecialchars($job),
    'age' => htmlspecialchars($age),
    'gov' => htmlspecialchars($gov),
    'passport_status' => htmlspecialchars($passport),
    'notes' => htmlspecialchars($notes),
    'submitted_at' => date('Y-m-d H:i:s'),
    'status' => 'قيد المراجعة الأولية'
];

$file = $dataDir . '/applications.json';
$existing = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
if (!is_array($existing)) $existing = [];
array_unshift($existing, $applyEntry);
file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode([
    'status' => 'success',
    'message' => "تم استلام طلب التقديم بنجاح يا $name!",
    'code' => $refId,
    'note' => 'سيتواصل معك مسؤول التوظيف بإيطاليا خلال 24 ساعة عبر الهاتف والواتساب لتحديد موعد المقابلة.'
]);


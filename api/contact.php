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
$subject = trim($input['subject'] ?? 'استفسار عام');
$gov = trim($input['gov'] ?? 'غير محدد');
$message = trim($input['message'] ?? '');

if (empty($name) || empty($phone) || empty($message)) {
    http_response_code(422);
    echo json_encode(['status' => 'error', 'message' => 'يرجى ملء جميع الحقول المطلوبة (الاسم، الهاتف، الرسالة)']);
    exit;
}

$dataDir = __DIR__ . '/../data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0777, true);
}

$contactEntry = [
    'id' => 'MSG-' . date('Ymd-His') . '-' . rand(100, 999),
    'name' => htmlspecialchars($name),
    'phone' => htmlspecialchars($phone),
    'subject' => htmlspecialchars($subject),
    'gov' => htmlspecialchars($gov),
    'message' => htmlspecialchars($message),
    'date' => date('Y-m-d H:i:s'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

$file = $dataDir . '/contacts.json';
$existing = file_exists($file) ? json_decode(file_get_contents($file), true) : [];
if (!is_array($existing)) $existing = [];
array_unshift($existing, $contactEntry);
file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode([
    'status' => 'success',
    'message' => "شكراً لك يا $name، تم استلام استفسارك بنجاح وسيتواصل معك مستشار شركة هلا الشرق خلال أقرب وقت.",
    'reference_id' => $contactEntry['id']
]);


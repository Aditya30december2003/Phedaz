<?php
require __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception as PHPMailerException;

// Allow only requests from your domain
header("Access-Control-Allow-Origin: https://phedaz.com");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Content-Type: application/json");

// Avoid premature output
ob_start();

// Response shell
$response = ['success' => false, 'message' => ''];

// Rate limiting
$rateLimitFile = __DIR__ . '/rate_limit.txt';
$rateLimitPeriod = 3600;
$maxRequests = 5;

// Error/exception handling
set_error_handler(function ($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});
set_exception_handler(function ($e) {
    if (ob_get_level()) ob_clean();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST requests are allowed");
    }

    // Get IP address
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (strpos($ip, ',') !== false) $ip = trim(explode(',', $ip)[0]);

    // Check rate limiting
    $rateData = file_exists($rateLimitFile) ? json_decode(file_get_contents($rateLimitFile), true) : [];
    if (isset($rateData[$ip]) && time() - $rateData[$ip]['timestamp'] < $rateLimitPeriod) {
        if ($rateData[$ip]['count'] >= $maxRequests) {
            throw new Exception("Too many submissions from this IP. Try again later.");
        }
    }

    // Get and decode JSON
    $rawData = file_get_contents("php://input");
    if (!$rawData) throw new Exception("Empty request body");
    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON: " . json_last_error_msg());
    }

    // Honeypot check
    if (!empty($data['website'])) {
        echo json_encode(['success' => true, 'message' => 'Thank you for joining our waitlist!']);
        exit;
    }

    // Time bot check
    $now = time();
    $submitTime = isset($data['timestamp']) ? floor($data['timestamp'] / 1000) : $now;
    if ($now - $submitTime < 3) {
        echo json_encode(['success' => true, 'message' => 'Thank you for joining our waitlist!']);
        exit;
    }

    // Required fields
    $required = ['firstName', 'lastName', 'email', 'country', 'telephone'];
    foreach ($required as $field) {
        if (empty($data[$field]) || !trim($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    // Validate email
    $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Setup PHPMailer
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.forwardemail.net';
    $mail->SMTPAuth = true;
    $mail->Username = 'webform@phedaz.ng';
    $mail->Password = 'vybqiT-7sapta-kumP?uk+)';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->Timeout = 10;

    $mail->setFrom('webform@phedaz.ng', 'Phedaz Waitlist');
    $mail->addAddress('leo10demigod@gmail.com');
    $mail->addReplyTo($email, $data['firstName'] . ' ' . $data['lastName']);

    // Format email body
    $fullName = $data['firstName'] . ' ' . $data['lastName'];
    $mail->Subject = 'New Waitlist Signup: ' . substr($fullName, 0, 50);

    $body = "<h2>New Waitlist Submission</h2><table>";
    foreach ($data as $key => $value) {
        if (in_array($key, ['website', 'timestamp', '_security'])) continue;
        $label = ucwords(preg_replace('/(?<!^)([A-Z])/', ' $1', $key));
        $body .= "<tr><td><strong>$label</strong></td><td>" . htmlspecialchars($value) . "</td></tr>";
    }
    $body .= "</table><hr><h3>Security Info</h3><table>";
    $body .= "<tr><td>IP</td><td>" . htmlspecialchars($ip) . "</td></tr>";
    $body .= "<tr><td>User Agent</td><td>" . htmlspecialchars($data['_security']['userAgent'] ?? 'Unknown') . "</td></tr>";
    $body .= "<tr><td>Time on Page</td><td>" . round(($data['_security']['timeOnPage'] ?? 0) / 1000) . " sec</td></tr>";
    $body .= "<tr><td>Screen Res</td><td>" . htmlspecialchars($data['_security']['screenResolution'] ?? 'Unknown') . "</td></tr>";
    $body .= "<tr><td>Referrer</td><td>" . htmlspecialchars($data['_security']['referrer'] ?? 'Unknown') . "</td></tr>";
    $body .= "</table>";

    $mail->isHTML(true);
    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);

    // Send the email
    $mail->send();

    // Save rate data
    $rateData[$ip] = [
        'count' => ($rateData[$ip]['count'] ?? 0) + 1,
        'timestamp' => time()
    ];
    file_put_contents($rateLimitFile, json_encode($rateData), LOCK_EX);

    $response = ['success' => true, 'message' => 'Thank you for joining our waitlist! We will be in touch soon.'];

} catch (Exception $e) {
    error_log("Waitlist submission error: " . $e->getMessage());
    $response = ['success' => false, 'message' => $e->getMessage()];
    http_response_code(500);
}

// Final clean output
if (ob_get_level()) ob_clean();
echo json_encode($response);
exit;

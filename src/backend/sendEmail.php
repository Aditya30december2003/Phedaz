<?php
// Enhanced error reporting
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
ini_set('display_errors', 0); // Set to 1 during dev if needed
error_reporting(E_ALL);

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Only POST requests allowed']);
    exit;
}

try {
    $rawData = file_get_contents("php://input");
    file_put_contents(__DIR__ . '/input_debug.log', $rawData); // Optional logging

    if ($rawData === false) {
        throw new Exception("Failed to read input data");
    }

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON: " . json_last_error_msg());
    }

    // Required fields
    $required = ['name', 'email'];
    foreach ($required as $field) {
        if (empty($data[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Load PHPMailer
    require 'vendor/autoload.php';
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    // SMTP config
    $mail->isSMTP();
    $mail->Host = 'smtp.forwardemail.net';
    $mail->SMTPAuth = true;
    $mail->Username = 'webform@office.phedaz.com'; // Use correct SMTP username
    $mail->Password = 'ryhwuw-dyGkyr7>9?mapku8';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->Timeout = 10;

    // Email setup
    $mail->setFrom('webform@office.phedaz.com', 'Phedaz Website');
    $mail->addAddress('test-ton1eycfy@srv1.mail-tester.com');
    $mail->addReplyTo($data['email'], $data['name']);
    $mail->Subject = 'New Inquiry: ' . ($data['businessName'] ?? $data['name']);

    // Body formatting with better array handling
    $body = "New submission details:\n\n";
    foreach ($data as $key => $value) {
        $prettyKey = ucfirst(str_replace('_', ' ', $key));
        if (is_array($value)) {
            // Convert array to readable format
            $valueString = implode(', ', array_map(function ($v) {
                return is_array($v) ? json_encode($v) : $v;
            }, $value));
            $body .= "$prettyKey: $valueString\n";
        } else {
            $body .= "$prettyKey: $value\n";
        }
    }
    $body .= "\nIP: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $body .= "Time: " . date('Y-m-d H:i:s');

    $mail->Body = $body;
    $mail->isHTML(false);

    // Send it
    $mail->send();

    // Log success
    file_put_contents(
        __DIR__ . '/submissions.log',
        date('c') . " | " . $data['email'] . " | " . $_SERVER['REMOTE_ADDR'] . "\n",
        FILE_APPEND
    );

    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your submission has been received.'
    ]);

} catch (Exception $e) {
    error_log("ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Submission failed',
        'error' => $e->getMessage() // Optional: remove in production
    ]);
}

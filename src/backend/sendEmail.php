<?php
// Enhanced error reporting
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
ini_set('display_errors', 0); // Set to 0 in production

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// If it's a preflight OPTIONS request, just return success
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Capture debug output instead of outputting it directly
ob_start();

try {
    // Get raw JSON data
    $rawData = file_get_contents("php://input");
    $data = json_decode($rawData, true);
    
    // if (json_last_error() !== JSON_ERROR_NONE) {
    //     throw new Exception("Invalid JSON data received: " . json_last_error_msg());
    // }
    
    // if (empty($data)) {
    //     throw new Exception("No form data received");
    // }
    
    // Load PHPMailer
    require __DIR__ . '/vendor/autoload.php';
    date_default_timezone_set('UTC');
    
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    // Store debug output in a separate variable instead of echoing it
    $debugOutput = "";
    $mail->SMTPDebug = 2; // More reasonable debug level
    $mail->Debugoutput = function($str, $level) use (&$debugOutput) {
        $log = date('Y-m-d H:i:s') . " [L$level]: " . trim($str) . "\n";
        file_put_contents('smtp_debug.log', $log, FILE_APPEND);
        $debugOutput .= $log; // Collect debug output but don't echo it
    };

    // SMTP Configuration
    $mail->isSMTP();
    $mail->Host = 'smtp.forwardemail.net';
    $mail->SMTPAuth = true;
    $mail->AuthType = 'LOGIN';
    $mail->Username = 'webform@phedaz.ng';
    $mail->Password = 'vybqiT-7sapta-kumP?uk+)';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->Timeout = 15;

    // Email content
    $mail->setFrom('webform@phedaz.ng', 'Phedaz Webform');
    $mail->addAddress('websupport@mailing.phedaz.com');
    $mail->Subject = 'New Form Submission ' . date('Y-m-d H:i:s');

    // Format email body
    $body = "<h1>New Form Submission</h1>";
    foreach ($data as $key => $value) {
        $prettyKey = ucwords(str_replace('_', ' ', $key));
        $body .= "<p><strong>{$prettyKey}:</strong> " . 
                (is_array($value) ? implode(', ', $value) : htmlspecialchars($value)) . "</p>";
    }

    $mail->isHTML(true);
    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);

    if (!$mail->send()) {
        throw new Exception('Send failed: ' . $mail->ErrorInfo);
    }

    // Log success for monitoring
    file_put_contents('success.log', date('Y-m-d H:i:s') . " Email sent successfully\n", FILE_APPEND);
    
    // Discard the buffered debug output
    ob_end_clean();
    
    // Return clean JSON response
    echo json_encode([
        'success' => true, 
        'message' => 'Email sent successfully'
    ]);

} catch (Exception $e) {
    // Discard the buffered debug output
    ob_end_clean();
    
    // Log the error
    $errorMsg = date('Y-m-d H:i:s') . " Error: " . $e->getMessage() . "\n";
    file_put_contents('error.log', $errorMsg, FILE_APPEND);
    
    // Return clean JSON error response
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send submission',
        'error' => $e->getMessage()
    ]);
}
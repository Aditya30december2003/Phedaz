<?php
// joinList.php - Enhanced with comprehensive bot protection
require __DIR__ . '/vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

// Initialize response
$response = ['success' => false, 'message' => ''];

// Rate limiting setup (using simple file-based approach)
$rateLimitFile = __DIR__ . '/rate_limit.txt';
$rateLimitPeriod = 3600; // 1 hour
$maxRequests = 5; // Max submissions per IP per hour

try {
    // 1. Get client IP
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // 2. Check rate limit
    if (file_exists($rateLimitFile)) {
        $rateData = json_decode(file_get_contents($rateLimitFile), true);
        if ($rateData && isset($rateData[$ip])) {
            if ($rateData[$ip]['count'] >= $maxRequests && 
                (time() - $rateData[$ip]['timestamp']) < $rateLimitPeriod) {
                throw new Exception("Too many submissions. Please try again later.");
            }
        }
    }
    
    // 3. Get and validate input
    $rawData = file_get_contents("php://input");
    if (empty($rawData)) {
        throw new Exception("No submission data received");
    }

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data");
    }

    // 4. Security checks
    // Honeypot check
    if (!empty($data['website'])) {
        error_log("Bot detected via honeypot - IP: $ip");
        echo json_encode(['success' => true, 'message' => 'Thank you for joining our waitlist!']);
        exit;
    }
    
    // Time-based check (submission too fast)
    $currentTime = time();
    $submitTime = $data['timestamp'] / 1000; // Convert from milliseconds
    if (($currentTime - $submitTime) < 3) { // Less than 3 seconds
        error_log("Fast submission detected - IP: $ip - Time: " . ($currentTime - $submitTime) . "s");
        echo json_encode(['success' => true, 'message' => 'Thank you for joining our waitlist!']);
        exit;
    }
    
    // Check for AJAX header
    if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || 
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        error_log("Non-AJAX submission - IP: $ip");
        throw new Exception("Invalid request method");
    }
    
    // Validate required fields
    $requiredFields = ['firstName', 'lastName', 'email', 'country', 'telephone'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Required field '$field' is missing");
        }
    }
    
    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // 5. Configure PHPMailer (Production SMTP)
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = 'smtp.forwardemail.net';
    $mail->SMTPAuth = true;
    $mail->Username = 'webform@phedaz.ng';
    $mail->Password = 'vybqiT-7sapta-kumP?uk+)';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->SMTPDebug = 0; // Disable debug in production

    // 6. Build waitlist notification email
    $mail->setFrom('webform@phedaz.ng', 'Phedaz Waitlist');
    $mail->addAddress('websupport@mailing.phedaz.com');
    $mail->addReplyTo($data['email'], $data['firstName'] . ' ' . $data['lastName']);
    
    $mail->Subject = 'New Waitlist Signup: ' . substr($data['firstName'] . ' ' . $data['lastName'], 0, 50);

    $body = "<h1>New Waitlist Submission</h1>";
    foreach ($data as $key => $value) {
        // Skip security and honeypot fields
        if ($key === '_security' || $key === 'website' || $key === 'timestamp') continue;
        
        $body .= "<p><strong>" . htmlspecialchars(ucfirst($key)) . ":</strong> " . 
               htmlspecialchars(is_array($value) ? implode(', ', $value) : $value) . "</p>";
    }
    
    // Add security info
    $body .= "<h2>Security Info</h2>";
    $body .= "<p><strong>IP Address:</strong> " . htmlspecialchars($ip) . "</p>";
    $body .= "<p><strong>User Agent:</strong> " . htmlspecialchars($data['_security']['userAgent'] ?? 'Unknown') . "</p>";
    $body .= "<p><strong>Time on Page:</strong> " . htmlspecialchars(round(($data['_security']['timeOnPage'] ?? 0) / 1000)) . " seconds</p>";
    
    $mail->isHTML(true);
    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);

    // 7. Send email
    if ($mail->send()) {
        // Update rate limit
        $rateData = file_exists($rateLimitFile) ? json_decode(file_get_contents($rateLimitFile), true) : [];
        $rateData[$ip] = [
            'count' => ($rateData[$ip]['count'] ?? 0) + 1,
            'timestamp' => time()
        ];
        file_put_contents($rateLimitFile, json_encode($rateData));
        
        $response = [
            'success' => true,
            'message' => 'Thank you for joining our waitlist!'
        ];
    } else {
        throw new Exception("Email sending failed");
    }

} catch (Exception $e) {
    error_log("Waitlist Error [" . ($ip ?? 'unknown') . "]: " . $e->getMessage());
    $response['message'] = $e->getMessage();
    http_response_code(400); // Bad request
}

echo json_encode($response);
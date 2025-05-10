<?php
// Enhanced security and error handling
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');
ini_set('display_errors', 0);

// Security headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");
header("Content-Type: application/json");

// Debug mode - change to false in production
$debug = true;

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
    http_response_code(200);
    exit;
}

// Rate limiting setup
$rateLimitFile = __DIR__ . '/rate_limit.txt';
$rateLimitPeriod = 3600; // 1 hour
$maxRequests = 5; // Max submissions per IP per hour

try {
    // Get client IP
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $ip = is_array($ip) ? $ip[0] : $ip; // Handle multiple IPs in X-Forwarded-For
    
    // Debug log
    if ($debug) {
        error_log("New form submission from IP: $ip");
    }
    
    // Check rate limit
    if (file_exists($rateLimitFile)) {
        $rateData = json_decode(file_get_contents($rateLimitFile), true);
        if ($rateData && isset($rateData[$ip])) {
            if ($rateData[$ip]['count'] >= $maxRequests && 
                (time() - $rateData[$ip]['timestamp']) < $rateLimitPeriod) {
                throw new Exception("Too many submissions. Please try again later.");
            }
        }
    }
    
    // Get and validate input
    $rawData = file_get_contents("php://input");
    if (empty($rawData)) {
        throw new Exception("No submission data received");
    }

    if ($debug) {
        error_log("Raw form data: " . $rawData);
    }

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data: " . json_last_error_msg());
    }

    // Security checks
    // 1. Check for AJAX header
    if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || 
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
        throw new Exception("Invalid request method");
    }
    
    // 2. Honeypot check
    if (!empty($data['company_website'])) {
        error_log("Bot detected via honeypot - IP: $ip");
        echo json_encode(['success' => true, 'message' => 'Thank you for your submission!']);
        exit;
    }
    
    // 3. Time-based check (submission too fast)
    $submitTime = isset($data['_security']) && isset($data['_security']['timeOnPage']) ? $data['_security']['timeOnPage'] : 0;
    if ($submitTime < 5000) { // Less than 5 seconds
        error_log("Fast submission detected - IP: $ip - Time: " . ($submitTime/1000) . "s");
        echo json_encode(['success' => true, 'message' => 'Thank you for your submission!']);
        exit;
    }

    // 4. Cloudflare Turnstile verification
    $turnstileSecret = '0x4AAAAAABb2cULCe0gPCyMhrhwTW8xZPgQ'; // Replace with your actual secret key
    $turnstileResponse = $data['cfTurnstileResponse'] ?? '';

    if ($debug) {
        error_log("Turnstile response: " . ($turnstileResponse ? 'Present' : 'Missing'));
    }

    if (empty($turnstileResponse)) {
        throw new Exception("CAPTCHA verification failed - missing response token");
    }

    // Verify with Cloudflare
    $url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    $postData = [
        'secret' => $turnstileSecret,
        'response' => $turnstileResponse,
        'remoteip' => $ip
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    
    if ($response === false) {
        $error = curl_error($ch);
        curl_close($ch);
        throw new Exception("CAPTCHA verification request failed: $error");
    }
    
    curl_close($ch);

    $result = json_decode($response, true);
    if ($debug) {
        error_log("Turnstile verification response: " . json_encode($result));
    }
    
    if (!$result || !isset($result['success']) || $result['success'] !== true) {
        $errorCodes = isset($result['error-codes']) ? implode(', ', $result['error-codes']) : 'unknown';
        error_log("Turnstile verification failed for IP: $ip. Error codes: $errorCodes");
        throw new Exception("CAPTCHA verification failed. Please try again. (Error: $errorCodes)");
    }
    
    // Validate required fields
    $requiredFields = ['name', 'email', 'businessName', 'phone', 'country'];
    $missingFields = [];
    
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            $missingFields[] = $field;
        }
    }
    
    if (!empty($missingFields)) {
        throw new Exception("Required fields missing: " . implode(', ', $missingFields));
    }
    
    // Validate email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Load PHPMailer
    require __DIR__ . '/vendor/autoload.php';
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);

    try {
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.forwardemail.net';
        $mail->SMTPAuth = true;
        $mail->Username = 'webform@phedaz.ng';
        $mail->Password = 'vybqiT-7sapta-kumP?uk+)';
        $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->Timeout = 15;

        // Email content
        $mail->setFrom('webform@phedaz.ng', 'Phedaz Webform');
        $mail->addAddress('websupport@mailing.phedaz.com');
        $mail->Subject = $data['emailSubject'] ?? 'New Form Submission ' . date('Y-m-d H:i:s');

        // Format email body with security info
        $body = "<h1>New Form Submission</h1>";
        foreach ($data as $key => $value) {
            if ($key === '_security' || $key === 'emailSubject' || $key === 'cfTurnstileResponse') continue;
            
            $prettyKey = ucwords(str_replace('_', ' ', $key));
            
            if (is_array($value)) {
                $formattedValue = implode(', ', $value);
            } else {
                $formattedValue = htmlspecialchars($value ?? '');
            }
            
            if ($key === 'maxPrice' && is_numeric($value)) {
                $formattedValue = '£' . $value;
            } elseif ($key === 'annualPlanLikelihood' && is_numeric($value)) {
                $formattedValue = $value . '/5';
            }
            
            $body .= "<p><strong>{$prettyKey}:</strong> {$formattedValue}</p>";
        }

        // Add security info
        $body .= "<h2>Security Info</h2>";
        $body .= "<p><strong>IP Address:</strong> " . htmlspecialchars($ip) . "</p>";
        
        if (isset($data['_security'])) {
            $body .= "<p><strong>User Agent:</strong> " . htmlspecialchars($data['_security']['userAgent'] ?? 'Unknown') . "</p>";
            $body .= "<p><strong>Time on Page:</strong> " . htmlspecialchars(round(($data['_security']['timeOnPage'] ?? 0) / 1000)) . " seconds</p>";
            $body .= "<p><strong>Referrer:</strong> " . htmlspecialchars($data['_security']['referrer'] ?? 'Unknown') . "</p>";
        }
        
        $body .= "<p><strong>CAPTCHA Verification:</strong> Success</p>";
        
        $mail->isHTML(true);
        $mail->Body = $body;
        $mail->AltBody = strip_tags($body);

        // Send email
        if (!$mail->send()) {
            throw new Exception('Mail send failed: ' . $mail->ErrorInfo);
        }
    } catch (Exception $e) {
        throw new Exception('Mail configuration error: ' . $e->getMessage());
    }

    // Update rate limit
    $rateData = file_exists($rateLimitFile) ? json_decode(file_get_contents($rateLimitFile), true) : [];
    if (!is_array($rateData)) $rateData = [];
    
    $rateData[$ip] = [
        'count' => ($rateData[$ip]['count'] ?? 0) + 1,
        'timestamp' => time()
    ];
    file_put_contents($rateLimitFile, json_encode($rateData));
    
    // Success response
    echo json_encode([
        'success' => true, 
        'message' => 'Email sent successfully'
    ]);

} catch (Exception $e) {
    error_log("Form Error [" . ($ip ?? 'unknown') . "]: " . $e->getMessage());
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send submission: ' . $e->getMessage(),
        'error' => $e->getMessage()
    ]);
}
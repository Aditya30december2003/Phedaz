<?php
require __DIR__ . '/vendor/autoload.php';

// Set headers first, before any output
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: https://phedaz.com");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With");

// Prevent any accidental output
ob_start();

// Initialize response
$response = ['success' => false, 'message' => ''];

// Rate limiting setup
$rateLimitFile = __DIR__ . '/rate_limit.txt';
$rateLimitPeriod = 3600;
$maxRequests = 5;

// Custom error handlers that don't output directly
set_error_handler(function($severity, $message, $file, $line) {
    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(function($e) {
    // Clean any previous output
    if (ob_get_level()) ob_clean();
    
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
    exit;
});

try {
    // Ensure this is a POST request
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception("Only POST requests are allowed");
    }
    
    // Get client IP with better detection
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['HTTP_X_REAL_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (strpos($ip, ',') !== false) {
        $ip = trim(explode(',', $ip)[0]);
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

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data: " . json_last_error_msg());
    }

    // Security checks - return fake success for bots (don't throw exception)
    if (!empty($data['website'])) {
        error_log("Bot detected via honeypot - IP: $ip");
        // Clean output buffer and return fake success
        if (ob_get_level()) ob_clean();
        echo json_encode(['success' => true, 'message' => 'Thank you for joining our waitlist!']);
        exit;
    }
    
    $currentTime = time();
    $submitTime = isset($data['timestamp']) ? $data['timestamp'] / 1000 : $currentTime;
    if (($currentTime - $submitTime) < 3) {
        error_log("Fast submission detected - IP: $ip");
        // Clean output buffer and return fake success
        if (ob_get_level()) ob_clean();
        echo json_encode(['success' => true, 'message' => 'Thank you for joining our waitlist!']);
        exit;
    }
    
    // More lenient AJAX check since Appwrite might not send this header
    // if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || 
    //     strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
    //     throw new Exception("Invalid request method");
    // }
    
    // Validate required fields
    $requiredFields = ['firstName', 'lastName', 'email', 'country', 'telephone'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field]) || trim($data[$field]) === '') {
            throw new Exception("Required field '$field' is missing or empty");
        }
    }
    
    // Sanitize and validate email
    $email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }

    // Import PHPMailer classes
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception as PHPMailerException;

    // Configure PHPMailer
    $mail = new PHPMailer(true);
    
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.forwardemail.net';
        $mail->SMTPAuth = true;
        $mail->Username = 'webform@phedaz.ng';
        $mail->Password = 'vybqiT-7sapta-kumP?uk+)';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->SMTPDebug = 0; // Set to 2 for debugging
        $mail->Timeout = 10; // 10 second timeout

        // Recipients
        $mail->setFrom('webform@phedaz.ng', 'Phedaz Waitlist');
        $mail->addAddress('leo10demigod@gmail.com');
        $mail->addReplyTo($email, trim($data['firstName']) . ' ' . trim($data['lastName']));
        
        // Subject with length limit
        $fullName = trim($data['firstName']) . ' ' . trim($data['lastName']);
        $mail->Subject = 'New Waitlist Signup: ' . substr($fullName, 0, 50);

        // Build email body
        $body = "<h1>New Waitlist Submission</h1>";
        $body .= "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>";
        
        foreach ($data as $key => $value) {
            if (in_array($key, ['_security', 'website', 'timestamp'])) continue;
            
            $displayKey = ucwords(str_replace(['_', 'camelCase'], [' ', ' '], $key));
            $displayValue = '';
            
            if (is_array($value)) {
                $displayValue = implode(', ', array_filter($value));
            } elseif (is_bool($value)) {
                $displayValue = $value ? 'Yes' : 'No';
            } else {
                $displayValue = htmlspecialchars(trim($value));
            }
            
            $body .= "<tr><td><strong>" . htmlspecialchars($displayKey) . "</strong></td>";
            $body .= "<td>" . $displayValue . "</td></tr>";
        }
        $body .= "</table>";
        
        // Security info
        $body .= "<h2>Security Information</h2>";
        $body .= "<table border='1' cellpadding='5' cellspacing='0' style='border-collapse: collapse;'>";
        $body .= "<tr><td><strong>IP Address</strong></td><td>" . htmlspecialchars($ip) . "</td></tr>";
        $body .= "<tr><td><strong>User Agent</strong></td><td>" . htmlspecialchars($data['_security']['userAgent'] ?? 'Unknown') . "</td></tr>";
        $body .= "<tr><td><strong>Time on Page</strong></td><td>" . htmlspecialchars(round(($data['_security']['timeOnPage'] ?? 0) / 1000)) . " seconds</td></tr>";
        $body .= "<tr><td><strong>Screen Resolution</strong></td><td>" . htmlspecialchars($data['_security']['screenResolution'] ?? 'Unknown') . "</td></tr>";
        $body .= "<tr><td><strong>Referrer</strong></td><td>" . htmlspecialchars($data['_security']['referrer'] ?? 'Direct') . "</td></tr>";
        $body .= "</table>";
        
        $mail->isHTML(true);
        $mail->Body = $body;
        $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $body));

        // Send email
        if ($mail->send()) {
            // Update rate limit
            $rateData = file_exists($rateLimitFile) ? json_decode(file_get_contents($rateLimitFile), true) : [];
            if (!is_array($rateData)) $rateData = [];
            
            $rateData[$ip] = [
                'count' => ($rateData[$ip]['count'] ?? 0) + 1,
                'timestamp' => time()
            ];
            
            // Ensure rate limit file is writable
            if (is_writable(dirname($rateLimitFile))) {
                file_put_contents($rateLimitFile, json_encode($rateData), LOCK_EX);
            }
            
            $response = [
                'success' => true,
                'message' => 'Thank you for joining our waitlist! We will be in touch soon.'
            ];
        } else {
            throw new Exception("Email could not be sent");
        }
        
    } catch (PHPMailerException $e) {
        error_log("PHPMailer Error: " . $e->getMessage());
        throw new Exception("Email service temporarily unavailable. Please try again later.");
    }

} catch (Exception $e) {
    error_log("Waitlist Error [" . ($ip ?? 'unknown') . "]: " . $e->getMessage());
    $response = [
        'success' => false, 
        'message' => $e->getMessage()
    ];
    http_response_code(400);
}

// Clean any previous output and send JSON response
if (ob_get_level()) ob_clean();
echo json_encode($response);
exit;
?>
<?php
// Enable error logging
ini_set('log_errors', 1);
ini_set('error_log', 'php_error.log');
error_log("===== Form submission started =====");

// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    error_log("Request method not POST: " . $_SERVER["REQUEST_METHOD"]);
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed."]);
    exit;
}

// Read raw input
$rawData = file_get_contents("php://input");
error_log("Raw input: $rawData");

$data = json_decode($rawData, true);

if (!$data) {
    error_log("Failed to decode JSON.");
    echo json_encode(["success" => false, "message" => "Invalid JSON received."]);
    exit;
}

// Extract fields
$name = $data["name"] ?? "";
$email = $data["email"] ?? "";
$message = $data["message"] ?? "";
$phone = $data["phone"] ?? "";
$goals = $data["goals"] ?? [];
$price = $data["priceRange"] ?? "";
$country = $data["country"] ?? "";

error_log("Decoded data: " . print_r($data, true));

// Save to file
$fileData = "Name: $name\nEmail: $email\nPhone: $phone\nCountry: $country\nGoals: " . implode(", ", $goals) . "\nPrice Range: $price\nMessage: $message\n\n";
file_put_contents("form_submissions.txt", $fileData, FILE_APPEND);

// Prepare email
// Replace with your company email address
$to = "your-company-email@phedaz.com"; 

// You can also set this to test-3k3j2hfo4@srv1.mail-tester.com for testing
// $to = "test-3k3j2hfo4@srv1.mail-tester.com";

$subject = "New Contact Form Submission";

// Important: Set a consistent From address that uses your domain
$headers = "From: Phedaz <noreply@phedaz.com>\r\n";
$headers .= "Return-Path: bounce@phedaz.com\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

// Format goals properly
$goalsStr = implode(", ", $goals);
$body = <<<EOD
You received a new contact form submission:

Name: $name
Email: $email
Phone: $phone
Country: $country
Goals: $goalsStr
Price Range: $price

Message:
$message
EOD;

error_log("Sending email to $to...");
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    error_log("Email sent successfully.");
    echo json_encode(["success" => true, "message" => "Your message has been sent successfully. We'll get back to you soon!"]);
} else {
    error_log("Failed to send email.");
    echo json_encode(["success" => false, "message" => "Failed to send your message. Please try again later or contact us directly."]);
}
?>
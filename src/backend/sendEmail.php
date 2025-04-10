<?php
// Enable CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON received."]);
    exit;
}

$name = $data["name"] ?? "";
$email = $data["email"] ?? "";
$message = $data["message"] ?? "";
$phone = $data["phone"] ?? "";
$goals = $data["goals"] ?? [];
$price = $data["priceRange"] ?? "";
$country = $data["country"] ?? "";

// Save to a local file (optional but useful)
$fileData = "Name: $name\nEmail: $email\nPhone: $phone\nCountry: $country\nGoals: " . implode(", ", $goals) . "\nPrice Range: $price\nMessage: $message\n\n";
file_put_contents("form_submissions.txt", $fileData, FILE_APPEND);

// Prepare email
$to = "adityasmjain@gmail.com"; // 👈 Change to your actual email
$subject = "New Form Submission";
$headers = "From: noreply@yourdomain.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$body = <<<EOD
You received a new form submission:

Name: $name
Email: $email
Phone: $phone
Country: $country
Goals: {implode(", ", $goals)}
Price Range: $price
Message: $message
EOD;

// Send email
$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(["success" => true, "message" => "Email sent successfully."]);
} else {
    echo json_encode(["success" => false, "message" => "Email failed to send."]);
}
?>

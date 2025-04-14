<?php
// waitlist_submission.php - PRODUCTION CODE
require __DIR__ . '/vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$response = ['success' => false, 'message' => ''];
$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
    // 1. Get and validate input
    $rawData = file_get_contents("php://input");
    if (empty($rawData)) {
        throw new Exception("No submission data received");
    }

    $data = json_decode($rawData, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON data");
    }

    // 2. Configure PHPMailer (Production SMTP)
    $mail->isSMTP();
    $mail->Host = 'smtp.forwardemail.net';
    $mail->SMTPAuth = true;
    $mail->Username = 'webform@phedaz.ng';
    $mail->Password = 'vybqiT-7sapta-kumP?uk+)';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->SMTPDebug = 0; // Disable debug in production

    // 3. Build waitlist notification email
    $mail->setFrom('webform@phedaz.ng', 'Phedaz Waitlist');
    $mail->addAddress('websupport@mailing.phedaz.com'); // Your company email
    $mail->addReplyTo($data['email'], $data['firstName'] . ' ' . $data['lastName']);
    
    $mail->Subject = 'New Waitlist Signup: ' . substr($data['firstName'] . ' ' . $data['lastName'], 0, 50);

    $body = "<h1>New Waitlist Submission</h1>";
    foreach ($data as $key => $value) {
        $body .= "<p><strong>" . htmlspecialchars(ucfirst($key)) . ":</strong> " . 
               htmlspecialchars(is_array($value) ? implode(', ', $value) : $value) . "</p>";
    }
    
    $mail->isHTML(true);
    $mail->Body = $body;
    $mail->AltBody = strip_tags($body);

    // 4. Send and respond
    if ($mail->send()) {
        $response = [
            'success' => true,
            'message' => 'Thank you for joining our waitlist!'
        ];
    } else {
        throw new Exception("Email sending failed");
    }

} catch (Exception $e) {
    error_log("Waitlist Error: " . $e->getMessage());
    $response['message'] = 'Submission failed. Please try again.';
    http_response_code(500);
}

echo json_encode($response);
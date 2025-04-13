<?php
require __DIR__ . '/../vendor/autoload.php';

date_default_timezone_set('UTC');
$test_email = "your_email@example.com"; // Use a real address you can check

$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
    // Connection config
    $mail->isSMTP();
    $mail->Host = 'smtp.forwardemail.net';
    $mail->SMTPAuth = true;
    $mail->AuthType = 'LOGIN';
    $mail->Username = 'webform@office.phedaz.com';
    $mail->Password = 'ryhwuw-dyGkyr7>9?mapku8';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->Timeout = 15;

    // Email headers
    $mail->setFrom('webform@office.phedaz.com', 'Phedaz Test');
    $mail->addAddress($test_email);
    $mail->Subject = 'Test ' . date('Y-m-d H:i:s');
    $mail->Body = 'This is a plain text test email.';
    $mail->isHTML(false);
    
    // Debugging
    $mail->SMTPDebug = 4; // Maximum verbosity
    $mail->Debugoutput = function($str, $level) {
        $log = date('Y-m-d H:i:s') . " [L$level]: " . trim($str) . "\n";
        file_put_contents('smtp_debug.log', $log, FILE_APPEND);
        echo $log; // Real-time output
    };

    if (!$mail->send()) {
        throw new Exception('Send failed: ' . $mail->ErrorInfo);
    }
    
    echo "✅ Email should have been delivered to $test_email";
} catch (Exception $e) {
    $error = "❌ FAILED: " . $e->getMessage();
    file_put_contents('error.log', date('c') . " $error\n", FILE_APPEND);
    echo $error;
}
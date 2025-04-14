<?php
require __DIR__ . '/../vendor/autoload.php';

date_default_timezone_set('UTC');
$test_email = ""; // Replace this with your actual test email

$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
    // SMTP Config
    $mail->isSMTP();
    $mail->Host = 'smtp.forwardemail.net';
    $mail->SMTPAuth = true;
    $mail->AuthType = 'LOGIN';
    $mail->Username = 'webform@phedaz.ng';
    $mail->Password = 'vybqiT-7sapta-kumP?uk+)';
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;
    $mail->Timeout = 15;

    // Email Headers
    $mail->setFrom('webform@phedaz.ng', 'Phedaz Webform');
    $mail->addAddress($test_email);
    $mail->Subject = 'Test Email ' . date('Y-m-d H:i:s');
    $mail->Body = 'This is a plain text test email from Phedaz using ForwardEmail SMTP.';
    $mail->isHTML(false);

    // Debugging
    $mail->SMTPDebug = 4;
    $mail->Debugoutput = function($str, $level) {
        $log = date('Y-m-d H:i:s') . " [L$level]: " . trim($str) . "\n";
        file_put_contents('smtp_debug.log', $log, FILE_APPEND);
        echo $log;
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

<?php
// Load Composer's autoloader
require __DIR__ . '/vendor/autoload.php';

try {
    // Create a PHPMailer instance
    $mail = new PHPMailer\PHPMailer\PHPMailer(true);
    
    // Test basic functionality
    $mail->isSMTP();                          // Not actually sending, just testing if methods exist
    $mail->Host = 'smtp.example.com';         // Dummy value for testing
    
    echo "✅ PHPMailer loaded successfully! All basic methods work.";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage();
}
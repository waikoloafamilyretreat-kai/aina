<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $name     = htmlspecialchars($_POST['name']);
  $email    = htmlspecialchars($_POST['email']);
  $checkin  = htmlspecialchars($_POST['checkin']);
  $checkout = htmlspecialchars($_POST['checkout']);
  $message  = htmlspecialchars($_POST['message']);

  $to = "your-email@example.com"; // 👈 CHANGE THIS TO YOUR EMAIL
  $subject = "New Booking Request from $name";
  $body = "Name: $name\nEmail: $email\nCheck-in: $checkin\nCheck-out: $checkout\nMessage: $message";
  $headers = "From: $email";

  if (mail($to, $subject, $body, $headers)) {
    echo "<h2>✅ Booking request sent successfully!</h2>";
  } else {
    echo "<h2>❌ Failed to send booking. Please try again later.</h2>";
  }
}
?>


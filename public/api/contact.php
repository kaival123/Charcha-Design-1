<?php
/**
 * Charchalive contact form handler.
 *
 * Receives the contact form as JSON (POST) and emails it to the site inbox using the web server's own
 * mail() function — no third-party service. Deployed with the site at /api/contact.php.
 *
 * The recipient is fixed here on the server (never taken from the request), so the script cannot be
 * abused to send mail to other people.
 */

declare(strict_types=1);

// ---- Settings -------------------------------------------------------------------------------------
const TO_EMAIL = 'kaival@amnex.com';           // Inbox that receives the messages.
const SITE_NAME = 'Charchalive';
// Sender address. Many hosts only deliver mail "from" an address on your own domain, so leave this
// empty to use noreply@<your domain> automatically, or set a real mailbox on your domain.
const FROM_EMAIL = '';
const TOPICS = ['General enquiry', 'Aapki Awaaz submission', 'Charcha podcast', 'Partnerships', 'Feedback'];
const RATE_LIMIT_SECONDS = 30;                 // Minimum gap between messages from one IP address.
// ---------------------------------------------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $success, string $message): void
{
    http_response_code($status);
    echo json_encode(['success' => $success, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

/** Collapse whitespace and strip line breaks so a value cannot inject extra email headers. */
function clean_line(string $value, int $max): string
{
    $value = trim(preg_replace('/[\r\n\t]+|\s{2,}/u', ' ', $value) ?? '');
    return mb_substr($value, 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Method not allowed.');
}

$data = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($data)) {
    $data = $_POST; // Also accept a normal form post.
}

// Honeypot: real visitors never see this field, so anything in it means a bot. Pretend it worked.
if (!empty($data['botcheck'])) {
    respond(200, true, 'Message sent.');
}

$name    = clean_line((string) ($data['name'] ?? ''), 100);
$email   = clean_line((string) ($data['email'] ?? ''), 254);
$topic   = clean_line((string) ($data['topic'] ?? ''), 100);
$message = trim(str_replace("\r\n", "\n", (string) ($data['message'] ?? '')));
$message = mb_substr($message, 0, 5000);

if (mb_strlen($name) < 2) {
    respond(422, false, 'Please enter your name.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(422, false, 'Please enter a valid email address.');
}
if (mb_strlen($message) < 10) {
    respond(422, false, 'Please write at least 10 characters.');
}
if (!in_array($topic, TOPICS, true)) {
    $topic = TOPICS[0];
}

// Simple per-IP rate limit using a file in the system temp folder.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$stamp = sys_get_temp_dir() . '/charchalive_contact_' . md5($ip);
if (is_file($stamp) && (time() - (int) filemtime($stamp)) < RATE_LIMIT_SECONDS) {
    respond(429, false, 'Please wait a few seconds before sending another message.');
}

$host = preg_replace('/^www\./', '', strtolower((string) ($_SERVER['SERVER_NAME'] ?? 'localhost')));
$from = FROM_EMAIL !== '' ? FROM_EMAIL : 'noreply@' . $host;
// SERVER_NAME can come from the request's Host header, and $from is passed to the mail command below,
// so only use it if it is a plain, valid address.
if (!filter_var($from, FILTER_VALIDATE_EMAIL) || !preg_match('/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+$/', $from)) {
    $from = TO_EMAIL;
}

$subject = sprintf('%s — from %s', $topic, $name);
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$body = implode("\n", [
    'New message from the ' . SITE_NAME . ' contact form',
    '',
    'Full name:     ' . $name,
    'Email address: ' . $email,
    'Topic:         ' . $topic,
    '',
    'Message:',
    $message,
    '',
    '—',
    'Sent ' . date('j M Y, H:i T') . ' from ' . $ip,
]);

$headers = implode("\r\n", [
    'From: =?UTF-8?B?' . base64_encode(SITE_NAME . ' website') . '?= <' . $from . '>',
    'Reply-To: =?UTF-8?B?' . base64_encode($name) . '?= <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . PHP_VERSION,
]);

// "-f" sets the envelope sender, which many hosts require for the message to be accepted.
$sent = @mail(TO_EMAIL, $encodedSubject, $body, $headers, '-f' . $from);

if (!$sent) {
    error_log('Charchalive contact form: mail() failed for message from ' . $email);
    respond(500, false, 'The mail server could not send the message.');
}

@touch($stamp);
respond(200, true, 'Message sent.');

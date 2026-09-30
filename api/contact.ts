/**
 * Charchalive contact form handler — Vercel Serverless Function, served at POST /api/contact.
 *
 * Emails the form to the site inbox through your mailbox's SMTP server. Configure it in the Vercel
 * dashboard → Project → Settings → Environment Variables (never in code):
 *
 *   SMTP_HOST     e.g. smtp.gmail.com, smtp.office365.com, or your host's mail server
 *   SMTP_PORT     465 (SSL) or 587 (STARTTLS)
 *   SMTP_USER     the mailbox login, e.g. contact@charchalive.com
 *   SMTP_PASS     that mailbox's password (for Gmail: an App Password)
 *   CONTACT_TO    optional — inbox that receives messages (defaults to kaival@amnex.com)
 *   CONTACT_FROM  optional — sender address (defaults to SMTP_USER; most servers require this)
 *
 * The recipient comes only from the server's settings, never from the request, so this endpoint
 * cannot be used to send mail to anyone else.
 */
import nodemailer from 'nodemailer';

const DEFAULT_TO = 'kaival@amnex.com';
const SITE_NAME = 'Charchalive';
const TOPICS = ['General enquiry', 'Aapki Awaaz submission', 'Charcha podcast', 'Partnerships', 'Feedback'];
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]+$/;

const json = (status: number, success: boolean, message: string) =>
  Response.json({ success, message }, { status, headers: { 'X-Content-Type-Options': 'nosniff' } });

/** One line of text, no line breaks (so it can't smuggle extra email headers), trimmed to a max length. */
const line = (value: unknown, max: number) =>
  String(value ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max);

export async function POST(request: Request): Promise<Response> {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json(400, false, 'Invalid request.');
  }

  // Honeypot: real visitors never see this field, so anything in it means a bot. Pretend it worked.
  if (data['botcheck']) return json(200, true, 'Message sent.');

  const name = line(data['name'], 100);
  const email = line(data['email'], 254);
  const topic = TOPICS.includes(line(data['topic'], 100)) ? line(data['topic'], 100) : TOPICS[0];
  const message = String(data['message'] ?? '').replace(/\r\n/g, '\n').trim().slice(0, 5000);

  if (name.length < 2) return json(422, false, 'Please enter your name.');
  if (!EMAIL_RE.test(email)) return json(422, false, 'Please enter a valid email address.');
  if (message.length < 10) return json(422, false, 'Please write at least 10 characters.');

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('Contact form: SMTP_HOST, SMTP_USER and SMTP_PASS must be set in Vercel environment variables.');
    return json(500, false, 'Email is not configured on the server (missing SMTP environment variables).');
  }

  const port = Number(SMTP_PORT) || 465;
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const text = [
    `New message from the ${SITE_NAME} contact form`,
    '',
    `Full name:     ${name}`,
    `Email address: ${email}`,
    `Topic:         ${topic}`,
    '',
    'Message:',
    message,
  ].join('\n');

  try {
    await transporter.sendMail({
      from: { name: `${SITE_NAME} website`, address: CONTACT_FROM || SMTP_USER },
      to: CONTACT_TO || DEFAULT_TO,
      replyTo: { name, address: email },
      subject: `${topic} — from ${name}`,
      text,
    });
  } catch (err) {
    console.error('Contact form: sending failed:', err);
    return json(502, false, 'The mail server could not send the message.');
  }

  return json(200, true, 'Message sent.');
}

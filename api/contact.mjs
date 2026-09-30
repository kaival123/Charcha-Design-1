/**
 * Charchalive contact form handler — Vercel Serverless Function, served at POST /api/contact.
 *
 * Plain JavaScript (ES module) on purpose: Vercel runs .mjs files as-is, whereas a .ts file here would be
 * compiled with the Angular tsconfig ("module": "preserve") and crash on start-up.
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

/** @param {number} status @param {boolean} success @param {string} message @param {object} [extra] */
const json = (status, success, message, extra = {}) =>
  Response.json({ success, message, ...extra }, { status, headers: { 'X-Content-Type-Options': 'nosniff' } });

/** Plain-English hint for the most common SMTP failures (nodemailer error codes). */
function smtpHint(err, host) {
  const code = err?.code;
  const reply = String(err?.response ?? err?.message ?? '');
  if (code === 'EAUTH' || /535|Username and Password not accepted|Invalid login/i.test(reply)) {
    return 'Login rejected: check SMTP_USER, and that SMTP_PASS is a Gmail App Password (not the normal password).';
  }
  if (/5\.7\.0|Application-specific password required/i.test(reply)) {
    return 'Gmail requires an App Password for this account (turn on 2-Step Verification, then create one).';
  }
  if (code === 'EDNS') {
    return `No mail server called "${host}" exists: set SMTP_HOST to the server name, e.g. smtp.gmail.com.`;
  }
  if (code === 'ESOCKET' || code === 'ECONNECTION' || code === 'ETIMEDOUT') {
    return `Could not connect to "${host}": check SMTP_HOST and SMTP_PORT (Gmail: smtp.gmail.com, 465).`;
  }
  if (code === 'EENVELOPE' || /^55[0-4]/.test(String(err?.responseCode ?? ''))) {
    return 'The mail server refused the sender or recipient address: check CONTACT_FROM / CONTACT_TO.';
  }
  return 'See the Vercel function logs for details.';
}

/** One line of text, no line breaks (so it can't smuggle extra email headers), trimmed to a max length. */
const line = (value, max) =>
  String(value ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim().slice(0, max);

/** @param {Request} request @returns {Promise<Response>} */
export async function POST(request) {
  /** @type {Record<string, unknown>} */
  let data;
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

  // Trim everything: values pasted into the Vercel dashboard often pick up stray spaces or line breaks.
  const env = (key) => (process.env[key] ?? '').trim();
  const SMTP_HOST = env('SMTP_HOST');
  const SMTP_PORT = env('SMTP_PORT');
  const SMTP_USER = env('SMTP_USER');
  const CONTACT_TO = env('CONTACT_TO');
  const CONTACT_FROM = env('CONTACT_FROM');
  // Google shows App Passwords as "abcd efgh ijkl mnop"; the spaces are not part of the password.
  const SMTP_PASS = /gmail|google/i.test(SMTP_HOST) ? env('SMTP_PASS').replace(/\s+/g, '') : env('SMTP_PASS');
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.error('Contact form: SMTP_HOST, SMTP_USER and SMTP_PASS must be set in Vercel environment variables.');
    return json(500, false, 'Email is not configured on the server (missing SMTP environment variables).');
  }

  // A common mix-up is pasting the email address into SMTP_HOST; catch it with a clear message.
  if (SMTP_HOST.includes('@') || !SMTP_HOST.includes('.')) {
    console.error(`Contact form: SMTP_HOST "${SMTP_HOST}" is not a server name.`);
    return json(500, false, 'Email is not configured correctly on the server.', {
      code: 'BAD_SMTP_HOST',
      hint: `SMTP_HOST is "${SMTP_HOST}" — it must be a server name such as smtp.gmail.com. Put the email address in SMTP_USER.`,
    });
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
    // The error code and hint contain no secrets, and they make setup problems diagnosable from the browser.
    return json(502, false, 'The mail server could not send the message.', {
      code: err?.code ?? null,
      hint: smtpHint(err, SMTP_HOST),
    });
  }

  return json(200, true, 'Message sent.');
}

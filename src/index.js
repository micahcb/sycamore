'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const { Configuration, PlaidApi, PlaidEnvironments, Products } = require('plaid');

const PORT = process.env.PORT || 3001;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_VERIFY_SERVICE_SID = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.warn('Missing PLAID_CLIENT_ID or PLAID_SECRET. Set them in .env (see .env.example).');
}
if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SERVICE_SID) {
  console.warn('Missing TWILIO_* or JWT_SECRET. Set them in .env for phone auth.');
}

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
      'Plaid-Version': '2020-09-14',
    },
  },
});

const plaidClient = new PlaidApi(configuration);
const twilioClient = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN
  ? twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  : null;

// In-memory store per user; use a DB in production.
const storeByUser = new Map();

function getStore(uid) {
  if (!storeByUser.has(uid)) {
    storeByUser.set(uid, { accessToken: null, itemId: null });
  }
  return storeByUser.get(uid);
}

/** Returns E.164 phone (digits only after +) or null if invalid. US/CA: 10 digits → +1xxxxxxxxxx. */
function normalizePhone(value) {
  if (value === undefined || value === null) return null;
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 10) return '+1' + digits;
  if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
  if (digits.length >= 10 && digits.length <= 15) return '+' + digits;
  return null;
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.uid = payload.sub;
    req.authPhone = payload.phone;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/**
 * POST /auth/send-otp
 * Body: { phone: string }
 * Sends OTP via Twilio Verify.
 */
app.post('/auth/send-otp', async (req, res) => {
  const rawPhone = req.body?.phone;
  const phone = normalizePhone(rawPhone);
  console.log('[auth/send-otp] input:', { raw: rawPhone, type: typeof rawPhone, normalized: phone });
  try {
    if (!twilioClient || !TWILIO_VERIFY_SERVICE_SID) {
      return res.status(503).json({ error: 'Phone auth not configured' });
    }
    if (!phone) {
      console.log('[auth/send-otp] rejected: normalizePhone returned null');
      return res.status(400).json({ error: 'Enter a valid phone number (e.g. 10-digit US or E.164 like +1234567890)' });
    }
    await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({ to: phone, channel: 'sms' });
    res.json({ ok: true });
  } catch (err) {
    console.error('[auth/send-otp] error:', {
      message: err.message,
      code: err.code,
      status: err.status || err.statusCode,
      body: err.body,
      input: { raw: rawPhone, type: typeof rawPhone, normalized: phone },
    });
    const msg = err.message || (err.body && err.body.message) || 'Failed to send code';
    const status = (err.status || err.statusCode) === 429 ? 429 : 500;
    const isInvalidParam = msg.toLowerCase().includes('invalid parameter') || err.code === 21608 || err.code === 60200;
    const clientMsg = err.code === 60200
      ? 'Twilio could not send to this number (60200). Check the number is valid, can receive SMS, and that your Verify service SID (starts with VA) is set correctly in .env.'
      : isInvalidParam
        ? 'Invalid phone number. Use a 10-digit US number or E.164 format (e.g. +1234567890).'
        : msg;
    res.status(isInvalidParam ? 400 : status).json({ error: clientMsg });
  }
});

/**
 * POST /auth/verify
 * Body: { phone: string, code: string }
 * Verifies OTP and returns JWT + user.
 */
app.post('/auth/verify', async (req, res) => {
  const rawPhone = req.body?.phone;
  const phone = normalizePhone(rawPhone);
  const code = (req.body?.code || '').trim();
  console.log('[auth/verify] input:', { rawPhone, type: typeof rawPhone, normalized: phone, codeLength: code.length });
  try {
    if (!twilioClient || !TWILIO_VERIFY_SERVICE_SID) {
      return res.status(503).json({ error: 'Phone auth not configured' });
    }
    if (!phone || !code) {
      console.log('[auth/verify] rejected: missing phone or code');
      return res.status(400).json({ error: 'Phone and code required' });
    }
    const verification = await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({ to: phone, code });
    if (verification.status !== 'approved') {
      console.log('[auth/verify] verification not approved:', verification.status);
      return res.status(400).json({ error: 'Invalid or expired code' });
    }
    const uid = phone;
    const token = jwt.sign(
      { sub: uid, phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: { id: uid, phone },
    });
  } catch (err) {
    console.error('[auth/verify] error:', {
      message: err.message,
      code: err.code,
      body: err.body,
      input: { rawPhone, type: typeof rawPhone, normalized: phone },
    });
    const msg = err.message || (err.body && err.body.message) || 'Verification failed';
    res.status(400).json({ error: msg });
  }
});

/**
 * POST /api/link/token (protected)
 * Create a link_token for initializing Plaid Link on the client.
 * Body: { clientUserId?: string } (optional; uses req.uid when authenticated)
 */
app.post('/api/link/token', authMiddleware, async (req, res) => {
  try {
    const clientUserId = req.body?.clientUserId || req.uid;
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: clientUserId },
      client_name: 'Plaid Public API',
      products: [Products.Transactions],
      country_codes: ['US'],
      language: 'en',
    });
    res.json({ link_token: response.data.link_token });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

/**
 * POST /api/token/exchange (protected)
 * Exchange a public_token (from Link onSuccess) for an access_token.
 * Body: { public_token: string }
 */
app.post('/api/token/exchange', authMiddleware, async (req, res) => {
  try {
    const { public_token } = req.body;
    if (!public_token) {
      return res.status(400).json({ error: 'public_token is required' });
    }
    const store = getStore(req.uid);
    const response = await plaidClient.itemPublicTokenExchange({ public_token });
    store.accessToken = response.data.access_token;
    store.itemId = response.data.item_id;
    res.json({
      access_token: response.data.access_token,
      item_id: response.data.item_id,
    });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

/**
 * GET /api/accounts (protected)
 * Return accounts for the linked item (uses stored access_token for user).
 */
app.get('/api/accounts', authMiddleware, async (req, res) => {
  try {
    const store = getStore(req.uid);
    if (!store.accessToken) {
      return res.status(400).json({ error: 'No linked item. Exchange a public_token first.' });
    }
    const response = await plaidClient.accountsGet({
      access_token: store.accessToken,
    });
    res.json({ accounts: response.data.accounts });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

/**
 * GET /api/transactions (protected)
 * Return transactions for the linked item.
 * Query: start_date, end_date (YYYY-MM-DD). Defaults to last 30 days.
 */
app.get('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const store = getStore(req.uid);
    if (!store.accessToken) {
      return res.status(400).json({ error: 'No linked item. Exchange a public_token first.' });
    }
    const end = req.query.end_date || new Date().toISOString().slice(0, 10);
    const start = req.query.start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const response = await plaidClient.transactionsGet({
      access_token: store.accessToken,
      start_date: start,
      end_date: end,
    });
    res.json({
      transactions: response.data.transactions,
      total: response.data.total_transactions,
    });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Plaid public API listening on http://localhost:${PORT}`);
  console.log('Endpoints: POST /api/link/token, POST /api/token/exchange, GET /api/accounts, GET /api/transactions');
});

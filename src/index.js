'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments, Products } = require('plaid');

const PORT = process.env.PORT || 3001;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
  console.warn('Missing PLAID_CLIENT_ID or PLAID_SECRET. Set them in .env (see .env.example).');
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

// In-memory store for demo only; use a DB in production.
const store = { accessToken: null, itemId: null };

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/**
 * POST /api/link/token
 * Create a link_token for initializing Plaid Link on the client.
 * Body: { clientUserId?: string } (optional; defaults to 'user-default')
 */
app.post('/api/link/token', async (req, res) => {
  try {
    const clientUserId = req.body?.clientUserId || 'user-default';
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
 * POST /api/token/exchange
 * Exchange a public_token (from Link onSuccess) for an access_token.
 * Body: { public_token: string }
 */
app.post('/api/token/exchange', async (req, res) => {
  try {
    const { public_token } = req.body;
    if (!public_token) {
      return res.status(400).json({ error: 'public_token is required' });
    }
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
 * GET /api/accounts
 * Return accounts for the linked item (uses stored access_token).
 */
app.get('/api/accounts', async (req, res) => {
  try {
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
 * GET /api/transactions
 * Return transactions for the linked item.
 * Query: start_date, end_date (YYYY-MM-DD). Defaults to last 30 days.
 */
app.get('/api/transactions', async (req, res) => {
  try {
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

// next.config.js (or next.config.mjs)
const raw = process.env.NEXT_PUBLIC_PLAID_API_URL || 'http://localhost:3001';
const apiBase = (
  !raw || raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`
).replace(/\/+$/, '');
module.exports = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiBase}/api/:path*` }];
  },
};

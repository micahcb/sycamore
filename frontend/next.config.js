// next.config.js (or next.config.mjs)
const apiBase = process.env.NEXT_PUBLIC_PLAID_API_URL || 'http://localhost:3001';
module.exports = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${apiBase}/api/:path*` }];
  },
};

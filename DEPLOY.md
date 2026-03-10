# Deploy frontend + backend to a random URL

Easiest approach: use **Railway** or **Render**. Both give you a URL like `your-app-xyz.up.railway.app` or `your-app.onrender.com` with no custom domain setup.

---

## Option 1: Railway (recommended — one platform)

1. **Sign up**: [railway.app](https://railway.app) (GitHub login).

2. **New project** → **Deploy from GitHub** → connect this repo.

3. **Add two services** from the same repo:
   - **Backend**: Add service → same repo → set **Root Directory** to `.` (repo root).
     - **Build**: leave empty or `npm install`
     - **Start**: `npm start`
     - **Variables**: `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV` (optional, default `sandbox`)
   - **Frontend**: Add service → same repo → set **Root Directory** to `frontend`.
     - **Build**: `npm install && npm run build`
     - **Start**: `npm start`
     - **Variables**: `NEXT_PUBLIC_PLAID_API_URL` = your backend’s Railway URL (e.g. `https://budgetapp-api-production-xxxx.up.railway.app`)

4. Deploy the **backend** first. In the backend service go to **Settings → Domains** and copy the URL (e.g. `https://budgetapp-api-production-xxxx.up.railway.app`). Add that as `NEXT_PUBLIC_PLAID_API_URL` in the **frontend** service’s variables, then deploy the frontend (or trigger a redeploy).

5. **CORS**: Backend already uses `cors()` with no origin restriction, so the frontend URL is allowed.

---

## Option 2: Render

1. **Sign up**: [render.com](https://render.com).

2. **Backend**: New → **Web Service** → connect repo.
   - **Root Directory**: leave empty (repo root).
   - **Build**: `npm install`
   - **Start**: `npm start`
   - **Env**: `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`
   - Render gives a URL like `https://your-api-name.onrender.com`.

3. **Frontend**: New → **Web Service** (or **Static Site** if you export Next.js as static).
   - **Root Directory**: `frontend`
   - **Build**: `npm install && npm run build`
   - **Start**: `npm start`
   - **Env**: `NEXT_PUBLIC_PLAID_API_URL` = backend URL from step 2.

4. Use the frontend URL Render gives you (e.g. `https://your-frontend-name.onrender.com`).

---

## Env summary

| Where        | Variable                     | Example / notes                          |
|-------------|------------------------------|-----------------------------------------|
| Backend     | `PLAID_CLIENT_ID`            | From Plaid dashboard                    |
| Backend     | `PLAID_SECRET`               | From Plaid dashboard                    |
| Backend     | `PLAID_ENV`                  | `sandbox` or `development` / `production` |
| Backend     | `PORT`                       | Usually set by Railway/Render           |
| Frontend    | `NEXT_PUBLIC_PLAID_API_URL`  | Full backend URL (e.g. `https://...`)   |

`next.config.js` and `plaid-api.ts` already use `NEXT_PUBLIC_PLAID_API_URL` when set, so the app will talk to your deployed API once that variable is set.

---

## One-off / demo: single URL

If you want **one URL** that serves both:

- **Railway**: Add a single service; use **Root Directory** `frontend` and a custom **Start** that runs both (e.g. a small script that starts the Express server and then `next start`), or run the API under a path (e.g. Next.js rewrites to the API). More setup.
- **Vercel (frontend) + Railway/Render (backend)** keeps deployment simple: deploy frontend to Vercel, backend to Railway or Render, set `NEXT_PUBLIC_PLAID_API_URL` to the backend URL. You get two URLs but minimal config.

For “easiest to a random URL,” **Railway with two services** (backend + frontend) is the simplest single-platform option.

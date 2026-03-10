# Deploy frontend + backend to a random URL

Easiest approach: use **Railway** or **Render**. Both give you a URL like `your-app-xyz.up.railway.app` or `your-app.onrender.com` with no custom domain setup.

---

## Option 1: Railway (recommended — one platform)

1. **Sign up**: [railway.app](https://railway.app) (GitHub login).

2. **Create the project and first service (backend)**  
   - In the **dashboard**, click **New Project** (top right).  
   - Choose **Deploy from GitHub** (or “GitHub repo”).  
   - Search for this repo and select it → **Deploy Now** (or add variables then Deploy).  
   - That creates a project and your **first service**. We’ll use it as the backend.

3. **Configure the backend service**  
   - Click the service that was just created (on the project canvas).  
   - **Settings** (or the gear): set **Root Directory** to `.` (repo root), **Build** to `npm install`, **Start** to `npm start`.  
   - **Variables**: add `PLAID_CLIENT_ID`, `PLAID_SECRET`, and optionally `PLAID_ENV`.  
   - Under **Settings → Networking** (or **Domains**), click **Generate Domain** and copy the URL (e.g. `https://your-app.up.railway.app`).

4. **Add the second service (frontend)**  
   - Back on the **project canvas** (the main project view with your backend service), click the **`+`** or **New** button (top right (or press **Cmd+K** / **Ctrl+K** and type “new service”). If the UI shows “Add a service” / “New” area).  
   - Choose **GitHub repo** again and select the **same** repo.  
   - For this new service: set **Root Directory** to `frontend`, **Build** to `npm install && npm run build`, **Start** to `npm start`.  
   - **Variables**: add `NEXT_PUBLIC_PLAID_API_URL` = the backend URL from step 3 (e.g. `https://your-app.up.railway.app`).  
   - **Settings → Networking**: under “Generate Service Domain,” leave the port as **8080** (Railway sets `PORT` and Next.js uses it). Click **Generate Domain** to get your frontend URL.

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

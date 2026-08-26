# OnPace

A personal calorie / macro tracker with AI meal estimation, photo reading, menu
ranking, and weekly dinner planning. One HTML file, hosted free on GitHub Pages,
with a tiny Cloudflare Worker proxying calls to the Anthropic API.

## How this repo hosts the app

Every push to the default branch runs `.github/workflows/deploy-pages.yml`,
which publishes the repo (`index.html` + `icon.png`) to GitHub Pages. The app
lives at:

**https://fogz-lgtm.github.io/Onpace/**

If the first workflow run fails with a Pages error, enable it once by hand:
repo **Settings → Pages → Source: "GitHub Actions"**, then re-run the workflow
from the Actions tab.

## One-time setup — the AI proxy (Cloudflare Worker, free)

The app's AI features (meal estimation, photo reading, suggestions, dinner
plans) call the Anthropic API. Your API key must never sit in a public web
page, so a tiny proxy holds it.

1. Get an API key: sign in at https://console.anthropic.com → API Keys →
   Create Key. Copy it. (You'll need a small amount of billing credit; typical
   personal use is $1–3/month.)
2. Sign up free at https://dash.cloudflare.com → Workers & Pages → Create →
   Create Worker.
3. Name it `onpace-proxy`, deploy the hello-world, then click **Edit code**.
4. Delete everything and paste in the contents of `worker.js` (in this repo).
   Click **Deploy**.
5. Go to the worker's **Settings → Variables and Secrets → Add**:
   - Type: **Secret**, Name: `ANTHROPIC_API_KEY`, Value: your API key.
     Save & deploy.
6. Copy the worker URL (looks like `https://onpace-proxy.yourname.workers.dev`).

## Point the app at your worker

1. Edit `index.html` (on GitHub: open the file → pencil icon).
2. Near the top, find:
   `const PROXY_URL = "PASTE_YOUR_WORKER_URL_HERE";`
   Replace the placeholder with your worker URL (keep the quotes).
3. Commit — the site redeploys automatically in about a minute.

Until then the app still works for manual logging and the Library; only the AI
features are off (it shows a banner saying so).

## Install on your iPhone

Open the site URL in Safari → Share → **Add to Home Screen** → it installs
with the OnPace icon and name, launches full-screen, and works like a native
app.

## Notes

- **Data** lives in the browser via localStorage — it persists across launches
  on the same device/browser. Use Settings → Backup → Export/Restore to move
  between devices or as insurance.
- **Training**: enter your workout calories from your watch or Strava (single
  field). No Strava integration in this version — it can be added later with
  Strava's OAuth API.
- **Sharing**: send anyone the URL; they get their own blank copy on their own
  device. Their AI calls run through *your* worker (your key). To restrict
  that, set the CORS origin in `worker.js` to your Pages domain
  (`https://fogz-lgtm.github.io`), or give trusted people their own worker.
- **Updating the app**: edit `index.html` in the repo; changes go live in
  ~1 minute. If your phone shows a stale version, pull-to-refresh or reinstall
  the home-screen icon.
- **Privacy**: meal text/photos go to your Cloudflare worker, then to
  Anthropic's API for estimation. Nothing else leaves the device.

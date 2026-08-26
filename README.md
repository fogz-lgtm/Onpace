# OnPace

A personal calorie / macro tracker with AI meal estimation, photo reading, menu
ranking, and weekly dinner planning. One HTML file, hosted free on GitHub Pages.
No backend: the app calls the Anthropic API directly from your browser, using an
API key you enter once on your device.

## How this repo hosts the app

Every push to the default branch runs `.github/workflows/deploy-pages.yml`,
which publishes the repo (`index.html` + `icon.png`) to GitHub Pages. The app
lives at:

**https://fogz-lgtm.github.io/Onpace/**

One-time setup (repo owner, in Settings): make the repo **public** (free
accounts can only use Pages on public repos), then **Settings → Pages →
Source: "GitHub Actions"**. If the first workflow run failed before this was
done, re-run it from the Actions tab.

## Turn on the AI features

The AI features (meal estimation, photo reading, suggestions, dinner plans)
call the Anthropic API with your personal key. The key is stored only in your
browser's localStorage on your device — it never appears in this repo or the
hosted page.

1. Get an API key: sign in at https://console.anthropic.com → API Keys →
   Create Key. Copy it. (You'll need a small amount of billing credit; typical
   personal use is $1–3/month.)
2. In the app: **You** tab → **AI features** → paste the key → Save key.

Until then the app still works for manual logging and the Library; it shows a
banner while AI features are off.

## Connect Strava (optional)

Once connected, today's workouts and their calories sync into your training
log automatically — on app open, when you switch back to it, and every few
minutes while it's open. ("Sync Strava" on the Today tab forces an instant
re-check.) Like the AI key, this works without a backend: you create your own
free Strava API application and its credentials live only on your device.

1. Go to https://www.strava.com/settings/api and create an API application
   (any name/website; category "Training"). For **Authorization Callback
   Domain** enter exactly: `fogz-lgtm.github.io`
2. In OnPace (inside the installed app, not a separate Safari tab — they don't
   share storage): **You** tab → **Strava** card → paste the app's Client ID
   and Client Secret → **Connect Strava**.
3. Approve on the Strava page it opens; you'll land back in OnPace showing
   "Connected".
4. That's it — opening the app after a workout pulls it in. Already-synced
   activities are skipped, so repeated syncs are safe.

Calories come from Strava's per-activity figure (or the ride's kilojoules when
that's all Strava has). Activities without calorie data are skipped — add
those manually.

## Install on your iPhone

Open the site URL in Safari → Share → **Add to Home Screen** → it installs
with the OnPace icon and name, launches full-screen, and works like a native
app.

## Notes

- **Data** lives in the browser via localStorage — it persists across launches
  on the same device/browser. Use Settings → Backup → Export/Restore to move
  between devices or as insurance. The API key is deliberately *not* included
  in backups — re-enter it on a new device.
- **Training**: enter workout calories manually, or connect Strava (below) and
  pull them with one tap.
- **Sharing**: send anyone the URL; they get their own blank copy on their own
  device and enter their own API key. Your key and data never leave your
  device.
- **Updating the app**: edit `index.html` in the repo; changes go live in
  ~1 minute. If your phone shows a stale version, pull-to-refresh or reinstall
  the home-screen icon.
- **Privacy**: meal text/photos go directly from your device to Anthropic's
  API for estimation. Nothing else leaves the device.

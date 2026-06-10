# Netlify Static Deploy SOP

This app is now ready for Netlify static hosting. Backend run karaychi garaj nahi.

## What changed for live

- React app uses static/localStorage mode by default.
- It does not call `localhost:8080` on Netlify.
- `netlify.toml` is added:
  - build command: `npm run build`
  - publish folder: `build`
  - SPA redirect: all routes open through `index.html`

## Local build check

```powershell
npm run build
```

Build output folder:

```text
build
```

## Option 1: Deploy by Netlify website

1. GitHub var repo create kara.
2. Project GitHub var push kara.
3. Netlify open kara: https://app.netlify.com
4. `Add new site` -> `Import an existing project`.
5. GitHub repo select kara.
6. Build settings:

```text
Build command: npm run build
Publish directory: build
```

7. Deploy click kara.
8. Netlify link generate hoil. Link click keli ki app open hoil.

## Option 2: Deploy by Netlify CLI

Netlify CLI install:

```powershell
npm install -g netlify-cli
```

Login:

```powershell
netlify login
```

Deploy:

```powershell
netlify deploy --prod --dir=build
```

## GitHub push commands

Only first time:

```powershell
git init
git add .
git commit -m "Prepare static Netlify deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

Next time:

```powershell
git add .
git commit -m "Update app"
git push
```

## Live login note

Static live app stores data in browser localStorage. Default login:

```text
Login ID: AK1001
Email: ak1001@gmail.com
Password: 100123
Role: Master Admin
```

Created users, roadmap edits, and tasks stay in that browser. For shared cloud data, backend also needs hosting separately.

# Netlify Deploy SOP

## Frontend Environment

Set these in Netlify project settings before building:

```env
REACT_APP_API_BASE=https://your-backend-domain.example/api
REACT_APP_ENABLE_LOCAL_LOGIN=false
```

## Build

```bash
npm install
npm run build
```

Publish directory:

```text
build
```

No demo credentials are included in the public repo. The deployed frontend needs a configured backend and real users from your private database.

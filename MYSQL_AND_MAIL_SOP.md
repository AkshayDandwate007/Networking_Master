# MySQL And Mail SOP

This repo is public-safe: real MySQL credentials, JWT secrets, mail passwords, and alert recipients must be supplied through environment variables.

## Required Backend Variables

```powershell
$env:MYSQL_DB="networkingroadmap_db"
$env:MYSQL_USER="your_mysql_user"
$env:MYSQL_PASSWORD="your_mysql_password"
$env:JWT_SECRET="replace-with-at-least-32-random-characters"
```

## Optional Mail Alert Variables

```powershell
$env:LOGIN_ALERT_ENABLED="true"
$env:LOGIN_ALERT_TO="your-alert-email@example.com"
$env:MAIL_USERNAME="your-smtp-username"
$env:MAIL_PASSWORD="your-smtp-app-password"
```

Keep these values outside Git. Use `backend/.env.example` only as a checklist.

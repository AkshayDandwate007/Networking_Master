# Networking Roadmap Platform

React + Spring Boot application for managing a networking career roadmap, tasks, admin users, and roadmap phases.

## Security Defaults

- No demo admin credentials are committed.
- Frontend login requires the backend API by default.
- Local/offline login is disabled unless `REACT_APP_ENABLE_LOCAL_LOGIN=true` is set intentionally.
- Backend requires environment variables for MySQL and JWT secret.
- User and roadmap write APIs are role protected.

## Frontend Setup

Create a private `.env` file from `.env.example`:

```env
REACT_APP_API_BASE=http://localhost:8080/api
REACT_APP_ENABLE_LOCAL_LOGIN=false
```

Then run:

```bash
npm install
npm start
```

## Backend Setup

Create the MySQL database:

```sql
CREATE DATABASE networkingroadmap_db;
```

Set backend environment variables before running Spring Boot:

```powershell
$env:MYSQL_DB="networkingroadmap_db"
$env:MYSQL_USER="your_mysql_user"
$env:MYSQL_PASSWORD="your_mysql_password"
$env:JWT_SECRET="replace-with-at-least-32-random-characters"
```

Then run:

```bash
cd backend
mvn spring-boot:run
```

## First Admin User

The public repo does not seed login users. Create the first `master-admin` account in your own database using a BCrypt-hashed password, then manage other users from the app.

## Build

```bash
npm run build
```

# Networking Roadmap Backend

This is a Java Spring Boot backend for the Networking Roadmap app.

## Requirements

- Java 17+
- Maven
- MySQL database

## Setup

1. Create a MySQL database:

```sql
CREATE DATABASE networkingroadmap_db;
```

2. Set the required environment variables. Do not commit real secrets.

PowerShell example:

```powershell
$env:MYSQL_DB="networkingroadmap_db"
$env:MYSQL_USER="your_mysql_user"
$env:MYSQL_PASSWORD="your_mysql_password"
$env:JWT_SECRET="replace-with-at-least-32-random-characters"
```

You can use `backend/.env.example` as a checklist, but Spring Boot does not automatically load that file.

3. Run the backend from the `backend` directory:

```bash
mvn spring-boot:run
```

4. API endpoints will be available at `http://localhost:8080/api`.

## Important endpoints

- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `GET /api/phases`
- `POST /api/phases`
- `PUT /api/phases/{id}`
- `DELETE /api/phases/{id}`
- `GET /api/users`
- `POST /api/users`
- `POST /api/auth/login`

## Notes

- `data.sql` does not seed login users. Create the first master admin directly in your own database or through a private admin setup flow.
- The backend uses `spring.jpa.hibernate.ddl-auto=update` to create tables automatically.
- Passwords are stored with BCrypt through Spring Security.
- API writes are role protected: user/credential and roadmap writes require `master-admin`; task updates require `admin` or `master-admin`.

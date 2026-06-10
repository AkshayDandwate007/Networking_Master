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

2. Update `backend/src/main/resources/application.properties` with your MySQL username/password.

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

- `data.sql` seeds demo admin users and roadmap phases on startup.
- The backend uses `spring.jpa.hibernate.ddl-auto=update` to create tables automatically.
- For production, replace plain-text passwords with a secure hashing solution.

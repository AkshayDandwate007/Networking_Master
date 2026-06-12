# Setup Instructions

Use this project with private environment variables only. Do not commit real database passwords, JWT secrets, mail passwords, or admin credentials.

## Frontend

1. Copy `.env.example` to `.env`.
2. Set `REACT_APP_API_BASE` to your backend URL.
3. Keep `REACT_APP_ENABLE_LOCAL_LOGIN=false` for public or production use.
4. Run `npm install` and `npm start`.

## Backend

1. Create your MySQL database.
2. Set `MYSQL_DB`, `MYSQL_USER`, `MYSQL_PASSWORD`, and `JWT_SECRET` in your shell or hosting provider.
3. Run the Spring Boot backend from the `backend` directory.

The public repository does not include working admin credentials. Create your first `master-admin` user only in your private database.

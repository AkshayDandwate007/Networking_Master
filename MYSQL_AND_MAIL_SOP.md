# MySQL, Login ID, and Mail SOP

## 1. MySQL open karun data check kara

1. MySQL service start aahe ka te check kara.
2. Terminal / PowerShell open kara.
3. MySQL login kara:

```powershell
mysql -u nrking -p
```

Password:

```text
rootsai
```

4. Database select kara:

```sql
USE networkingroadmap_db;
```

5. Users ani generated login IDs check kara:

```sql
SELECT id, name, email, login_id, role FROM app_users;
```

6. Roadmap phases check kara:

```sql
SELECT id, title, time_range, salary, topics, color, status FROM roadmap_phases;
```

7. Tasks check kara:

```sql
SELECT * FROM tasks;
```

8. MySQL madhun baher ya:

```sql
EXIT;
```

## 2. Login ID flow

- Master Admin jevha `Credential Management` madhun user create karto, backend automatically `login_id` generate karto.
- User login kartana `Login ID or email` field madhye generated login ID kiwa email use karu shakto.
- Master Admin default:

```text
Email: ak1001@gmail.com
Login ID: AK1001
Password: 100123
```

## 3. Mail alert setup

Login zala ki alert `dandwateakshay45@gmail.com` la pathavnyasathi Gmail App Password lagel.

PowerShell madhye backend run karanyapurvi:

```powershell
$env:MAIL_USERNAME="yourgmail@gmail.com"
$env:MAIL_PASSWORD="your-gmail-app-password"
$env:LOGIN_ALERT_TO="dandwateakshay45@gmail.com"
```

Nantar backend run kara:

```powershell
cd backend
mvn spring-boot:run
```

Mail config nasel tari login fail honar nahi; fakt backend console madhye mail error disel.

## 4. App run

Backend:

```powershell
cd backend
mvn spring-boot:run
```

Frontend:

```powershell
npm start
```

# 🚀 DevPulse — Internal Tech Issue & Feature Tracker

A collaborative REST API platform for software teams to report bugs, suggest features, and coordinate resolutions. Built with Node.js, TypeScript, Express, and PostgreSQL.

---

## 🌐 Live URL

```
https://a2-dev-pulse.vercel.app
```

---

## ✨ Features

- 🔐 JWT-based authentication (signup & login)
- 👥 Role-based access control (`contributor` / `maintainer`)
- 🐛 Full CRUD for issues (`bug` / `feature_request`)
- 🔍 Filter by `type` and `status`; sort by `newest` or `oldest`
- 👤 Reporter details fetched without SQL JOINs (batch query)
- 🔒 Passwords never exposed in any response
- ⚡ Raw SQL with `pg` driver — no ORM, no query builder

---

## 🛠️ Tech Stack

| Technology | Details |
|---|---|
| Node.js | LTS 24.x runtime |
| TypeScript | v5.x strict mode |
| Express.js | Modular router architecture |
| PostgreSQL | Native `pg` driver, raw SQL only |
| bcryptjs | Password hashing (salt rounds: 10) |
| jsonwebtoken | JWT generation & verification |
| http-status-codes | Consistent HTTP status codes |

---

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000
```


## 👥 Roles & Permissions

| Action | contributor | maintainer |
|---|---|---|
| Register & Login | ✅ | ✅ |
| Create issue | ✅ | ✅ |
| View all issues | ✅ | ✅ |
| Update own issue (status=open) | ✅ | ✅ |
| Update any issue | ❌ | ✅ |
| Delete any issue | ❌ | ✅ |



*Built with ❤️ for the DevPulse assignment — B7A2*

# 🔗 SnapLink — High-Performance URL Shortening & Analytics Platform

SnapLink is a production-grade, highly available URL shortener and real-time visitor analytics dashboard. The application is built using a **Spring Boot** REST API, a **React (TypeScript)** client styled in a Refined Neo-Brutalist design language, **MySQL** for relational persistence, and **Redis** as a cache-aside layer.

---

## 🏗️ System Architecture

SnapLink uses a classic system design pattern optimized for heavy read operations (redirection requests):

```
                       ┌─────────────────────────┐
                       │   React Client (Vite)   │
                       └────────────┬────────────┘
                                    │ HTTP Requests
                                    ▼
                       ┌─────────────────────────┐
                       │    Spring Boot API      │
                       └──────┬───────────┬──────┘
                              │           │
           1. Check Cache     │           │ 3. If Cache Miss / Log Clicks
       ┌──────────────────────┘           └──────────────────────┐
       ▼                                                         ▼
┌──────────────┐                                          ┌──────────────┐
│  Redis Cache │                                          │  MySQL DB    │
└──────────────┘                                          └──────────────┘
```

1. **Write Operations:** When a user creates a shortened link, it is saved directly to MySQL.
2. **Read Operations (Redirects):** When a visitor accesses `http://snap.lk/{code}`, the API checks the **Redis Cache** first ($O(1)$ latency). 
3. **Cache Miss Fallback:** If the link is not present in Redis, the API queries the **MySQL Database** (using indexed columns for fast queries), writes it back to Redis (TTL 1 Hour), and redirects the visitor.
4. **Resilient Failover:** If the Redis service goes offline, the cache layer gracefully degrades to direct database queries without interrupting user sessions.

---

## ⚡ Key Features

* **High-Throughput Caching:** Sub-millisecond lookup times utilizing a Redis cache-aside strategy.
* **Granular Traffic Analytics:** Asynchronously parses incoming visitor requests to track referrers, device types, browser clients, and operating systems.
* **Access Protections:** Restrict destination redirects by locking specific links behind custom password keys.
* **Custom Link Aliases:** Create branded links by defining custom paths instead of randomized characters.
* **Refined Neo-Brutalism UI:** Confident, high-contrast visual interface featuring responsive charts and metrics widgets.
* **Dockerized Infrastructure:** Consolidated database, cache, backend api, and frontend client containers running under a unified network.

---

## 🛠️ Technology Stack

* **Backend:** Java 21, Spring Boot 3.x, Spring Security (JWT), Hibernate/JPA, MapStruct
* **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Recharts
* **Caching & Database:** Redis 7, MySQL 8
* **DevOps:** Docker, Docker Compose, Nginx (frontend asset server)

---

## 🐳 Quick Start (Running with Docker)

Make sure you have **Docker Desktop** installed and running on your machine.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shubhamshet204-dotcom/Snaplink.git
   cd Snaplink
   ```

2. **Create local environment secrets:**
   Create a `.env` file in the root folder of the repository:
   ```env
   MYSQL_ROOT_PASSWORD=Shubham@30
   DB_PASSWORD=Shubham@30
   ```

3. **Start the application:**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   * **Frontend Dashboard:** [http://localhost:5173](http://localhost:5173)
   * **Backend Swagger API docs:** [http://localhost:8082/swagger-ui.html](http://localhost:8082/swagger-ui.html)

---

## 💻 Local Development Setup

To run the application services individually without containers:

### 1. Databases
Ensure you have local instances of **MySQL** (port `3306`) and **Redis** (port `6379`) running on your host machine.

### 2. Run Backend
```bash
cd Snaplink
# Build and run Spring Boot
./mvnw spring-boot:run
```

### 3. Run Frontend
```bash
cd SnapLinkFrontend
# Install dependencies and start Vite dev server
npm install
npm run dev
```

---

## 📝 API Endpoint Documentation

All REST routes are fully secured under Bearer token auth except for public redirects:

### Authentication (`/api/auth`)
* `POST /api/auth/register` - Create a new user account.
* `POST /api/auth/login` - Authenticate credentials and receive a JWT.

### URL Shortener (`/api/links`)
* `POST /api/links` - Shorten a new URL (with custom alias, password, or expiry).
* `GET /api/links/my` - Fetch paginated, searchable link history.
* `PUT /api/links/{id}` - Modify target destinations or configurations.
* `DELETE /api/links/{id}` - Soft-delete a link.
* `GET /api/links/{id}/analytics` - Retrieve aggregated traffic metrics.

### User (`/api/users`)
* `GET /api/users/me` - Fetch logged-in user profile details.

### Redirection (Public)
* `GET /{shortCode}` - Public redirect endpoint. Challenges password-protected links or logs visitor metrics before redirecting.

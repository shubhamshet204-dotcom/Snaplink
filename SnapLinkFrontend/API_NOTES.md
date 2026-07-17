# Snaplink API Specifications & Frontend Audit

This document preserves the backend API specification and the frontend audit findings for the Snaplink URL Shortener project.

---

## 🌐 Backend API Specification

The Spring Boot backend runs on `http://localhost:8082`. All protected endpoints expect a header containing `Authorization: Bearer <jwt_token>`.

### Authentication Endpoints
* **Register:** `POST /api/auth/register`
  * Request Body: `{ name, email, password }`
  * Response: `{ success, message, data: { token, message } }`
* **Login:** `POST /api/auth/login`
  * Request Body: `{ email, password }`
  * Response: `{ success, message, data: { token, message } }`

### Link Management Endpoints
* **Create Link:** `POST /api/links`
  * Request Body: `{ originalUrl, customAlias?, password?, expiresAt? }`
  * Response: `{ success, message, data: { id, originalUrl, shortCode, shortUrl, clickCount } }`
* **List My Links:** `GET /api/links/my`
  * Query Parameters: `page`, `size`, `sortBy`, `direction`, `search`
  * Response: `{ success, message, data: Page<ShortLinkResponse> }`
* **Update Link:** `PUT /api/links/{id}`
  * Request Body: `{ originalUrl?, customAlias?, password?, expiresAt? }`
  * Response: `{ success, message, data: { id, originalUrl, shortCode, shortUrl, clickCount } }`
* **Delete Link:** `DELETE /api/links/{id}`
  * Response: `204 No Content`

### Analytics & Dashboard Endpoints
* **Get Dashboard Stats:** `GET /api/dashboard`
  * Response: `{ success, message, data: { totalLinks, activeLinks, deletedLinks, totalClicks, topLinks: [ShortLinkResponse] } }`
* **Get Link Analytics:** `GET /api/links/{id}/analytics`
  * Response: `{ success, message, data: { id, originalUrl, shortCode, shortUrl, clickCount, createdAt, deleted } }`

### Short Link Redirection
* **Redirection Route:** `GET /{shortCode}`
  * Redirects (302 Found) to the destination `originalUrl` while tracking click statistics (browser, OS, device, IP address, and referrer).

---

## 🔍 Frontend Audit Findings

Prior to this rebuild, the existing frontend (`snaplinkfrontend/`) contained the following mismatches:
1. **JavaScript instead of TypeScript:** Lacked type safety and config files (`tsconfig.json`).
2. **Missing Creation Form:** No user-facing form existed for creating new short links.
3. **Hardcoded Port Fallbacks:** Pointed users to port `8080` for redirection instead of actual active backend port `8082`.
4. **Incomplete Updates:** Link editing was restricted to `originalUrl`, ignoring custom alias, expiry date-times, and passwords.
5. **Sprawl & Redundancies:** Contained multiple empty files (`StatsCard.jsx`, `LinkCard.jsx`, `Loader.jsx`, `MainLayout.jsx`), duplicate modules, and redundant manual JWT authorization header settings.

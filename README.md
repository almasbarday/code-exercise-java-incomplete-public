# URL Shortener

A full-stack URL shortener built with Java Spring Boot on the backend and React + TypeScript on the frontend. The app accepts a long URL, optionally creates a custom alias, stores it in SQLite, and redirects requests to the original destination.

## Project overview

This repository contains:

- backend/ — Spring Boot REST API and SQLite persistence
- frontend/ — Vite + React UI for shortening and listing URLs
- docker-compose.yml — container orchestration for the API and frontend
- README.md — project setup and usage guide

### Typical flow

1. User submits a long URL in the frontend.
2. Backend validates the URL and alias.
3. A shortened alias is generated or taken from the request.
4. The record is stored in SQLite.
5. The frontend displays the shortened URL and listing.
6. Visiting the shortened path redirects back to the original URL.

## Tech stack

- Java 17
- Spring Boot 3.2
- SQLite via JDBC
- React 18
- TypeScript
- Vite
- Docker / Docker Compose

## Prerequisites

Before running the project locally, make sure you have:

- Java 17+
- Maven 3.9+
- Node.js 20+
- npm
- Docker and Docker Compose (for containerized setup)

## Local setup

### 1) Start the backend

From the repository root:

```bash
cd backend
mvn spring-boot:run
```

The backend runs by default on:

- http://localhost:8080

It reads the database from `backend/urlshortener.db` unless `DATABASE_PATH` is overridden.

Optional: run tests:

```bash
cd backend
mvn test
```

### 2) Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server runs by default on:

- http://localhost:3000

The Vite config proxies API traffic to `http://localhost:8080`, so the frontend can call `POST /shorten` and `GET /urls` without manual CORS configuration.

### 3) Build the frontend for production

```bash
cd frontend
npm install
npm run build
```

## Backend commands

From the `backend` directory:

```bash
# Run the app
mvn spring-boot:run

# Build the jar
mvn package

# Run tests
mvn test

# Run a clean build
mvn clean package
```

## Frontend commands

From the `frontend` directory:

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run frontend tests
npm test

# Watch tests in development
npm run test:watch
```

## Docker commands

From the repository root:

```bash
# Build and start both services
docker compose up --build

# Run in the background
docker compose up --build -d

# Stop services
docker compose down

# Rebuild without cache
docker compose build --no-cache

# View logs
docker compose logs -f

# View API logs only
docker compose logs -f api

# View frontend logs only
docker compose logs -f frontend
```

The Docker setup exposes:

- Frontend: http://localhost:3000
- API: http://localhost:8080

The API stores its SQLite database in a Docker volume at `/data`, so it persists between container restarts.

## API examples

All examples assume the backend is running on `http://localhost:8080`.

### Create a shortened URL

```bash
curl -X POST http://localhost:8080/shorten \
  -H "Content-Type: application/json" \
  -d '{
    "fullUrl": "https://example.com/very/long/path",
    "customAlias": "demo-link"
  }'
```

Example response:

```json
{
  "alias": "demo-link",
  "fullUrl": "https://example.com/very/long/path",
  "shortUrl": "http://localhost:8080/demo-link"
}
```

If `customAlias` is omitted, the server generates one automatically.

### List shortened URLs

```bash
curl "http://localhost:8080/urls?page=0&size=10"
```

Example response:

```json
{
  "items": [
    {
      "alias": "demo-link",
      "fullUrl": "https://example.com/very/long/path",
      "shortUrl": "http://localhost:8080/demo-link"
    }
  ],
  "totalCount": 1,
  "page": 0,
  "size": 10
}
```

### Redirect to the original URL

```bash
curl -I http://localhost:8080/demo-link
```

This returns a redirect response to the original URL.

### Delete a shortened URL

```bash
curl -X DELETE http://localhost:8080/demo-link
```

A successful delete returns `204 No Content`.

## App behavior and validation

- `fullUrl` must be a valid URL.
- `customAlias` is optional and must be 2-64 characters long.
- Allowed alias characters are letters, numbers, and hyphens.
- Duplicate aliases are rejected.
- The app returns JSON errors in the format:

```json
{
  "error": "message"
}
```

## Troubleshooting

### Backend fails to start

Check:

- Java 17 is installed
- Maven dependencies can download successfully
- The configured database path is writable

Common command:

```bash
cd backend
mvn clean package
```

### Frontend cannot reach the API

Verify:

- The backend is running on `http://localhost:8080`
- No other process is already using port `8080`
- In dev mode, Vite is configured to proxy to the backend on that port

### Docker port conflicts

If `localhost:8080` or `localhost:3000` is already in use, stop the conflicting app or change the published ports in `docker-compose.yml`.

### SQLite issues

If the database is not being created or updated:

- confirm the container has permissions for `/data`
- check the `DATABASE_PATH` environment variable
- remove the stale local SQLite file if necessary during local development

### Dependency or install problems

For frontend issues:

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

For backend issues:

```bash
cd backend
rm -rf target
mvn clean install
```

## Useful URLs

- Frontend (local dev): http://localhost:3000
- Frontend (Docker): http://localhost:3000
- Backend API: http://localhost:8080
- Example shortened URL: http://localhost:8080/demo-link

## Notes

- The Docker frontend uses Nginx to proxy `/shorten`, `/urls`, and alias-based requests to the backend.
- The app stores data in SQLite and is designed to work as a lightweight local shortener for development and demos.

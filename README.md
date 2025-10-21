# Shanks Web App — Backend

A production-ready Node.js + Express backend for the Shanks web application. Provides user management, JWT-based authentication scaffolding, MongoDB persistence via Mongoose, structured logging, and real-time-ready architecture.

## Table of contents
- About
- Features
- Tech stack
- Quick start
- Environment variables
- Available scripts
- Project structure
- Development notes
- Testing
- Docker (optional)
- Contributing
- License & maintainers

## About
This repo contains the backend API and services for the Shanks web application. It focuses on a secure user model, extensible routing, and observability using Winston + Morgan. The project uses CommonJS modules and expects a MongoDB database.

## Features
- Express server scaffold
- Mongoose models and schema validation (includes password hashing)
- JWT-ready authentication flow
- Structured logging (Winston) with Morgan integration
- Environment-based configuration (development / production)
- Ready for WebSocket/real-time extensions

## Tech stack
- Node.js
- Express
- MongoDB (Mongoose)
- Winston & Morgan (logging)
- bcrypt (password hashing)
- dotenv (configuration)

## Quick start
1. Install
   ```bash
   npm install
   ```
2. Create `.env` (see example below) and set values.
3. Start in development:
   ```bash
   npm run start:dev
   ```
4. Start in production:
   ```bash
   npm run start:prod
   ```

## Example .env
(Place at project root; do not commit secrets)
```env
APP_PORT=3000
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/shanks_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
LOG_LEVEL=info
```

## Available scripts
- `npm run start:dev` — run with nodemon (development)
- `npm run start:prod` — run production node process
- `npm test` — placeholder (configure jest tests)

## Project structure (high level)
- src/
  - server.js — app entry and server boot
  - app.js — express setup (middlewares, routes)
  - modules/
    - models/ — Mongoose schemas (e.g., user-model.js)
    - controllers/
    - routes/
    - utils/ — logger, helpers
- config/ — DB connection (e.g., config/database.js)
- logs/ — runtime logs (gitignored)

## Development notes
- Passwords are hashed in a pre-save hook in the user model (bcrypt).
- `email: { unique: true }` creates a DB index — handle duplicate key errors at runtime.
- The user schema sets `password.select = false` — ensure you explicitly select password when verifying credentials.
- Load `.env` in non-production runs (see server bootstrap).
- Consider adding rate limiting, account lockout, and strong password rules before production.

## Testing
- Add unit and integration tests with Jest or your preferred framework.
- Current `test` script is a placeholder — update to run test suites.

## Docker (optional)
Create a simple Dockerfile and docker-compose to run the service and a MongoDB service locally. Example compose:
```yaml
version: "3.8"
services:
  app:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on:
      - mongo
  mongo:
    image: mongo:6
    ports: ["27017:27017"]
```

## Contributing
- Open issues or PRs for features or fixes.
- Follow existing code patterns: keep controllers thin, use services for business logic.
- Add tests for new behavior and update README with new envvars or script changes.

## License & maintainers
License: ISC (see package.json)  
Maintainer: Bowoto Jeremiah
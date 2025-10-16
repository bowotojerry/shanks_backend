# Shanks Web App Backend

A modular Node.js/Express backend providing core services for the Shanks web application: REST endpoints, database connectivity, logging, and real-time support scaffolding.

- Language: JavaScript (CommonJS)
- Entry point: [src/server.js](src/server.js)
- Configured via: [.env](.env) / [.env.example](.env.example)
- Package manifest: [package.json](package.json)

## Features

- Express application scaffold ([`app`](src/app.js))
- MongoDB connection using Mongoose ([`mongoose`](config/database.js))
- Structured logging with Winston and Morgan integration ([`logger`, `morganStream`](src/modules/utils/logger.js))
- Server Health-check endpoint at `/api/v1/health` implemented in [src/server.js](src/server.js)
- Development and production start scripts in [package.json](package.json)
- Logs persisted to `logs/` and ignored by Git via [.gitignore](.gitignore)

## Quick Start

Prerequisites:
- Node.js 18+ (or compatible)
- A MongoDB connection URI

1. Install dependencies
```bash
npm install
```

2. Create an environment file
- Copy [.env.example](.env.example) to `.env` and set values (or edit `.env` directly). Key variables:
  - `APP_PORT` — application port
- **Never commit `.env` to Git!** Copy [.env.example](.env.example) to `.env`...
 - `MONGO_URL` — MongoDB connection string('use your own')

3. Run in development
```bash
npm run start:dev
```

4. Run in production
```bash
npm run start:prod
```

The server listens on `APP_PORT` (default 3000) and exposes a health check at:
- GET /api/v1/health (see [src/server.js](src/server.js))

## Configuration

- Application entry: [src/server.js](src/server.js)
- Express app instance: [`app`](src/app.js)
- Database connection and exported `mongoose` instance: [`mongoose`](config/database.js)
- Logging: [`logger`](src/modules/utils/logger.js) and [`morganStream`](src/modules/utils/logger.js)
- Environment variables are loaded from `.env` (when not in production) as handled in [src/server.js](src/server.js)

## Logging

Winston is configured in [src/modules/utils/logger.js](src/modules/utils/logger.js). HTTP access logs are piped from Morgan into Winston via the exported `morganStream`. Log files are written to the `logs/` directory.

## Database

The MongoDB connection is established in [config/database.js](config/database.js). The file exports the connected `mongoose` instance which is used across the app.

## Project Structure

Top-level files:
- [package.json](package.json)
- [.env.example](.env.example)
- [.gitignore](.gitignore)

Key folders:
- src/ — application source
  - [src/app.js](src/app.js)
  - [src/server.js](src/server.js)
  - src/modules/ — controllers, middlewares, models, routes, services, socket, utils
    - [src/modules/utils/logger.js](src/modules/utils/logger.js)
- config/ — infrastructural configs (e.g., [config/database.js](config/database.js))
- logs/ — runtime logs (ignored by Git)

## Development Notes

- Environment variables are conditionally loaded in [src/server.js](src/server.js) for non-production runs.
- The logger filters sensitive fields before writing logs; review [src/modules/utils/logger.js](src/modules/utils/logger.js) if you extend logging.
- The project uses CommonJS modules (see `type` in [package.json](package.json)).

## Tests

No tests are configured. The test script in [package.json](package.json) currently exits with an error placeholder.

## Contributing

- Follow existing code patterns in `src/modules/`
- Add unit tests and update `package.json` test script
- Keep secrets out of the repository; use `.env` and `.env.example`

## License

ISC — see [package.json](package.json)

## References

- Application: [`app`](src/app.js) — [src/app.js](src/app.js)  
- Server / health-check: [src/server.js](src/server.js)  
- Database connection / `mongoose`: [config/database.js](config/database.js)  
- Logger / Morgan stream: [`logger`, `morganStream`](src/modules/utils/logger.js) — [src/modules/utils/logger.js](src/modules/utils/logger.js)  
- Package metadata & scripts: [package.json](package.json)  
- Environment example: [.env.example](.env.example)  
- Git ignore: [.gitignore](.gitignore)
# ZipLinker Backend

A robust URL shortening service backend built with Node.js, Express, and PostgreSQL. Provides RESTful API for user authentication, URL shortening, link management, and click tracking.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🔍 Overview

ZipLinker backend is a secure, scalable URL shortening service that handles:
- User registration and authentication with session management
- Creation of short, unique URLs using nanoid
- Tracking of click statistics for each short link
- Link activation/deactivation controls
- RESTful API with comprehensive input validation
- Secure password storage using bcrypt
- Structured logging with Winston

## ✨ Features

### Core Functionality
- **User Authentication**: Secure registration, login, and session-based authentication
- **URL Shortening**: Generate unique short codes using nanoid (default 6 characters)
- **Link Management**: Create, list, update, and delete shortened URLs
- **Click Tracking**: Automatic increment of click count on link redirection
- **Link Control**: Enable/disable short links as needed
- **Redirect Handling**: Efficient redirection from short code to original URL

### Technical Features
- **RESTful API**: Well-organized endpoints with consistent response format
- **Input Validation**: Zod-based schema validation for all API inputs
- **Secure Passwords**: bcrypt hashing with salt for password storage
- **Session Management**: Express-session with configurable storage
- **CORS Support**: Configurable cross-origin resource sharing
- **Database ORM**: Sequelize ORM with PostgreSQL dialect
- **Environment Configuration**: Dotenv-based configuration management
- **Structured Logging**: Winston logger with multiple transports
- **TypeScript**: Full TypeScript support for enhanced developer experience
- **Error Handling**: Centralized error handling with consistent error responses

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js (v5)
- **Language**: TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Express Session
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **ID Generation**: nanoid
- **Logging**: Winston
- **Environment**: dotenv
- **HTTP Utilities**: cors, cookie-parser
- **UUID**: uuid package

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                      # Express app setup and middleware
│   ├── index.ts                    # Application entry point
│   ├── config/
│   │   └── config.ts               # Environment configuration
│   ├── controllers/
│   │   └── v1/
│   │       ├── users/
│   │       │   └── user.controller.ts
│   │       └── shortlinks/
│   │       │   └── shortlink.controller.ts
│   ├── database/
│   │   └── database.ts             # Sequelize connection and setup
│   ├── middlewares/
│   │   └── v1/
│   │       ├── auth.middleware.ts  # Authentication middleware
│   │       └── validate.middleware.ts
│   ├── models/
│   │   ├── users/
│   │   │   └── user.model.ts
│   │   ├── links/
│   │   │   └── link.model.ts
│   │   └── index.model.ts
│   ├── routes/
│   │   └── v1/
│   │       ├── users/
│   │       │   └── user.route.ts
│   │       └── shortLinks/
│   │       │   └── shortLink.route.ts
│   ├── utils/
│   │   ├── logger.util.ts
│   │   ├── responseHandler.util.ts
│   │   └── shortLink.util.ts
│   ├── validations/
│   │   ├── users/
│   │   │   └── user.validator.ts
│   │   └── shortlink/
│   │   │   └── shortlink.validator.ts
│   └── types/
│       └── express-session.d.ts
├── package.json
├── tsconfig.json
├── sample.env
└── README.md
```

## 📋 Prerequisites

Before installing ZipLinker backend, ensure you have:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher) - Package manager
- [Git](https://git-scm.com/) - Version control

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UrlShortner/backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env` file from the sample:

```bash
cp sample.env .env
```

Edit the `.env` file with your configuration (see [Configuration](#configuration) section).

### 4. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE ziplinker;  -- or your preferred name
```

## ⚙️ Configuration

The backend uses environment variables for configuration. Copy `sample.env` to `.env` and modify as needed.

### Required Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `3000` | Yes |
| `DB_NAME` | PostgreSQL database name | `ziplinker` | Yes |
| `DB_HOST` | Database host | `localhost` | Yes |
| `DB_PORT` | Database port | `5432` | Yes |
| `DB_USER` | Database username | `postgres` | Yes |
| `DB_PASSWORD` | Database password | `your_password` | Yes |
| `SESSION_SECRET` | Secret for session signing (min 32 chars) | `your_very_long_secret_key_here` | Yes |
| `BASE_URL` | Base URL for generated short links | `http://localhost:3000` | Yes |
| `WEBSITE_URL` | Frontend application URL | `http://localhost:5173` | Yes |
| `ALLOWED_ORIGINS` | CORS allowed origins (comma-separated) | `http://localhost:3000,http://localhost:5173` | Yes |
| `LOG_DIR` | Directory for log files | `./logs` | No (defaults to `./logs`) |
| `NODE_ENV` | Environment (development/production) | `development` | No (defaults to `development`) |

### Database Connection Pool

| Variable | Description | Example |
|----------|-------------|---------|
| `POOL_MIN` | Minimum connections in pool | `0` |
| `POOL_MAX` | Maximum connections in pool | `5` |
| `POOL_ACQUIRE` | Connection acquire timeout (ms) | `30000` |
| `POOL_IDLE` | Connection idle timeout (ms) | `10000` |

### Sequelize Options

| Variable | Description | Example |
|----------|-------------|---------|
| `FORCE_DROP_TABLE` | Drop tables on sync (development only) | `false` |
| `FORCE_ALTER_TABLE` | Alter tables on sync | `false` |
| `TIMESTAMPS` | Enable timestamps (createdAt/updatedAt) | `true` |
| `UNDERSCORE` | Use snake_case for columns | `true` |
| `FREEZE_TABLE_NAME` | Prevent table name pluralization | `true` |
| `TIMEZONE` | Default timezone | `UTC` |

### Retry Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_CONN_MAX_RETRY` | Max database connection retries | `3` |

## ▶️ Running the Application

### Development Mode

```bash
# Start the server with auto-reload
pnpm dev
```

The server will start at `http://localhost:3000` (or your configured PORT).

### Production Mode

```bash
# Build the TypeScript code
pnpm build

# Start the production server
pnpm start
```

### Environment-Specific Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with tsx watch |
| `pnpm build` | Compile TypeScript to JavaScript |
| `pnpm start` | Run the compiled JavaScript application |

## 📚 API Documentation

All API endpoints are prefixed with `/api/v1`. The API returns consistent JSON responses:

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {}
}
```

### Authentication Endpoints

#### Register a New User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "userId": "uuid",
    "userName": "john_doe",
    "email": "john@example.com",
    "isEmailVerified": false
  }
}
```

#### Login User
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response:**
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "userId": "uuid",
    "userName": "john_doe",
    "email": "john@example.com"
  }
}
```

### Short Links Endpoints (Require Authentication)

#### Create a Short Link
```http
POST /api/v1/shortlinks/create
Content-Type: application/json
Cookie: connect.sid=<session_cookie>

{
  "longUrl": "https://www.example.com/very/long/url/path",
  "isActive": true
}
```

**Success Response:**
```json
{
  "statusCode": 201,
  "message": "Short link created successfully",
  "data": {
    "urlId": "uuid",
    "shortCode": "aBcDeF",
    "longUrl": "https://www.example.com/very/long/url/path",
    "clicks": 0,
    "isActive": true,
    "createdAt": "2026-05-26T15:03:11.000Z",
    "updatedAt": "2026-05-26T15:03:11.000Z"
  }
}
```

#### Get All User Links
```http
GET /api/v1/shortlinks/all
Cookie: connect.sid=<session_cookie>
```

**Success Response:**
```json
{
  "statusCode": 200,
  "message": "Links retrieved successfully",
  "data": [
    {
      "urlId": "uuid",
      "shortCode": "aBcDeF",
      "longUrl": "https://www.example.com/very/long/url/path",
      "clicks": 42,
      "isActive": true,
      "createdAt": "2026-05-26T15:03:11.000Z",
      "updatedAt": "2026-05-26T15:03:11.000Z"
    }
  ]
}
```

#### Toggle Link Status (Activate/Deactivate)
```http
PATCH /api/v1/shortlinks/:urlId/toggle
Cookie: connect.sid=<session_cookie>
```

**Success Response:**
```json
{
  "statusCode": 200,
  "message": "Link status updated successfully",
  "data": {
    "urlId": "uuid",
    "isActive": false  // toggled value
  }
}
```

#### Delete a Link
```http
DELETE /api/v1/shortlinks/:urlId
Cookie: connect.sid=<session_cookie>
```

**Success Response:**
```json
{
  "statusCode": 200,
  "message": "Link deleted successfully",
  "data": {}
}
```

### Redirect Endpoint (Public)

#### Redirect to Original URL
```http
GET /:shortCode
```
Example: `GET /aBcDeF`

**Response:** HTTP 302 Redirect to the original long URL
**Side Effect:** Increments the click counter for the link

### Error Responses

All errors follow this format:
```json
{
  "statusCode": 4xx,
  "message": "Error description",
  "data": {}
}
```

Common error codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid session)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found (resource doesn't exist)
- `409`: Conflict (duplicate resource)
- `500`: Internal Server Error

## 🗄️ Database Schema

### Users Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| userId | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| userName | VARCHAR(100) | NOT NULL | User's display name |
| email | VARCHAR(255) | NOT NULL, UNIQUE | Email address |
| password | VARCHAR(255) | NOT NULL | bcrypt hashed password |
| isEmailVerified | BOOLEAN | NOT NULL, DEFAULT false | Email verification status |
| createdAt | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation time |
| updatedAt | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update time |

### Short Links Table
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| urlId | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier |
| userId | UUID | NOT NULL, FOREIGN KEY REFERENCES users(userId) | Owner of the link |
| shortCode | VARCHAR(12) | NOT NULL, UNIQUE | Unique short code (nanoid) |
| longUrl | TEXT | NOT NULL | Original URL |
| clicks | INTEGER | NOT NULL, DEFAULT 0 | Number of times link was followed |
| isActive | BOOLEAN | NOT NULL, DEFAULT true | Link activation status |
| createdAt | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Record creation time |
| updatedAt | TIMESTAMP WITH TIME ZONE | NOT NULL, DEFAULT NOW() | Last update time |

### Indexes
- `users.email` (unique)
- `shortlinks.shortCode` (unique)
- `shortlinks.userId` (foreign key)
- `shortlinks.isActive` (for filtering active links)

## 🌐 Environment Variables

Complete list of environment variables with descriptions:

### Server Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Port for the HTTP server | `3000` | `3000` |
| `NODE_ENV` | Application environment | `development` | `development`, `production` |

### Database Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DB_NAME` | PostgreSQL database name | (required) | `ziplinker` |
| `DB_HOST` | Database host server | `localhost` | `localhost`, `db.example.com` |
| `DB_PORT` | Database port | `5432` | `5432` |
| `DB_USER` | Database username | (required) | `postgres` |
| `DB_PASSWORD` | Database password | (required) | `secure_password` |

### Sequelize Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `FORCE_DROP_TABLE` | Drop tables before sync (dev only) | `false` | `true`/`false` |
| `FORCE_ALTER_TABLE` | Alter tables to match models | `false` | `true`/`false` |
| `TIMESTAMPS` | Add createdAt/updatedAt columns | `true` | `true`/`false` |
| `UNDERSCORE` | Use snake_case column names | `true` | `true`/`false` |
| `FREEZE_TABLE_NAME` | Prevent table name pluralization | `true` | `true`/`false` |
| `TIMEZONE` | Default timezone for dates | `UTC` | `UTC`, `America/New_York` |

### Connection Pool
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `POOL_MIN` | Minimum connections in pool | `0` | `0` |
| `POOL_MAX` | Maximum connections in pool | `5` | `10` |
| `POOL_ACQUIRE` | Connection acquire timeout (ms) | `30000` | `30000` |
| `POOL_IDLE` | Connection idle timeout (ms) | `10000` | `10000` |

### Retry Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DB_CONN_MAX_RETRY` | Max connection attempts | `3` | `3`, `5` |

### Session Configuration
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `SESSION_SECRET` | Secret for signing session cookies | (required) | `32+_character_random_string` |

### Application URLs
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `BASE_URL` | Base URL for generated short links | (required) | `https://yourdomain.com` |
| `WEBSITE_URL` | Frontend application URL (for CORS) | (required) | `https://yourapp.com` |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | (required) | `https://yourapp.com,https://admin.yourapp.com` |

### Logging
| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `LOG_DIR` | Directory for log files | `./logs` | `./logs`, `/var/log/ziplinker` |

## 🧪 Testing

### Manual Testing
The backend can be tested using:
- [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/)
- [curl](https://curl.se/) commands
- Browser extension REST clients

### Example curl Commands

#### Register User
```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{"userName":"testuser","email":"test@example.com","password":"testpass123"}'
```

#### Login User
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}' \
  -c cookies.txt  # Save cookies for session
```

#### Create Short Link (using session)
```bash
curl -X POST http://localhost:3000/api/v1/shortlinks/create \
  -H "Content-Type: application/json" \
  -b cookies.txt  # Use saved cookies \
  -d '{"longUrl":"https://example.com","isActive":true}'
```

### Automated Testing
Currently, automated tests are not implemented. Future versions will include:
- Unit tests with Jest
- Integration tests with Supertest
- End-to-end testing with Cypress or Playwright

To prepare for future testing:
```bash
# When tests are added
pnpm test
```

## 🤝 Contributing

We welcome contributions to improve ZipLinker backend! Please follow these guidelines:

### Reporting Issues
1. Check existing [Issues](../issues) to avoid duplicates
2. Create a new issue with:
   - Clear, descriptive title
   - Detailed steps to reproduce (if applicable)
   - Expected vs actual behavior
   - Relevant logs or error messages
   - Environment details (Node.js version, OS, etc.)

### Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the existing code style
4. Add or update tests as appropriate
5. Ensure your code passes ESLint: `pnpm lint` (when configured)
6. Commit changes with descriptive messages:
   - `feat: add new feature`
   - `fix: resolve issue`
   - `docs: update documentation`
   - `refactor: improve code structure`
   - `test: add/update tests`
7. Push to your fork: `git push origin feature/your-feature-name`
8. Open a Pull Request against the `main` branch

### Code Style Guidelines
- Follow TypeScript ESLint configurations (to be added)
- Use 2-space indentation
- Prefer `const` and `let` over `var`
- Write descriptive variable and function names
- Add JSDoc comments for complex functions
- Keep functions focused and under 50 lines when possible
- Handle errors appropriately with try/catch or promise rejection

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Database Connection Errors
**Symptoms:** 
- `Failed to connect to database` errors on startup
- Application crashes during initialization

**Solutions:**
1. Verify PostgreSQL service is running:
   ```bash
   # Linux
   sudo systemctl status postgresql
   
   # macOS (with Homebrew)
   brew services list postgresql
   
   # Windows
   Get-Service postgresql
   ```
2. Check `.env` database credentials:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
3. Ensure the database exists:
   ```sql
   CREATE DATABASE your_database_name;
   ```
4. Verify network connectivity to the database host
5. Check PostgreSQL `pg_hba.conf` for authentication settings

#### Port Already in Use
**Symptoms:**
- `EADDRINUSE: Address already in use` error
- Server fails to start

**Solutions:**
1. Find the process using the port:
   ```bash
   # Linux/macOS
   lsof -i :3000
   
   # Windows
   netstat -ano | findstr :3000
   ```
2. Kill the conflicting process:
   ```bash
   # Linux/macOS
   kill -9 <PID>
   
   # Windows
   taskkill /PID <PID> /F
   ```
3. Alternatively, change the `PORT` in `.env` to an available port

#### Authentication Issues
**Symptoms:**
- 401 Unauthorized errors on protected endpoints
- Session not persisting between requests

**Solutions:**
1. Verify `SESSION_SECRET` is set (minimum 32 characters)
2. Check that cookies are being sent and received:
   - Ensure frontend and backend domains match or CORS is configured
   - Verify `cookie-parser` middleware is applied
3. Confirm session middleware is registered before routes
4. Check browser/storage is accepting cookies (not blocked by privacy settings)
5. In development, ensure both frontend and backend use HTTP (not mixed HTTPS/HTTP)

#### CORS Errors
**Symptoms:**
- `Access to XMLHttpRequest at ... from origin ... has been blocked by CORS policy`
- OPTIONS request failures

**Solutions:**
1. Verify `ALLOWED_ORIGINS` in `.env` includes the frontend origin
2. Ensure origins are comma-separated without spaces:
   - Correct: `http://localhost:3000,http://localhost:5173`
   - Incorrect: `http://localhost:3000, http://localhost:5173`
3. Check that `cors()` middleware is applied before routes
4. For credentials (cookies), ensure:
   - Backend: `cors({ origin: ..., credentials: true })`
   - Frontend: `credentials: 'include'` in fetch options

#### Application Performance Issues
**Symptoms:**
- Slow response times
- High memory usage
- Database connection exhaustion

**Solutions:**
1. Check database query performance:
   - Add indexes on frequently queried columns (shortCode, userId)
   - Use `EXPLAIN ANALYZE` to identify slow queries
2. Monitor connection pool usage:
   - Increase `POOL_MAX` if frequently exhausting connections
   - Ensure connections are properly released
3. Enable query logging in development to spot N+1 queries:
   - Set Sequelize logging to show SQL queries
4. Consider adding Redis for session storage in production
5. Use clustering or PM2 for multi-core utilization

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [PostgreSQL](https://www.postgresql.org/) - Advanced open-source relational database
- [Sequelize](https://sequelize.org/) - Promise-based Node.js ORM
- [Express Session](https://www.npmjs.com/package/express-session) - Session middleware
- [bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing library
- [nanoid](https://github.com/ai/nanoid) - Tiny, secure, URL-friendly ID generator
- [Zod](https://zod.dev/) - TypeScript-first schema validation with static inference
- [Winston](https://github.com/winstonjs/winston) - Multi-transport async logging library
- [dotenv](https://www.npmjs.com/package/dotenv) - Environment variable loader
- [cors](https://www.npmjs.com/package/cors) - Express CORS middleware
- [cookie-parser](https://www.npmjs.com/package/cookie-parser) - Cookie parsing middleware
- [uuid](https://www.npmjs.com/package/uuid) - RFC4122 UUID generator

<div align="center">
  Made with ❤️ by the ZipLinker Team
</div>
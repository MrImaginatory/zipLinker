# ZipLinker

A URL shortening service built with Node.js, Express, and PostgreSQL. ZipLinker allows users to create short, manageable links from long URLs, track click statistics, and manage their links through a RESTful API.

## Features

- **User Authentication**: Secure user registration and login with session-based authentication
- **URL Shortening**: Convert long URLs into short, unique links using nanoid
- **Link Management**: Create and list your shortened URLs
- **Click Tracking**: Automatic click count increment on link redirection
- **Link Activation Control**: Enable/disable short links as needed
- **PostgreSQL Database**: Robust data storage with Sequelize ORM

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Express Session with cookie-based sessions
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Logging**: Winston
- **ID Generation**: nanoid

## Project Structure

```
backend/
├── src/
│   ├── app.ts                      # Main application setup
│   ├── index.ts                    # Entry point
│   ├── config/
│   │   └── config.ts               # Environment configuration
│   ├── controllers/
│   │   └── v1/
│   │       ├── users/
│   │       │   └── user.controller.ts
│   │       └── shortlinks/
│   │           └── shortlink.controller.ts
│   ├── database/
│   │   └── database.ts             # Sequelize connection
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
│   │           └── shortLink.route.ts
│   ├── utils/
│   │   ├── logger.util.ts
│   │   ├── responseHandler.util.ts
│   │   └── shortLink.util.ts
│   ├── validations/
│   │   ├── users/
│   │   │   └── user.validator.ts
│   │   └── shortlink/
│   │       └── shortlink.validator.ts
│   └── types/
│       └── express-session.d.ts
├── package.json
├── tsconfig.json
└── sample.env
```

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- pnpm (package manager)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UrlShortner/backend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Copy the sample environment file and configure it:

```bash
cp sample.env .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_NAME=your_database_name
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password

# Database Sync Options
FORCE_DROP_TABLE=false
FORCE_ALTER_TABLE=false

# Connection Pool
POOL_MIN=0
POOL_MAX=5
POOL_ACQUIRE=30000
POOL_IDLE=10000

# Retry Configuration
DB_CONN_MAX_RETRY=3

# Sequelize Model Options
TIMESTAMPS=true
UNDERSCORE=true
FREEZE_TABLE_NAME=true

# Timezone
TIMEZONE=UTC

# Session
SESSION_SECRET=your_secret_key_here

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Application URLs
WEBSITE_URL=http://localhost:5173
BASE_URL=http://localhost:3000
LOG_DIR=./logs

# Environment
NODE_ENV=development
```

### 4. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE your_database_name;
```

### 5. Run the Application

**Development Mode:**
```bash
pnpm dev
```

**Production Build:**
```bash
pnpm build
pnpm start
```

## API Endpoints

### Authentication

#### Register User
```http
POST /api/v1/users/register
Content-Type: application/json

{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Short Links (Requires Authentication)

#### Create Short Link
```http
POST /api/v1/shortlinks/create
Content-Type: application/json

{
  "longUrl": "https://www.example-long-url.com/very/long/path",
  "isActive": true
}
```

#### Get All User Links
```http
GET /api/v1/shortlinks/all
```

### Redirect
```http
GET /{shortCode}
```
Redirects to the original long URL.

## Response Format

All API responses follow this format:

```json
{
  "statusCode": 200,
  "message": "Success message",
  "data": {}
}
```

## Dependencies

### Production Dependencies
- `@sequelize/core` - Sequelize ORM
- `@sequelize/postgres` - PostgreSQL dialect for Sequelize
- `bcrypt` - Password hashing
- `cookie-parser` - Cookie parsing middleware
- `cors` - CORS middleware
- `dotenv` - Environment variable loader
- `dottie` - Object dot notation access
- `express` - Web framework
- `express-session` - Session middleware
- `nanoid` - Unique ID generator
- `pg` - PostgreSQL client
- `pg-hstore` - PostgreSQL hstore parser
- `uuid` - UUID generator
- `winston` - Logging library
- `zod` - Schema validation

### Dev Dependencies
- `tsx` - TypeScript execution engine
- `typescript` - TypeScript compiler

## Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| userId | UUID | Primary key |
| userName | String | User's display name |
| email | String | Unique email address |
| password | String | Hashed password |
| isEmailVerified | Boolean | Email verification status |

### Short Links Table
| Column | Type | Description |
|--------|------|-------------|
| urlId | UUID | Primary key |
| userId | UUID | Foreign key to Users |
| shortCode | String | Unique short code |
| longUrl | String | Original URL |
| clicks | Integer | Click counter |
| isActive | Boolean | Link activation status |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Update timestamp |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port number |
| `DB_NAME` | PostgreSQL database name |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `SESSION_SECRET` | Secret key for session signing |
| `BASE_URL` | Base URL for generated short links |
| `NODE_ENV` | Environment (development/production) |

## License

ISC
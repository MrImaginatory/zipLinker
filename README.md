# ZipLinker

A modern URL shortening service built with a Node.js/Express backend and Next.js frontend. ZipLinker allows users to create short, manageable links from long URLs, track click statistics, and manage their links through a beautiful, responsive interface.

## ✨ Features

### Backend
- **User Authentication**: Secure user registration and login with session-based authentication
- **URL Shortening**: Convert long URLs into short, unique links using nanoid
- **Link Management**: Create and list your shortened URLs
- **Click Tracking**: Automatic click count increment on link redirection
- **Link Activation Control**: Enable/disable short links as needed
- **PostgreSQL Database**: Robust data storage with Sequelize ORM
- **RESTful API**: Well-documented API endpoints for all functionality
- **Input Validation**: Zod-based schema validation
- **Secure Passwords**: bcrypt hashing for password storage
- **Structured Logging**: Winston logger for application monitoring
- **CORS Support**: Configurable cross-origin resource sharing

### Frontend
- **Modern UI**: Built with Next.js 16, React 19, and Tailwind CSS 4
- **Beautiful Design**: Striking landing page with WebGL-powered 3D animations
- **Responsive Layout**: Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Mode**: Automatic theme detection with manual override
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Intuitive Navigation**: Easy access to dashboard, link creation, and profile
- **Real-time Updates**: Instant feedback on link creation and management
- **Error Handling**: Graceful handling of API errors and validation issues
- **Loading States**: Visual feedback during asynchronous operations

## 🏗️ Architecture

ZipLinker follows a modern full-stack architecture:

```
┌─────────────────┐    ┌──────────────────────┐    ┌────────────────────┐
│   Frontend      │    │      Backend         │    │    Database        │
│ (Next.js 16)    │◄──►│ (Node.js/Express)    │◄──►│ (PostgreSQL)       │
│ - React 19      │    │ - Sequelize ORM      │    │ - Users Table      │
│ - Tailwind CSS 4│    │ - Express.js         │    │ - Links Table      │
│ - Shadcn UI     │    │ - PostgreSQL Driver  │    │                    │
│ - Framer Motion │    │ - Winston Logger     │    │                    │
│ - Three.js      │    │ - Zod Validation     │    │                    │
└─────────────────┘    └──────────────────────┘    └────────────────────┘
        ▲                          │
        │                          ▼
        │                  ┌──────────────────┐
        │                  │   REST API       │
        │                  │   (JSON)         │
        │                  └──────────────────┘
        │
        └────── HTTP/HTTPS ────────┘
```

## 📋 Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v12 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher) - Package manager
- [Git](https://git-scm.com/) - Version control

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UrlShortner
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
pnpm install
```

#### Environment Configuration
```bash
cp sample.env .env
```

Edit the `.env` file with your configuration:

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

#### Database Setup
```sql
CREATE DATABASE your_database_name;
```

### 3. Frontend Setup

#### Install Dependencies
```bash
cd ../frontend
pnpm install
```

#### Environment Configuration
Create a `.env.local` file in the frontend directory:

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Override default port
# NEXT_PUBLIC_APP_URL=http://localhost:5173
```

### 4. Run the Application

#### Development Mode (Recommended for Development)
Start both servers simultaneously:

```bash
# In one terminal - Backend
cd backend
pnpm dev

# In another terminal - Frontend
cd frontend
pnpm dev
```

The frontend will be available at [http://localhost:5173](http://localhost:5173)
The backend API will be available at [http://localhost:3000](http://localhost:3000)

#### Production Build
```bash
# Build backend
cd backend
pnpm build
pnpm start

# Build frontend (separate deployment)
cd frontend
pnpm build
pnpm start
```

## 🔌 API Endpoints

All API endpoints are prefixed with `/api/v1`

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

Response:
```json
{
  "statusCode": 201,
  "message": "Short link created successfully",
  "data": {
    "urlId": "uuid",
    "shortCode": "abc123",
    "longUrl": "https://www.example-long-url.com/very/long/path",
    "clicks": 0,
    "isActive": true,
    "createdAt": "2026-05-26T14:54:54.000Z",
    "updatedAt": "2026-05-26T14:54:54.000Z"
  }
}
```

#### Get All User Links
```http
GET /api/v1/shortlinks/all
```

Response:
```json
{
  "statusCode": 200,
  "message": "Links retrieved successfully",
  "data": [
    {
      "urlId": "uuid",
      "shortCode": "abc123",
      "longUrl": "https://www.example-long-url.com/very/long/path",
      "clicks": 42,
      "isActive": true,
      "createdAt": "2026-05-26T14:54:54.000Z",
      "updatedAt": "2026-05-26T14:54:54.000Z"
    }
  ]
}
```

#### Update Link Status
```http
PATCH /api/v1/shortlinks/:urlId/toggle
```

#### Delete Link
```http
DELETE /api/v1/shortlinks/:urlId
```

### Redirect
```http
GET /:shortCode
```
Redirects to the original long URL and increments click counter.

## 📦 Dependencies

### Backend Dependencies
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

### Frontend Dependencies
- `next` - React framework (v16.2.6)
- `react` - UI library (v19.2.4)
- `react-dom` - React DOM (v19.2.4)
- `@base-ui/react` - Base UI components
- `@react-three/drei` & `@react-three/fiber` - 3D rendering
- `framer-motion` - Animations
- `lucide-react` - Icons
- `next-themes` - Theme switching
- `shadcn` - UI component library
- `tailwindcss` - Utility-first CSS framework
- `tw-animate-css` - Tailwind CSS animations
- `three` - 3D library
- `class-variance-authority` - CSS variance utility
- `clsx` - Class name utility

### Development Dependencies
- `typescript` - TypeScript compiler
- `tsx` - TypeScript execution (backend)
- `eslint` - Code linting
- `eslint-config-next` - Next.js ESLint config
- `@types/*` - TypeScript definitions
- `tailwindcss` & `@tailwindcss/postcss` - CSS processing

## 🗄️ Database Schema

### Users Table
| Column | Type | Description |
|--------|------|-------------|
| userId | UUID | Primary key |
| userName | String | User's display name |
| email | String | Unique email address |
| password | String | Hashed password |
| isEmailVerified | Boolean | Email verification status |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Short Links Table
| Column | Type | Description |
|--------|------|-------------|
| urlId | UUID | Primary key |
| userId | UUID | Foreign key to Users |
| shortCode | String | Unique short code (nanoid) |
| longUrl | String | Original URL |
| clicks | Integer | Click counter |
| isActive | Boolean | Link activation status |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## ⚙️ Environment Variables

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `DB_NAME` | PostgreSQL database name | `ziplinker` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_USER` | Database username | `postgres` |
| `DB_PASSWORD` | Database password | `secret` |
| `SESSION_SECRET` | Secret key for session signing | `your_32_char_secret` |
| `BASE_URL` | Base URL for generated short links | `http://localhost:3000` |
| `WEBSITE_URL` | Frontend application URL | `http://localhost:5173` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:3000,http://localhost:5173` |
| `LOG_DIR` | Directory for log files | `./logs` |
| `NODE_ENV` | Environment (development/production) | `development` |
| `FORCE_DROP_TABLE` | Drop tables on sync (dev only) | `false` |
| `FORCE_ALTER_TABLE` | Alter tables on sync | `false` |
| `POOL_MIN` | Database connection pool minimum | `0` |
| `POOL_MAX` | Database connection pool maximum | `5` |
| `POOL_ACQUIRE` | Connection acquire timeout (ms) | `30000` |
| `POOL_IDLE` | Connection idle timeout (ms) | `10000` |
| `DB_CONN_MAX_RETRY` | Database connection max retries | `3` |
| `TIMESTAMPS` | Enable timestamps | `true` |
| `UNDERSCORE` | Use snake_case | `true` |
| `FREEZE_TABLE_NAME` | Prevent table name pluralization | `true` |
| `TIMEZONE` | Default timezone | `UTC` |

### Frontend (.env.local)
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL (optional) | `http://localhost:5173` |

## 🧪 Testing

### Backend Testing
Currently, the backend focuses on manual testing through API clients like Postman or curl. Future versions will include automated tests.

### Frontend Testing
The frontend uses Next.js built-in testing capabilities. To run tests:

```bash
cd frontend
pnpm test  # When tests are implemented
```

## 📱 Responsive Design

ZipLinker is designed to work across all device sizes:

- **Mobile** (< 640px): Optimized touch targets, vertical layout
- **Tablet** (640px - 1024px): Adaptive grid layouts
- **Desktop** (> 1024px): Full-featured layout with sidebar

## 🔒 Security Features

- **Password Hashing**: All passwords are bcrypt hashed with salt
- **Session Security**: HTTP-only cookies with secure flags in production
- **Input Validation**: All API inputs validated with Zod schemas
- **CORS Protection**: Configured origins only
- **SQL Injection Prevention**: Sequelize ORM with parameterized queries
- **Rate Limiting**: Planned for future implementation
- **XSS Protection**: React auto-escaping + sanitization where needed

## 🤝 Contributing

We welcome contributions to ZipLinker! Please follow these guidelines:

### Reporting Issues
1. Check if the issue already exists in [Issues](../issues)
2. Create a new issue with clear title and description
3. Include steps to reproduce, expected behavior, and actual behavior
4. Add relevant screenshots or error logs

### Pull Requests
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the code style
4. Add tests for new functionality (when applicable)
5. Commit your changes: `git commit -m 'feat: add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request against the `main` branch

### Code Style
- Follow TypeScript ESLint rules configured in both backend and frontend
- Use Prettier for code formatting (configured in respective projects)
- Write descriptive commit messages following [Conventional Commits](https://www.conventionalcommits.org/)
- Keep PRs focused on a single feature or bug fix

## 🐛 Troubleshooting

### Common Issues

#### Backend
- **Database Connection Failed**
  - Verify PostgreSQL is running
  - Check `.env` database credentials
  - Ensure database exists: `CREATE DATABASE your_database_name;`
  
- **Port Already in Use**
  - Change PORT in `.env` or stop conflicting service
  - Use `lsof -i :3000` to find conflicting process
  
- **Authentication Not Working**
  - Verify SESSION_SECRET is set (minimum 32 characters)
  - Check cookie settings in browser
  - Ensure CORS origins include frontend URL

#### Frontend
- **API Connection Errors**
  - Verify backend is running on correct port
  - Check `NEXT_PUBLIC_API_URL` in `.env.local`
  - Ensure CORS settings in backend allow frontend origin
  
- **Build Failures**
  - Clear cache: `pnpm run clean` (if available) or delete `.next` folder
  - Update dependencies: `pnpm update`
  - Check for TypeScript errors

#### General
- **Performance Issues**
  - Check database indexes on frequently queried columns
  - Monitor connection pool usage
  - Enable query logging in development to spot slow queries
  
- **Session Expires Too Quickly**
  - Adjust express-session cookie.maxAge in backend config
  - Consider using refresh tokens for long sessions

## 📚 FAQ

### General Questions
**Q: Is ZipLinker suitable for production use?**
A: Yes, ZipLinker is production-ready with proper database, secure authentication, and scalable architecture. For high-traffic applications, consider adding a load balancer, Redis for session storage, and CDN for static assets.

**Q: Can I use ZipLinker with a custom domain?**
A: Yes, configure the `BASE_URL` environment variable to match your domain, and ensure your DNS points to your server.

**Q: Does ZipLinker support link expiration?**
A: Not currently in the core functionality, but the `isActive` field can be used to implement expiration logic in the frontend or via scheduled backend jobs.

**Q: How are short codes generated?**
A: ZipLinker uses nanoid to generate cryptographically-secure, URL-friendly unique identifiers by default (size: 6 characters).

**Q: Can I customize the short code length?**
A: Yes, modify the nanoid generation in `backend/src/utils/shortLink.util.ts` to change the size parameter.

### Technical Questions
**Q: Why use Express.js instead of a newer framework?**
A: Express provides maturity, stability, and extensive middleware ecosystem while remaining lightweight and performant for API services.

**Q: Why Sequelize instead of Prisma or TypeORM?**
A: Sequelize offers excellent TypeScript support, mature feature set, and active maintenance. Evaluation showed it met our requirements best.

**Q: Why Next.js for the frontend?**
A: Next.js provides excellent performance, SEO capabilities, intuitive file-based routing, and excellent developer experience with features like Hot Module Replacement.

**Q: Is the 3D landing page essential?**
A: The 3D elements enhance user engagement and showcase modern web capabilities, but the core functionality works without JavaScript (though UX is degraded).

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Express.js](https://expressjs.com/) - Web framework
- [PostgreSQL](https://www.postgresql.org/) - Advanced open-source database
- [Sequelize](https://sequelize.org/) - Promise-based Node.js ORM
- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [nanoid](https://github.com/ai/nanoid) - Tiny, secure ID generator
- [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed components
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide Icons](https://lucide.dev/) - Beautiful open-source icons
- [Winston](https://github.com/winstonjs/winston) - Logging library
- [Zod](https://zod.dev/) - TypeScript-first schema validation

---

<div align="center">
  Made with ❤️ by the ZipLinker Team
</div>
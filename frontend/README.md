# ZipLinker Frontend

A modern, responsive frontend for the ZipLinker URL shortening service built with Next.js 16, React 19, and Tailwind CSS 4. Features a beautiful landing page with WebGL-powered 3D animations, intuitive dashboard, and seamless user experience for managing shortened URLs.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [API Integration](#api-integration)
- [Testing](#testing)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🔍 Overview

The ZipLinker frontend provides a beautiful, intuitive interface for:
- Creating and managing shortened URLs
- Tracking click statistics
- User authentication and profile management
- Responsive design that works on mobile, tablet, and desktop
- Beautiful landing page with WebGL 3D animations
- Dark/light theme support with system preference detection
- Smooth animations and transitions

## ✨ Features

### User Interface
- **Striking Landing Page**: Hero section with 3D chain animation using Three.js and React Three Fiber
- **Intuitive Navigation**: Easy access to dashboard, link creation, and authentication
- **Responsive Design**: Optimized for mobile (<640px), tablet (640px-1024px), and desktop (>1024px)
- **Dark/Light Mode**: Automatic detection of system preference with manual override
- **Smooth Animations**: Framer Motion for enhanced user experience
- **Beautiful Components**: Built with Shadcn UI and Tailwind CSS 4
- **Icon System**: Lucide icons for consistent, beautiful visuals

### Core Functionality
- **User Authentication**: Secure login and registration flows
- **URL Shortening**: Create short links with customizable options
- **Link Management**: View, edit, delete, and toggle link status
- **Click Statistics**: Visual representation of link performance
- **Copy to Clipboard**: Easy sharing of shortened URLs
- **Loading States**: Visual feedback during asynchronous operations
- **Error Handling**: Graceful handling of API and validation errors
- **Form Validation**: Client-side validation with Zod-like schemas

### Technical Features
- **Modern Stack**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom configuration
- **State Management**: React hooks and context for global state
- **Data Fetching**: SWR or React Query for efficient data fetching
- **API Integration**: Type-safe communication with backend API
- **Environment Variables**: Configuration through environment variables
- **SEO Optimized**: Proper metadata and semantic HTML
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Code splitting, lazy loading, and optimized assets

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: Shadcn UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **3D Graphics**: Three.js (@react-three/fiber, @react-three/drei)
- **Theme Management**: Next-themes
- **Language**: TypeScript
- **HTTP Client**: Built-in fetch or axios
- **State Management**: React Context/Hooks (or Zustand as seen in deps)
- **Build Tool**: Next.js compiler (SWC/Turbopack)
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier (implied by project setup)

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js app directory (App Router)
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   ├── dashboard/                # Dashboard route
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx              # Dashboard page
│   ├── login/                    # Login route
│   │   └── page.tsx              # Login page
│   ├── register/                 # Register route
│   │   └── page.tsx              # Register page
│   ├── create-link/              # Create link route
│   │   └── page.tsx              # Create link page
│   └── api/                      # API routes (if any)
│       └── ...                   # Backend proxy or API handlers
├── components/                   # Reusable UI components
│   ├── ui/                       # Shadcn UI components
│   ├── layout/                   # Layout components (header, footer, etc.)
│   ├── links/                    # Link-related components
│   └── auth/                     # Authentication components
├── lib/                          # Utility functions and helpers
│   ├── api/                      # API client functions
│   ├── utils/                    # Utility functions
│   └── hooks/                    # Custom React hooks
├── styles/                       # CSS and Tailwind configuration
│   ├── globals.css               # Global styles
│   └── tailwind.config.ts        # Tailwind configuration
├── public/                       # Static assets
│   ├── images/                   # Image assets
│   ├── icons/                    # Icon assets
│   └── ...                       # Other static files
├── types/                        # TypeScript type definitions
├── package.json
├── tsconfig.json
├── postcss.config.mjs
├── README.md
└── .env.local.example            # Environment variables template
```

## 📋 Prerequisites

Before installing ZipLinker frontend, ensure you have:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) (v8 or higher) - Package manager
- [Git](https://git-scm.com/) - Version control
- A modern web browser (Chrome, Firefox, Safari, Edge)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd UrlShortner/frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file from the example (if provided) or create one manually:

```bash
cp .env.local.example .env.local  # If example exists
# or
touch .env.local
```

Edit the `.env.local` file with your configuration (see [Configuration](#configuration) section).

## ⚙️ Configuration

The frontend uses environment variables for configuration. Create a `.env.local` file in the root of the frontend directory.

### Required Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Base URL for the backend API | `http://localhost:3000` | Yes |
| `NEXT_PUBLIC_APP_URL` | URL of the frontend application (optional) | `http://localhost:5173` | No |

### Optional Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_ANALYTICS_ID` | Google Analytics or similar ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error reporting DSN | `https://xxx@sentry.io/xxx` |
| `NEXT_PUBLIC_ENABLE_ANIMATIONS` | Toggle animations on/off | `true`/`false` |
| `NEXT_PUBLIC_DEFAULT_THEME` | Default color theme | `system`, `light`, `dark` |

> **Note**: Environment variables must be prefixed with `NEXT_PUBLIC` to be exposed to the browser.

## ▶️ Running the Application

### Development Mode

```bash
# Start the development server
pnpm dev
```

The application will be available at [http://localhost:5173](http://localhost:5173) (or the port configured in your dev setup).

### Development with Backend

For full functionality, run both frontend and backend:

```bash
# Terminal 1 - Backend
cd ../backend
pnpm dev

# Terminal 2 - Frontend
cd ../frontend
pnpm dev
```

### Environment-Specific Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with Hot Module Replacement |
| `pnpm build` | Create production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint for code quality |

## 🏗️ Building for Production

### Create Production Build

```bash
pnpm build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
pnpm start
```

The production server will be available at [http://localhost:3000](http://localhost:3000) by default (port may vary based on configuration).

### Preview Build Locally

```bash
pnpm build && pnpm start
```

## 🔌 API Integration

The frontend communicates with the ZipLinker backend REST API. All API calls are made to the URL specified in `NEXT_PUBLIC_API_URL`.

### API Client Example

```typescript
// lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiClient = {
  async register(userData: { userName: string; email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
      credentials: 'include', // Important for cookies/sessions
    });
    return response.json();
  },

  async login(credentials: { email: string; password: string }) {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
      credentials: 'include',
    });
    return response.json();
  },

  async createLink(linkData: { longUrl: string; isActive?: boolean }) {
    const response = await fetch(`${API_BASE_URL}/api/v1/shortlinks/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(linkData),
      credentials: 'include',
    });
    return response.json();
  },

  async getUserLinks() {
    const response = await fetch(`${API_BASE_URL}/api/v1/shortlinks/all`, {
      method: 'GET',
      credentials: 'include',
    });
    return response.json();
  },

  async toggleLinkStatus(linkId: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/shortlinks/${linkId}/toggle`, {
      method: 'PATCH',
      credentials: 'include',
    });
    return response.json();
  },

  async deleteLink(linkId: string) {
    const response = await fetch(`${API_BASE_URL}/api/v1/shortlinks/${linkId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.json();
  }
};
```

### Authentication Handling

The frontend handles authentication through cookies (session-based). Key points:

1. **Credentials**: All API requests to the backend must include `credentials: 'include'` to send/receive session cookies
2. **Session Persistence**: The backend uses express-session, so session state is maintained via cookies
3. **Protected Routes**: Routes that require authentication should check session status (via context or hook)
4. **Logout**: Typically handled by calling a backend logout endpoint to clear the session

### Error Handling

API calls should handle various error scenarios:

```typescript
try {
  const response = await apiClient.createLink({ longUrl: "https://example.com" });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'API error');
  }
  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle network errors or API errors
  console.error('Failed to create link:', error);
  // Show user-friendly error message
}
```

## 🧪 Testing

### Current Testing Setup

The frontend currently uses Next.js's built-in testing capabilities. When tests are implemented:

```bash
# Run tests
pnpm test
```

### Types of Tests to Implement

1. **Unit Tests**: For utility functions, hooks, and components
2. **Integration Tests**: For API client and data flow
3. **End-to-End Tests**: Using Playwright or Cypress for user flows

### Recommended Testing Libraries

- **Jest**: Testing framework
- **React Testing Library**: For testing React components
- **Playwright**: For end-to-end testing (alternatively Cypress)
- **MSW (Mock Service Worker)**: For mocking API requests

### Example Test Structure

```
frontend/
├── __tests__/                  # Test files
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── e2e/                    # End-to-end tests
├── components/
│   └── __tests__/              # Component-specific tests
├── lib/
│   └── __tests__/              # Library/test utilities
└── hooks/
    └── __tests__/              # Custom hook tests
```

## 🤝 Contributing

We welcome contributions to improve ZipLinker frontend! Please follow these guidelines:

### Reporting Issues
1. Check existing [Issues](../issues) to avoid duplicates
2. Create a new issue with:
   - Clear, descriptive title
   - Detailed steps to reproduce (if applicable)
   - Expected vs actual behavior
   - Relevant screenshots or screen recordings
   - Environment details (browser, OS, Node.js version)

### Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the existing code style
4. Add or update tests as appropriate
5. Ensure your code passes ESLint: `pnpm lint`
6. Run linting fix if available: `pnpm lint:fix` (when configured)
7. Commit changes with descriptive messages following [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add new feature`
   - `fix: resolve issue`
   - `docs: update documentation`
   - `refactor: improve code structure`
   - `test: add/update tests`
   - `chore: update dependencies/build`
8. Push to your fork: `git push origin feature/your-feature-name`
9. Open a Pull Request against the `main` branch

### Code Style Guidelines
- Follow the existing TypeScript ESLint configuration
- Use 2-space indentation
- Prefer `const` and `let` over `var`
- Write descriptive variable and function names
- Keep components focused and reusable
- Extract complex logic into custom hooks or utility functions
- Add JSDoc comments for complex functions
- Handle errors gracefully with try/catch or error boundaries
- Use TypeScript strictly - avoid `any` when possible
- Follow Next.js best practices for the App Router
- Optimize images and assets
- Ensure accessibility compliance (WCAG 2.1 AA)

### UI/UX Guidelines
- Maintain consistency with existing design system
- Use Shadcn UI components when possible
- Follow Tailwind CSS utility-first approach
- Ensure responsive design works on all breakpoints
- Provide meaningful loading states and error messages
- Keep animations smooth and purposeful
- Maintain accessible color contrast ratios
- Use semantic HTML elements

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Development Server Problems
**Symptoms:**
- `pnpm dev` fails to start
- Port already in use error
- Module not found errors

**Solutions:**
1. Verify port availability:
   ```bash
   # Check what's using port 5173
   lsof -i :5173  # Linux/macOS
   netstat -ano | findstr :5173  # Windows
   ```
2. Kill conflicting processes or change port in `next.config.js`
3. Clear Node.js cache: `pnpm dlx @next/env@latest clear`
4. Reinstall dependencies: `rm -rf node_modules && pnpm install`
5. Check for TypeScript compilation errors

#### Build Failures
**Symptoms:**
- `pnpm build` fails with errors
- Memory allocation issues during build
- Missing module dependencies

**Solutions:**
1. Increase Node.js memory limit:
   ```bash
   # For build
   NODE_OPTIONS="--max-old-space-size=4096" pnpm build
   ```
2. Clear `.next` cache: `rm -rf .next`
3. Update dependencies: `pnpm update`
4. Check for deprecated API usage in Next.js 16
5. Verify TypeScript configuration compatibility

#### API Connection Issues
**Symptoms:**
- Frontend cannot connect to backend
- CORS errors in browser console
- Network errors when submitting forms

**Solutions:**
1. Verify `NEXT_PUBLIC_API_URL` in `.env.local` is correct
2. Ensure backend is running and accessible
3. Check backend CORS configuration includes frontend origin
4. Verify network connectivity (firewall, proxy settings)
5. For development, ensure both use HTTP or both use HTTPS (avoid mixed content)
6. Check that credentials are being sent correctly (`credentials: 'include'`)

#### Styling and Layout Issues
**Symptoms:**
- Tailwind classes not applying
- Layout broken on mobile
- Dark mode not working

**Solutions:**
1. Verify Tailwind CSS is properly configured in `tailwind.config.ts`
2. Check `postcss.config.mjs` for correct plugins
3. Ensure `@tailwindcss/postcss` is installed and configured
4. Verify content paths in Tailwind config include all necessary directories
5. Check for CSS specificity issues
6. Verify dark mode class is being applied to `<html>` element
7. Test with browser dev tools to inspect computed styles

#### Performance Issues
**Symptoms:**
- Slow initial load
- Laggy interactions
- High memory usage

**Solutions:**
1. Use Next.js DevTools to analyze performance
2. Check for unnecessary re-renders with React DevTools Profiler
3. Optimize images with Next.js Image component
4. Implement lazy loading for below-the-fold content
5. Split large components into smaller, lazy-loaded chunks
6. Use `useMemo` and `useCallback` for expensive computations
7. Analyze bundle size with next-bundle-analyzer
8. Consider implementing skeleton loaders for perceived performance

#### 3D Animation Problems
**Symptoms:**
- WebGL context errors
- 3D models not rendering
- Performance issues with Three.js

**Solutions:**
1. Check browser WebGL support: `navigator.gpu` or WebGL2 availability
2. Verify Three.js and React Three Fiber versions are compatible
3. Ensure canvas element has proper dimensions
4. Dispose of Three.js objects properly to prevent memory leaks
5. Use `useFrame` hook efficiently for animations
6. Consider reducing complexity or quality for lower-end devices
7. Provide fallback experience for browsers without WebGL support

### Environment Variable Issues
**Symptoms:**
- `undefined` values in code
- Build fails due to missing env vars
- Runtime errors when accessing process.env

**Solutions:**
1. Verify `.env.local` file exists in frontend root
2. Ensure variable names are prefixed with `NEXT_PUBLIC`
3. Check for typos in variable names
4. Remember that env vars are replaced at build time, not runtime
5. For runtime config, consider using a separate config fetching mechanism
6. Restart dev server after changing `.env.local` files

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautifully designed, accessible components
- [Framer Motion](https://www.framer.com/motion/) - Production-ready motion library
- [Three.js](https://threejs.org/) - JavaScript 3D library
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [@react-three/drei](https://github.com/pmndrs/drei) - Useful helpers for react-three-fiber
- [Lucide Icons](https://lucide.dev/) - Beautiful open-source icon set
- [Next-themes](https://github.com/pacocoursey/next-themes) - Next.js theme switching
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [nanoid](https://github.com/ai/nanoid) - Tiny, secure, URL-friendly ID generator
- [clsx](https://github.com/lukeed/clsx) - Utility for constructing className strings
- [class-variance-authority](https://github.com/joebell/class-variance-authority) - CVA for Tailwind CSS
- [tw-animate-css](https://github.com/tailwindlabs/tailwindcss-animate) - Tailwind CSS animations

<div align="center">
  Made with ❤️ by the ZipLinker Team
</div>
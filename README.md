# Splitwise Demo - React TypeScript Expense Tracker

This is a demonstration project showcasing development capabilities using React and TypeScript, created during a live coding interview. As an interview exercise, this project intentionally demonstrates rapid development skills rather than production-ready code. While it contains intentional gaps and missing features, the Future Steps and Improvements section provides insights into real-world development considerations and best practices.

## 📋 Table of Contents

- [🚀 Quickstart](#-quickstart)
- [🏗️ Architecture & Contents](#️-architecture--contents)
- [🎨 Component Design Guidelines](#-component-design-guidelines)
- [🔧 Service Architecture](#-service-architecture)
- [🚧 Current Limitations & Future Improvements](#-current-limitations--future-improvements)
- [📄 License](#-license)
- [🔗 Links](#-links)

## 🚀 Quickstart

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/danielnachumdev/splitwise-demo.git
cd splitwise-demo

# Install dependencies
npm install

# Start development server
npm run dev
```

### Running the Application

1. **Development Mode**: `npm run dev`
   - Starts the development server with hot reload
   - Access at `http://localhost:5173`
   - Includes demo data for immediate testing

2. **Production Build**: `npm run build`
   - Creates optimized production build
   - Output in `dist/` directory

3. **Preview Build**: `npm run preview`
   - Serves the production build locally for testing

## 🏗️ Architecture & Contents

### Project Structure
```
src/
├── components/          # React UI components
│   ├── common/         # Reusable components across features
│   ├── HomePage/       # Home page with group management
│   └── GroupDetailsPage/ # Group details and expense tracking
├── database/           # Database abstraction layer
│   ├── models.ts       # TypeScript interfaces and types
│   ├── Database.ts     # Generic database interface
│   └── LocalStorageDatabase.ts # LocalStorage implementation
├── services/           # Business logic services
│   ├── UserService.ts  # User management operations
│   ├── GroupService.ts # Group management operations
│   ├── PaymentService.ts # Payment and expense operations
│   ├── BalanceService.ts # Balance calculation logic
│   └── DatabaseService.ts # Database operations
├── utils/              # Utility functions
│   ├── currency.ts     # Currency formatting utilities
│   └── datetime.ts     # Date/time handling utilities
└── App.tsx            # Main application component with routing
```

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Tailwind CSS + Component-specific CSS files
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Linting**: ESLint + TypeScript ESLint
- **Storage**: LocalStorage (with abstraction for easy replacement)

### Core Features
- **User Management**: Create and manage user accounts
- **Group Management**: Create groups and add/remove members
- **Expense Tracking**: Record payments and split expenses
- **Balance Calculation**: Automatic balance calculation for group members
- **Demo Data**: Pre-populated with sample data for demonstration

## 🎨 Component Design Guidelines

Our component architecture is built on three fundamental pillars:

### 1. **Readability** - Code should be self-documenting and easy to understand
### 2. **Testability** - Components should be easily testable in isolation  
### 3. **Maintainability** - Code should be easy to modify and extend

### Component Organization Rules

#### **When to Create a Folder Structure**
- **Component has sub-components** in separate files
- **Component has a CSS file** for styling encapsulation
- **Component exceeds 200 lines** and has distinct logical sections
- **Component is reused** in multiple places
- **Component has complex logic** that deserves its own file

#### **When to Keep as Single File**
- **Component is under 200 lines** with simple inline components only
- **Component has minimal styling** needs
- **Component is a simple wrapper** or container
- **Component inherits all styling** from MUI components

### Styling Guidelines

#### **CSS File Organization**
- **Component-specific styles**: Each component should have its own CSS file
- **File naming**: Use `ComponentName.css` format (e.g., `GroupCard.css`)
- **Location**: Place CSS files in the same directory as the component
- **Import**: Import CSS files directly in the component: `import './ComponentName.css'`

#### **When to Use CSS Files vs Inline Styles**

**Use CSS Files When:**
- Component has complex styling (more than 3-4 style properties)
- Styles are reused across multiple elements
- Hover states and animations are needed
- Responsive design requires media queries
- Theme consistency across the project

**Use Inline Styles (sx prop) When:**
- Simple, one-off styling (1-2 properties)
- Dynamic values that change based on props/state
- MUI theme integration is required
- Quick prototyping or temporary styling

### Component Structure Template

```tsx
import React, { useState, useEffect } from 'react';
import { /* MUI imports */ } from '@mui/material';
import { /* icon imports */ } from '@mui/icons-material';
import type { /* type imports */ } from '../database';
import { /* service imports */ } from '../services';

interface ComponentNameProps {
    // Props interface - always define explicitly
}

const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
    // 1. State declarations
    // 2. Effect hooks
    // 3. Event handlers
    // 4. Helper functions
    // 5. Render logic
    
    return (
        // JSX
    );
};

export default ComponentName;
```

### Code Organization Pattern

```tsx
const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
    // 1. HOOKS & STATE (top)
    const [state1, setState1] = useState<Type>(initialValue);
    
    // 2. EFFECTS (after state)
    useEffect(() => {
        // effect logic
    }, [dependencies]);
    
    // 3. EVENT HANDLERS (after effects)
    const handleEvent = () => {
        // handler logic
    };
    
    // 4. HELPER FUNCTIONS (after handlers)
    const helperFunction = () => {
        // helper logic
    };
    
    // 5. RENDER LOGIC (at the bottom)
    return (
        // JSX
    );
};
```

### Folder Structure Examples

#### **Component with CSS File Only**
```
src/components/
├── GroupCard/
│   ├── index.ts              # Export main component
│   ├── GroupCard.tsx         # Main component
│   └── GroupCard.css         # Component styles
```

#### **Complex Component with Sub-components**
```
src/components/
├── AddDataModal/
│   ├── index.ts              # Export main component
│   ├── AddDataModal.tsx      # Main modal logic
│   ├── UserForm.tsx          # User creation form
│   ├── PaymentForm.tsx       # Payment creation form
│   └── TabPanel.tsx          # Reusable tab panel component
```

### Key Principles

- **Single Responsibility**: Each component should have one clear purpose
- **Functional Components Only**: All components must be functional using React hooks
- **Props Interface Design**: Always define explicit props interfaces
- **Business Logic Extraction**: Move business logic to services, not components
- **Component Length**: Target under 200 lines, maximum 300 lines
- **Local Components**: Use inline components for simple, single-use UI elements

## 🔧 Service Architecture

### Database Layer
The project uses a generic database interface that allows easy replacement of storage mechanisms:

```typescript
export interface Database<T> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, data: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
    find(predicate: (item: T) => boolean): Promise<T[]>;
    clear(): Promise<void>;
}
```

### Service Objects
Each domain has its own service object:
- **userService**: User CRUD operations
- **groupService**: Group and membership management
- **paymentService**: Payment and participant management
- **balanceService**: Balance calculation and debt breakdown





## 🚧 Current Limitations & Future Improvements

### Current State
- **Storage**: LocalStorage only (no persistence across devices)
- **Authentication**: Demo user only (no real auth system)
- **Error Handling**: Basic error handling (no error boundaries)
- **Performance**: No optimization for large datasets
- **Accessibility**: Basic accessibility features
- **CRUD Operations**: No full CRUD support on resources
- **UI Design**: Inconsistent UI design patterns
- **Data Operations**: Add data button performs 2 operations rather than single responsibility
- **Testing**: No tests implemented intentionally (TDD workflow not established)
- **API Layer**: No separation between data viewing and backend communication

### Planned Improvements

#### Phase 1: Core Fixes & Quality
- Fix all current limitations mentioned above
- Implement proper CRUD operations for all resources
- Standardize UI design patterns and component consistency
- Refactor data operations to follow single responsibility principle
- Implement Jest testing framework with comprehensive test coverage
- **Implement TDD (Test-Driven Development)** as core development workflow

#### Phase 2: Authentication & Security
- Implement user authentication and login system
- Add user registration and profile management
- Implement proper session management
- Add role-based access control (RBAC)
- **Implement Zero Trust Architecture** as core development methodology:
  - **Backend Security First**: Assume all incoming data is potentially malicious
  - **Data Validation**: Comprehensive validation at every layer (API, service, database)
  - **Input Sanitization**: Clean and sanitize all user inputs before processing
  - **Output Encoding**: Encode all data before sending to frontend
  - **Rate Limiting**: Prevent abuse and brute force attacks
  - **Audit Logging**: Track all data modifications and access attempts
- Implement security measures: **XSS Protection** and **SSRF Protection**

#### Phase 3: Backend Infrastructure
- Develop backend API to mediate data layer operations
- Implement proper database design with PostgreSQL/MongoDB
- **Zero Trust Data Layer**:
  - **API Gateway Security**: Validate and sanitize all requests before processing
  - **Service Layer Validation**: Business logic validation at every service call
  - **Database Security**: Parameterized queries, input validation, and access controls
  - **Data Encryption**: Encrypt sensitive data at rest and in transit
- Add middleware layers for:
  - **Logging**: Comprehensive request/response logging with security events
  - **Error Handling**: Graceful error handling without exposing system details
  - **Rate Limiting**: API rate limiting and abuse prevention
  - **Validation**: Request validation and sanitization at multiple layers
  - **Authentication**: JWT token validation and refresh with secure token handling
  - **Caching**: Redis-based caching layer with security considerations
  - **Security Headers**: Implement security headers (CSP, HSTS, etc.)

#### Phase 4: Frontend API Layer & Middleware
- Implement frontend API layer service to manage all backend requests
- Separate data viewing and acquisition using service layers:
  - **API Service Layer**: Centralized HTTP client with interceptors and security headers
  - **Data Service Layer**: Business logic and data transformation with validation
  - **View Service Layer**: UI state management and presentation logic
- **Frontend Security Measures**:
  - **Input Validation**: Client-side validation for immediate user feedback
  - **Data Sanitization**: Clean data before sending to backend
  - **Error Handling**: Graceful error handling without exposing sensitive information
  - **Security Headers**: Implement security headers in frontend requests
- Implement React Error Boundaries for graceful error handling
- Add loading states and user feedback mechanisms
- Implement retry mechanisms for failed requests
- Add offline support with Service Workers
- Implement proper error logging and monitoring

#### Phase 5: Microservices & Deployment
- Containerize both frontend and backend applications
- Implement Docker Compose for local development
- Set up Kubernetes manifests for cloud deployment
- Deploy as 2 separate microservices:
  - **Frontend Service**: React SPA with CDN optimization
  - **Backend Service**: API gateway with load balancing
- Add monitoring, logging, and health checks
- Implement CI/CD pipelines for automated deployment







## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is a demo project intended for learning and demonstration purposes. It is not production-ready and should not be used in production environments without significant additional development.

## 🔗 Links

- **Repository**: [https://github.com/danielnachumdev/splitwise-demo](https://github.com/danielnachumdev/splitwise-demo)
- **Component Design Guide**: See `COMPONENT_DESIGN_GUIDE.md` for detailed component architecture guidelines

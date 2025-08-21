# Splitwise Demo - Refactored Project

A React TypeScript application for managing shared expenses between users in groups. This project has been refactored to follow clean architecture principles with clear separation of concerns.

## 🚀 Features

- **User Management**: Create and manage user accounts
- **Group Management**: Create groups and add/remove members
- **Expense Tracking**: Record payments and split expenses
- **Balance Calculation**: Automatic balance calculation for group members
- **Demo Data**: Pre-populated with sample data for demonstration

## 🏗️ Architecture Overview

The project follows a clean architecture pattern with clear separation of concerns:

```
src/
├── components/          # React UI components
├── services/           # Business logic and data access
│   ├── database/       # Database abstraction layer
│   ├── UserService.ts  # User-related operations
│   ├── GroupService.ts # Group-related operations
│   ├── PaymentService.ts # Payment-related operations
│   ├── BalanceService.ts # Balance calculation logic
│   └── ServiceFactory.ts # Service dependency injection
├── types.ts            # TypeScript type definitions
└── App.tsx            # Main application component
```

### Architecture Principles

1. **Separation of Concerns**: Each service has a single responsibility
2. **Functional Programming**: Services are exported as objects with pure functions
3. **Database Abstraction**: Generic database interface for easy storage replacement
4. **Type Safety**: Full TypeScript coverage with strict typing

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Linting**: ESLint + TypeScript ESLint
- **Storage**: LocalStorage (with abstraction for easy replacement)

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd splitwise-demo

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## 🏃‍♂️ Running the Application

1. **Development Mode**: `npm run dev`
   - Starts the development server
   - Hot reload enabled
   - Access at `http://localhost:5173`

2. **Production Build**: `npm run build`
   - Creates optimized production build
   - Output in `dist/` directory

3. **Preview Build**: `npm run preview`
   - Serves the production build locally

## 🧪 Testing Strategy

The project is structured to be easily testable with Jest:

### Testable Components

- **Services**: All business logic is in service classes
- **Database Layer**: Generic interface allows easy mocking
- **Components**: UI components are separated from business logic

### Testing Setup (Future Implementation)

```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Example Test Structure

```typescript
// UserService.test.ts
describe('UserService', () => {
  let userService: UserService;
  let mockDatabase: jest.Mocked<IDatabase<IUser>>;

  beforeEach(() => {
    mockDatabase = createMockDatabase();
    userService = new UserService(mockDatabase);
  });

  it('should create a new user', async () => {
    // Test implementation
  });
});
```

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
- **demoDataService**: Sample data initialization

### Service Usage

Services are imported and used directly:

```typescript
import { userService, groupService } from '../services';

// Direct usage
const users = await userService.getUsers();
const groups = await groupService.getGroups();
```

## 📊 Data Models

### Core Entities

- **User**: User account information
- **Group**: Expense group with members
- **Payment**: Individual expense record
- **PaymentParticipant**: User's share in a payment
- **UserBalance**: User's balance within a group

### Relationships

- Users can belong to multiple groups
- Groups can have multiple payments
- Payments can be split among multiple participants
- Balances are calculated per user per group

## 🚧 Current Limitations & Future Improvements

### Current State

- **Storage**: LocalStorage only (no persistence across devices)
- **Authentication**: Demo user only (no real auth system)
- **Error Handling**: Basic error handling (no error boundaries)
- **Performance**: No optimization for large datasets
- **Accessibility**: Basic accessibility features

### Planned Improvements

#### Phase 1: Testing & Quality
- [ ] Implement Jest testing framework
- [ ] Add unit tests for all services
- [ ] Add integration tests for components
- [ ] Add E2E tests with Playwright

#### Phase 2: Error Handling & UX
- [ ] Implement React Error Boundaries
- [ ] Add comprehensive error handling
- [ ] Add loading states and user feedback
- [ ] Implement retry mechanisms

#### Phase 3: Performance & Scalability
- [ ] Add React.memo for component optimization
- [ ] Implement virtual scrolling for large lists
- [ ] Add pagination for payments and groups
- [ ] Implement lazy loading for components

#### Phase 4: Advanced Features
- [ ] Add real-time updates with WebSockets
- [ ] Implement offline support with Service Workers
- [ ] Add data export/import functionality
- [ ] Implement advanced filtering and search

#### Phase 5: Infrastructure
- [ ] Replace LocalStorage with real database
- [ ] Add user authentication and authorization
- [ ] Implement API rate limiting and caching
- [ ] Add monitoring and logging

### Middleware Implementation

Future plans include implementing middleware for:

- **Logging**: Request/response logging
- **Caching**: Redis-based caching layer
- **Rate Limiting**: API rate limiting
- **Validation**: Request validation middleware
- **Authentication**: JWT token validation

## 🔄 Migration Path

The current architecture makes it easy to migrate to different storage solutions:

### To PostgreSQL
```typescript
export class PostgresDatabase<T> implements IDatabase<T> {
    // Implementation using pg library
}
```

### To MongoDB
```typescript
export class MongoDatabase<T> implements IDatabase<T> {
    // Implementation using mongodb library
}
```

### To REST API
```typescript
export class ApiDatabase<T> implements IDatabase<T> {
    // Implementation using fetch/axios
}
```

## 📝 Development Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use meaningful variable and function names
- Add JSDoc comments for public methods

### Component Structure

- Keep components focused on UI logic
- Extract business logic to services
- Use proper TypeScript typing
- Implement proper error boundaries

### Service Design

- Single responsibility principle
- Pure functions with no side effects
- Async/await for all database operations
- Proper error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues, please:

1. Check the existing issues
2. Create a new issue with detailed description
3. Include steps to reproduce
4. Add relevant error messages

---

**Note**: This is a demo project intended for learning and demonstration purposes. It is not production-ready and should not be used in production environments without significant additional development.

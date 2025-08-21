# Component Design Guide

## 🎯 **Core Principles**

Our component architecture is built on three fundamental pillars:

1. **Readability** - Code should be self-documenting and easy to understand
2. **Testability** - Components should be easily testable in isolation
3. **Maintainability** - Code should be easy to modify and extend

## 🎨 **Styling Guidelines**

### **CSS File Organization**
- **Component-specific styles**: Each component should have its own CSS file
- **File naming**: Use `ComponentName.css` format (e.g., `GroupCard.css`)
- **Location**: Place CSS files in the same directory as the component
- **Import**: Import CSS files directly in the component: `import './ComponentName.css'`

### **When to Use CSS Files vs Inline Styles**

#### **Use CSS Files When:**
- **Component has complex styling** (more than 3-4 style properties)
- **Styles are reused** across multiple elements
- **Hover states and animations** are needed
- **Responsive design** requires media queries
- **Theme consistency** across the project
- **Performance optimization** (CSS is more efficient than inline styles)

#### **Use Inline Styles (sx prop) When:**
- **Simple, one-off styling** (1-2 properties)
- **Dynamic values** that change based on props/state
- **MUI theme integration** is required
- **Quick prototyping** or temporary styling

### **CSS File Structure Template**
```css
/* ComponentName Component Styles */

.component-root {
    /* Root element styles */
}

.component-root:hover {
    /* Hover states */
}

.component-header {
    /* Header section styles */
}

.component-content {
    /* Main content styles */
}

.component-footer {
    /* Footer section styles */
}

/* Responsive styles */
@media (max-width: 768px) {
    .component-root {
        /* Mobile-specific styles */
    }
}
```

### **CSS Naming Conventions**
- **Class names**: Use kebab-case (e.g., `group-card`, `user-avatar`)
- **Component prefix**: Prefix classes with component name (e.g., `group-card-header`)
- **Semantic naming**: Use descriptive names that reflect purpose, not appearance
- **BEM methodology**: Consider using Block__Element--Modifier pattern for complex components

### **CSS Best Practices**
- **Avoid !important**: Use specificity and proper selectors instead
- **Use CSS variables**: For colors, spacing, and other design tokens
- **Mobile-first**: Write responsive styles with mobile as the default
- **Performance**: Minimize CSS selector complexity
- **Accessibility**: Ensure sufficient color contrast and focus states

### **MUI Integration**
- **Keep MUI props**: Use `variant`, `color`, `size` for MUI components
- **Override with CSS**: Use CSS classes to customize MUI component appearance
- **Theme consistency**: Leverage MUI theme variables when possible
- **Avoid duplication**: Don't recreate MUI functionality with custom CSS

### **Benefits of CSS File Approach**

#### **Performance Benefits**
- **Faster rendering**: CSS is more efficient than inline styles
- **Better caching**: CSS files can be cached by the browser
- **Reduced bundle size**: Eliminates duplicate style objects in JavaScript

#### **Maintainability Benefits**
- **Centralized styling**: All styles in one place per component
- **Easier theming**: CSS variables and classes are easier to modify
- **Better debugging**: CSS DevTools provide better debugging experience
- **Consistent patterns**: Establishes design system across the project

#### **Developer Experience Benefits**
- **Cleaner JSX**: Components focus on structure, not styling
- **Better separation of concerns**: Logic and presentation are separated
- **Easier collaboration**: Designers can work on CSS files independently
- **Version control**: CSS changes are easier to track and review

#### **Accessibility Benefits**
- **Better focus management**: CSS can handle focus states more effectively
- **Reduced motion**: CSS media queries for user preferences
- **High contrast**: Easier to implement accessibility features

## 🏗️ **Component Architecture**

### **Functional Components Only**
- All components must be functional components using React hooks
- Use `React.FC<Props>` type annotation for proper TypeScript support
- Avoid class components entirely

### **Component Structure Template**
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

## 📁 **File & Folder Structure**

### **Component Organization**
```
src/
├── components/
│   ├── common/           # Reusable components across features
│   ├── feature-name/     # Feature-specific components
│   └── layouts/          # Layout components (headers, sidebars, etc.)
├── database/             # Database layer (types, interfaces)
├── services/             # Business logic services
└── hooks/                # Custom React hooks
```

### **Component Folder Structure**
When a component has sub-components (separate files), organize them in a folder:

```
src/components/
├── UserManagement/
│   ├── index.ts              # Export main component
│   ├── UserManagement.tsx    # Main component
│   ├── UserCard.tsx          # Sub-component
│   ├── UserForm.tsx          # Sub-component
│   └── UserList.tsx          # Sub-component
├── PaymentModal/
│   ├── index.ts              # Export main component
│   ├── PaymentModal.tsx      # Main component
│   ├── PaymentForm.tsx       # Sub-component
│   └── PaymentSummary.tsx    # Sub-component
└── GroupDetails/
    ├── index.ts              # Export main component
    ├── GroupDetails.tsx      # Main component
    ├── GroupHeader.tsx       # Sub-component
    ├── GroupMembers.tsx      # Sub-component
    └── GroupPayments.tsx     # Sub-component
```

### **Naming Conventions**
- **Files**: PascalCase (e.g., `UserCard.tsx`, `PaymentModal.tsx`)
- **Components**: PascalCase (e.g., `UserCard`, `PaymentModal`)
- **Interfaces**: PascalCase with descriptive names (e.g., `UserCardProps`, `PaymentFormData`)
- **Types**: PascalCase (e.g., `PaymentStatus`, `UserRole`)

### **Folder Organization Rules**
- **Single Component**: If a component has no sub-components and no CSS file, keep it as a single file
- **Multiple Sub-components**: If a component has even one sub-component (separate file), create a folder
- **CSS File**: If a component has a CSS file, create a folder for encapsulation
- **Folder Naming**: Use PascalCase for folder names (e.g., `UserManagement/`, `PaymentModal/`)
- **Index Export**: Always use `index.ts` to export the main component from the folder

### **When to Create a Folder**
1. **Component has sub-components** in separate files
2. **Component has a CSS file** for styling encapsulation
3. **Component exceeds 200 lines** and has distinct logical sections
4. **Component is reused** in multiple places
5. **Component has complex logic** that deserves its own file
6. **Component has its own state** and business logic
7. **Component is a complete feature** that could be tested independently

### **Folder Structure Examples**

#### **Component with CSS File Only**
```
src/components/
├── GroupCard/
│   ├── index.ts              # Export main component
│   ├── GroupCard.tsx         # Main component
│   └── GroupCard.css         # Component styles
├── UserCard/
│   ├── index.ts              # Export main component
│   ├── UserCard.tsx          # Main component
│   └── UserCard.css          # Component styles
└── PaymentButton/
    ├── index.ts              # Export main component
    ├── PaymentButton.tsx     # Main component
    └── PaymentButton.css     # Component styles
```

#### **Component with Sub-components and CSS**
```
src/components/
├── PaymentModal/
│   ├── index.ts              # Export main component
│   ├── PaymentModal.tsx      # Main component
│   ├── PaymentModal.css      # Main component styles
│   ├── PaymentForm.tsx       # Sub-component
│   ├── PaymentForm.css       # Sub-component styles
│   ├── PaymentSummary.tsx    # Sub-component
│   └── PaymentSummary.css    # Sub-component styles
└── GroupDetails/
    ├── index.ts              # Export main component
    ├── GroupDetails.tsx      # Main component
    ├── GroupDetails.css      # Main component styles
    ├── GroupHeader.tsx       # Sub-component
    ├── GroupHeader.css       # Sub-component styles
    ├── GroupMembers.tsx      # Sub-component
    └── GroupMembers.css      # Sub-component styles
```

### **Index.ts Export Pattern**
```tsx
// src/components/UserManagement/index.ts
export { default as UserManagement } from './UserManagement';
export { default as UserCard } from './UserCard';
export { default as UserForm } from './UserForm';
export { default as UserList } from './UserList';

// Usage in other files:
import { UserManagement, UserCard } from '../components/UserManagement';
```

## 🔧 **Component Guidelines**

### **1. Readability**

#### **Component Length**
- **Target**: Keep components under 200 lines
- **Maximum**: 300 lines (requires justification)
- **Break down when**: Component handles multiple responsibilities or becomes hard to follow

#### **Code Organization**
```tsx
const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
    // 1. HOOKS & STATE (top)
    const [state1, setState1] = useState<Type>(initialValue);
    const [state2, setState2] = useState<Type>(initialValue);
    
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

#### **Naming Best Practices**
- Use descriptive names for functions, variables, and props
- Avoid abbreviations unless they're widely understood
- Use verbs for functions (e.g., `handleSubmit`, `validateForm`)
- Use nouns for variables and props (e.g., `userData`, `isLoading`)

### **2. Testability**

#### **Component Isolation**
- Components should be pure and predictable
- Avoid complex side effects in render functions
- Extract business logic to services or custom hooks

#### **Props Interface Design**
```tsx
interface UserCardProps {
    user: User;                    // Required props first
    balance?: UserBalance;         // Optional props with ?
    currency: string;             // Required props
    onClick: (user: User) => void; // Function props with clear signatures
    className?: string;            // Styling props last
}
```

#### **State Management**
- Use local state for UI-specific state only
- Keep business logic in services
- Use custom hooks for complex state logic

### **3. Maintainability**

#### **Single Responsibility Principle**
- Each component should have one clear purpose
- If a component does multiple things, consider breaking it down

#### **Reusability**
- Extract common patterns into reusable components
- Use composition over inheritance
- Create generic components that can be configured via props

## 🔄 **Refactoring Guidelines**

### **When to Refactor**
1. **Component exceeds 300 lines**
2. **Multiple responsibilities detected**
3. **Repeated code patterns**
4. **Complex nested logic**
5. **Poor readability**
6. **Complex inline styling** (more than 3-4 style properties)

### **Styling Refactoring Process**
1. **Identify styling complexity** - Look for components with extensive `sx` props or inline styles
2. **Extract to CSS file** - Move complex styles to a dedicated CSS file
3. **Replace with CSS classes** - Use semantic class names instead of inline styles
4. **Maintain MUI integration** - Keep MUI props for component variants and colors
5. **Test visual consistency** - Ensure the refactored component looks identical

### **Component Organization Decision Tree**
```
Is the component simple and under 200 lines?
├─ Yes → Does it have complex styling needs?
│   ├─ Yes → Create folder with CSS file for encapsulation
│   └─ No → Keep as single file (no CSS needed)
└─ No → Does it have complex sub-sections?
    ├─ Yes → Extract to separate files in a folder
    └─ No → Break into separate files in a folder

Does the component have complex styling?
├─ Yes → Extract styles to CSS file AND create folder
└─ No → Keep inline styles or sx props, no folder needed

Complex styling includes:
- More than 3-4 style properties
- Hover states and animations
- Responsive design requirements
- Multiple styled elements
- Design system consistency needs
```

### **Local Components vs Separate Files**

| Aspect         | Local Components (Inline) | Separate Files       |
| -------------- | ------------------------- | -------------------- |
| **Complexity** | Simple, < 15 lines        | Complex, > 15 lines  |
| **Scope**      | Only used in parent       | Potentially reusable |
| **State**      | No state, props only      | Full component state |
| **Location**   | Inside main component     | Separate file        |
| **Example**    | Simple UI elements        | Full features        |

### **When to Extract to Separate Files**
1. **Component exceeds 200 lines** and has distinct logical sections
2. **Sub-component is reused** in multiple places
3. **Sub-component has complex logic** that deserves its own file
4. **Sub-component has its own state** and business logic
5. **Sub-component is a complete feature** that could be tested independently

### **When to Use Local Components (Inline)**
1. **Simple UI rendering** with no complex logic
2. **Component is only used** within the parent component
3. **Component is under 15 lines** and purely presentational
4. **Component is tightly coupled** to parent's state and props
5. **Component is simple enough** to be defined inline without cluttering the main component

### **Key Principle: No File-Level Sub-Components**
- **Local components** must be defined INSIDE the main component (inline)
- If a component is complex enough to be defined at the file level, it should be extracted to a separate file instead
- This prevents the confusion of having "local" components that aren't truly local to the main component



### **Refactoring Process**
1. **Identify the problem** - What makes this component hard to read/test/maintain?
2. **Extract logic** - Move business logic to services or custom hooks
3. **Break down** - Split into smaller, focused components
4. **Improve naming** - Make everything self-documenting
5. **Test** - Ensure refactored components are testable

### **Extraction Patterns**

#### **When to Use Different Component Organization Patterns**
- **Single File with Local Components**: Component with simple inline components only
- **Folder Structure**: Component with one or more sub-components in separate files

#### **Local Components (Inline within Main Component)**
```tsx
const PaymentModal: React.FC<PaymentModalProps> = ({ payment, onClose }) => {
    // Local component - simple, inline, only used within this component
    const PaymentSummary = () => (
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6">Payment Summary</Typography>
            <Typography>Amount: ${payment.amount}</Typography>
        </Box>
    );
    
    return (
        <Dialog open onClose={onClose}>
            <DialogContent>
                <PaymentSummary />
                {/* Other content */}
            </DialogContent>
        </Dialog>
    );
};
```

#### **Sub-Components (Separate Files)**
When a component becomes complex or is reused elsewhere, extract to separate files:

```tsx
// src/components/PaymentModal/PaymentModal.tsx
import React from 'react';
import { Dialog, DialogContent } from '@mui/material';
import { PaymentForm } from './PaymentForm';
import { PaymentSummary } from './PaymentSummary';

const PaymentModal: React.FC<PaymentModalProps> = ({ payment, onClose }) => {
    return (
        <Dialog open onClose={onClose}>
            <DialogContent>
                <PaymentSummary payment={payment} />
                <PaymentForm payment={payment} onClose={onClose} />
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;
```

```tsx
// src/components/PaymentModal/PaymentForm.tsx
const PaymentForm: React.FC<PaymentFormProps> = ({ payment, onClose }) => {
    // Form logic
};

export default PaymentForm;
```

```tsx
// src/components/PaymentModal/index.ts
export { default as PaymentModal } from './PaymentModal';
export { default as PaymentForm } from './PaymentForm';
export { default as PaymentSummary } from './PaymentSummary';
```

#### **Local Components (Inline)**
```tsx
const PaymentModal: React.FC<PaymentModalProps> = ({ payment, onClose }) => {
    // Local component - simple, inline, only used within this component
    const PaymentSummary = () => (
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="h6">Payment Summary</Typography>
            <Typography>Amount: ${payment.amount}</Typography>
        </Box>
    );
    
    return (
        <Dialog open onClose={onClose}>
            <DialogContent>
                <PaymentSummary />
                {/* Other content */}
            </DialogContent>
        </Dialog>
    );
};
```

### **Mixed CSS Approach (Real-World Pattern)**

Based on the HomePage structure, we've identified a practical mixed approach:

#### **Components with CSS Files (Folder Structure)**
- **HomePage** - Has CSS file for main page styling
- **HomeHeader** - Has CSS file for header styling  
- **MainContent** - Has CSS file for content layout
- **GroupCard** - Has CSS file for card styling
- **CreateGroupForm** - Has CSS file for form styling

#### **Components without CSS Files (Single Files)**
- **CreateGroupModal** - Simple modal wrapper, no complex styling needed

#### **When to Use Each Approach**

**Use CSS Files When:**
- Component has complex styling (more than 3-4 style properties)
- Component needs hover states, animations, or responsive design
- Component has multiple styled elements that benefit from centralized styling
- Component is part of a design system that needs consistency

**Keep as Single File When:**
- Component has minimal or no styling needs
- Component is a simple wrapper or container
- Component inherits all styling from MUI components
- Component is purely functional with no visual complexity

#### **Real-World Example: HomePage Structure**
```
src/components/HomePage/
├── HomePage.tsx + HomePage.css          # Complex page layout
├── HomeHeader.tsx + HomeHeader.css      # Complex header styling
└── MainContent/
    ├── MainContent.tsx + MainContent.css    # Complex content layout
    ├── GroupCard/                           # Complex card styling
    │   ├── GroupCard.tsx + GroupCard.css
    └── CreateGroupModal/                     # Simple modal wrapper
        ├── CreateGroupModal.tsx              # No CSS needed
        └── CreateGroupForm.tsx + CreateGroupForm.css  # Complex form styling
```

**Key Insight:** The decision to use CSS files should be based on **styling complexity**, not just component complexity. A simple component with complex styling needs a CSS file, while a complex component with simple styling might not.

## 🧪 **Testing Considerations**

### **Component Design for Testing**
- Keep components focused and simple
- Use dependency injection via props
- Avoid complex internal state
- Make side effects explicit and testable

### **Test-Friendly Patterns**
```tsx
// Good - Easy to test
const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
    return (
        <Card>
            <CardContent>
                <Typography>{user.name}</Typography>
                <Button onClick={() => onEdit(user)}>Edit</Button>
                <Button onClick={() => onDelete(user.id)}>Delete</Button>
            </CardContent>
        </Card>
    );
};

// Bad - Hard to test (internal state, side effects)
const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState(user);
    
    const handleEdit = async () => {
        // Complex internal logic
        const updated = await updateUser(userData);
        setUserData(updated);
        setIsEditing(false);
    };
    
    // ... complex render logic
};
```

## 📝 **Code Examples**

### **Styling Refactoring Example**

#### **Before: Complex Inline Styling**
```tsx
const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                    '& .group-title': {
                        color: 'primary.main',
                    },
                },
            }}
        >
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    {/* Complex nested styling... */}
                </Box>
            </CardContent>
        </Card>
    );
};
```

#### **After: Clean CSS Classes**
```tsx
// GroupCard.tsx
import './GroupCard.css';

const GroupCard: React.FC<GroupCardProps> = ({ group, onClick }) => {
    return (
        <Card onClick={onClick} className="group-card">
            <CardContent className="group-card-content">
                <Box className="group-card-header">
                    {/* Clean, readable JSX */}
                </Box>
            </CardContent>
        </Card>
    );
};
```

```css
/* GroupCard.css */
.group-card {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
}

.group-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.group-card:hover .group-title {
    color: #1976d2;
}

.group-card-content {
    padding: 24px;
}

.group-card-header {
    display: flex;
    align-items: flex-start;
    margin-bottom: 16px;
}
```

## 📋 **Practical Examples**

### **Example 1: Simple Component (Single File with Local Components)**
```
src/components/UserCard.tsx  // Single file - simple inline components only, no CSS file
```

### **Example 2: Component with CSS File (Folder Structure)**
```
src/components/GroupCard/
├── index.ts              # Export main component
├── GroupCard.tsx         # Main component
└── GroupCard.css         # Component styles
```

### **Example 3: Complex Component (Folder Structure)**
```
src/components/AddDataModal/
├── index.ts              # Export main component
├── AddDataModal.tsx      # Main modal logic
├── UserForm.tsx          # User creation form
├── PaymentForm.tsx       # Payment creation form
└── TabPanel.tsx          # Reusable tab panel component
```

**index.ts content:**
```tsx
export { default as AddDataModal } from './AddDataModal';
export { default as UserForm } from './UserForm';
export { default as PaymentForm } from './PaymentForm';
export { default as TabPanel } from './TabPanel';
```

**Usage:**
```tsx
import { AddDataModal, UserForm } from '../components/AddDataModal';
```

### **Example 4: Feature Component with CSS (Folder Structure)**
```
src/components/GroupDetails/
├── index.ts              # Export main component
├── GroupDetails.tsx      # Main group details page
├── GroupDetails.css      # Main component styles
├── GroupHeader.tsx       # Group title and actions
├── GroupHeader.css       # Header styles
├── GroupMembers.tsx      # Member list and management
├── GroupMembers.css      # Members styles
├── GroupPayments.tsx     # Payment history
├── GroupPayments.css     # Payments styles
├── GroupStats.tsx        # Financial statistics
└── GroupStats.css        # Stats styles
```

### **Example 5: Component with CSS Only (Folder Structure)**
```
src/components/Button/
├── index.ts              # Export main component
├── Button.tsx            # Main component
└── Button.css            # Component styles
```

**index.ts content:**
```tsx
export { default as Button } from './Button';
```

**Usage:**
```tsx
import { Button } from '../components/Button';
```

### **Example 6: Real-World Feature Structure (HomePage Pattern)**
```
src/components/HomePage/
├── index.ts              # Export main component
├── HomePage.tsx          # Main page component
├── HomePage.css          # Main page styles
├── HomeHeader.tsx        # Header component
├── HomeHeader.css        # Header styles
└── MainContent/          # Main content folder
    ├── index.ts          # Export main content
    ├── MainContent.tsx   # Main content component
    ├── MainContent.css   # Main content styles
    ├── GroupCard/        # Sub-component folder
    │   ├── index.ts      # Export group card
    │   ├── GroupCard.tsx # Group card component
    │   └── GroupCard.css # Group card styles
    └── CreateGroupModal/ # Modal component folder
        ├── index.ts      # Export modal
        ├── CreateGroupModal.tsx    # Modal component
        ├── CreateGroupForm.tsx     # Form sub-component
        └── CreateGroupForm.css # Form styles
```

**Key Patterns:**
- **Top-level components** (HomePage, HomeHeader) have CSS files for encapsulation
- **Sub-component folders** (MainContent) contain related components
- **Components with CSS** are organized in folders for better encapsulation
- **Components without CSS** can be kept as single files if they're simple
- **Mixed approach** where some components have CSS and others don't, based on complexity

### **Example 7: Modal Pattern (CreateGroupModal)**
```
src/components/CreateGroupModal/
├── index.ts              # Export modal component
├── CreateGroupModal.tsx  # Modal wrapper (no CSS needed)
└── CreateGroupForm.tsx   # Form component with CSS
    └── CreateGroupForm.css # Form-specific styles
```

**When to use this pattern:**
- **Modal wrapper** handles modal logic but has minimal styling
- **Form component** has complex styling that benefits from CSS file
- **Separation of concerns** between modal behavior and form presentation

## ✅ **Checklist for New/Refactored Components**

- [ ] Component is under 300 lines
- [ ] Single responsibility principle followed
- [ ] Props interface is explicit and well-typed
- [ ] Business logic extracted to services
- [ ] Component is easily testable
- [ ] Naming is clear and descriptive
- [ ] No complex nested logic
- [ ] State is minimal and focused
- [ ] Side effects are explicit
- [ ] Code organization follows the template
- [ ] Styling is refactored to use CSS classes
- [ ] CSS files are properly encapsulated in folders

## 📁 **Component Organization Checklist**

- [ ] Simple components use inline local components only
- [ ] Complex components extract to separate files in folders
- [ ] Components with separate files organized in folders
- [ ] Components with CSS files organized in folders for encapsulation
- [ ] Components without CSS files kept as single files when appropriate
- [ ] CSS file decision based on styling complexity, not just component complexity
- [ ] Folder names use PascalCase
- [ ] Each folder has an `index.ts` file for exports
- [ ] Main component is the default export
- [ ] Sub-components are exported for reuse if needed
- [ ] Import paths are clean and consistent
- [ ] Mixed approach used where some components have CSS and others don't

## 🚀 **Next Steps**

1. **Audit existing components** against these guidelines
2. **Refactor components** that exceed the line limit
3. **Extract business logic** to appropriate services
4. **Create reusable components** for common patterns
5. **Implement testing** for refactored components
6. **Organize components with CSS files** into proper folder structures

---

*This document should be treated as a living guide. Update it as patterns evolve and new best practices emerge.*
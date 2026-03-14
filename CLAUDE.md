# Listory Codebase Rules

## Project Overview
Listory is a React + TypeScript checklist app built around composable lists. Users define **Permanent Lists** (reusable templates) with items, then create **Ephemeral Lists** (checklists) by merging one or more permanent lists into a single actionable checklist.

## Deployment

- **space-needle**: The production home server running a self-hosted GitHub Actions runner
- **pupyrus**: The WordPress Docker container running on space-needle, deployed via `deploy@pupyrus-*` release tags

## Code Organization

### Directory Structure
- `src/pages/` - Page-level components for routing
- `src/components/` - Reusable UI and feature components
  - `ui/` - Base UI components (Button, Input, Card, etc.)
  - `lists/` - Permanent list management components
  - `checklists/` - Checklist management components
  - `layout/` - Layout wrapper components
- `src/context/` - React Context for global state (DataContext)
- `src/types/` - TypeScript type definitions
- `src/lib/` - Utility functions

The repository also contains a `server/` directory hosting a WordPress plugin; Docker Compose (`docker-compose.yml`) is used to wire together a local WordPress instance, database, Redis, and the React development server.

## Naming Conventions

### Components
- **UI Components**: PascalCase filenames (e.g., `Button.tsx`, `Card.tsx`, `Input.tsx`)
  - Exported as named exports matching the filename
  - Live in `src/components/ui/`
- **Feature Components**: PascalCase filenames, should match the feature scope
  - Example: `ListForm.tsx`, `ChecklistDetail.tsx`
- **Files**: Always PascalCase for components, camelCase for utilities

### Types
- Type files: `src/types/index.ts` contains all shared types
- Type suffixes: Use descriptive names (e.g., `List`, `Checklist`, `ChecklistItem`, not `ListType`)

## Component Patterns

### Card Components
All cards must follow the structured composition pattern:
```tsx
<Card
  header={
    <CardHeader title={<CardTitle>Title Text</CardTitle>}>
      {/* Optional children like CardDescription or action buttons */}
    </CardHeader>
  }
  content={
    <CardContent>
      {/* Main content goes here */}
    </CardContent>
  }
  footer={/* Optional footer content */}
/>
```

Rules:
- Card accepts three props: `header`, `content`, and `footer`
- CardHeader requires a `title` prop containing a CardTitle component
- CardHeader can accept children for additional elements (CardDescription, CloseButton, etc.)
- Use CardContent to wrap the main content
- CardFooter is optional

### Form Components
- Form state managed with `useState` hooks
- Submit handlers prevent default and navigate on success
- Use Label components paired with Input/Select for form fields
- Forms wrapped in a Card with CardHeader containing the form title

### List Components
- Use the Table component from `src/components/ui/Table.tsx`
- Include search/filter functionality with Input
- Use Link components for navigation to detail pages
- Include action buttons (Edit, Delete) inline in table rows

## Import Conventions

### Absolute Imports
Always use the `@/` alias for imports:
```tsx
// Correct
import Button from '@/components/ui/Button';
import { useData } from '@/context/DataContext';
import { cn } from '@/lib/utils';

// Avoid
import { Button } from '../../../components/ui/Button';
```

### Import Organization
1. React and external libraries first
2. UI components
3. Feature components
4. Context/hooks
5. Types (using `type` keyword)
6. Utilities

Example:
```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useData } from '@/context/DataContext';
import type { List } from '@/types';
```

## Type Safety

- All React components should have explicit prop interfaces
- Props interface extends appropriate React types or define custom properties
- Use `type` keyword for type definitions
- Never use `any` type
- Use `React.ReactNode` for children/content props

## Global State Management

All data operations flow through `DataContext`:
- Lists management (permanent lists)
- Checklists management (ephemeral lists)
- CRUD operations (add, update, delete, get)

Components should use `const { lists, checklists, addList, ... } = useData();`

## Git Workflow

- Create feature branches for significant changes
- Write descriptive commit messages with format: `type: description`
  - Examples: `refactor: restructure Card component`, `feat: add search to lists page`
- Commit messages should explain the "why" not just the "what"

## React Best Practices

- Use functional components with hooks
- Use `React.forwardRef` for UI components that need ref access
- Use `displayName` for all forwardRef components
- Use type-safe event handlers: `React.FormEvent`, `React.ChangeEvent<HTMLInputElement>`
- Use `useNavigate()` hook from react-router-dom instead of Link when programmatic navigation needed
- Always handle loading and error states

## Styling

- Use Tailwind CSS utility classes
- Use `cn()` utility from `@/lib/utils` for conditional class merging
- Maintain consistent spacing with Tailwind (gap-2, p-6, mt-4, etc.)
- Color classes: use semantic names like `text-muted-foreground`, `bg-card`

## Common Patterns

### Navigation After Action
Always navigate to appropriate page after successful CRUD operations:
- After create: navigate to detail page `/lists/{id}`
- After update: navigate to detail page `/lists/{id}`
- After delete: navigate to list page `/lists`
- On cancel: navigate back with `navigate(-1)` or to specific page

# AGENTS.md - AI Agent Guidelines for FYP_FND

This document provides guidelines for AI coding agents working in this Next.js healthcare application codebase.

## Build/Lint/Test Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint the codebase
npm run lint
```

**Note:** No test framework is currently configured. If tests are added, document the test runner commands here.

## Project Overview

- **Framework:** Next.js 16 with App Router
- **React:** 19.x with Server Components
- **Styling:** Tailwind CSS 4.x with CSS variables
- **UI Library:** shadcn/ui (new-york style)
- **Icons:** lucide-react
- **HTTP Client:** axios
- **Forms:** react-hook-form + zod validation
- **Toasts:** sonner
- **Path Alias:** `@/*` maps to project root

## Project Structure

```
app/                    # Next.js App Router pages
  [feature]/            # Feature-based routing (page.tsx files)
components/             # React components
  ui/                   # shadcn/ui primitive components
  auth/                 # Authentication components
  medical-chat/         # Medical chat feature components
  admin/                # Admin panel components
lib/                    # Utility libraries
  api/                  # API client functions (organized by domain)
  types.ts              # Shared TypeScript type definitions
  utils.ts              # Utility functions (cn helper for classnames)
  api-config.ts         # Axios instance configuration
  error-handler.ts      # Centralized error handling
hooks/                  # Custom React hooks
public/                 # Static assets
styles/                 # Global styles
```

## TypeScript Configuration

- **Strict mode enabled** - all code must be type-safe
- **Target:** ES6
- **Module resolution:** bundler
- **Path alias:** Use `@/` for imports (e.g., `@/components/ui/button`)

## Code Style Guidelines

### File Naming

- Use **kebab-case** for all files: `auth-context.tsx`, `chat-window.tsx`, `api-config.ts`
- Page components: `page.tsx` (Next.js convention)
- Layout files: `layout.tsx`
- Loading states: `loading.tsx`

### Component Naming

- **PascalCase** for components: `Navbar`, `ChatWindow`, `MessageBubble`
- Use `default` export for page components
- Use named exports for reusable components: `export { Button, buttonVariants }`

### Function Naming

- **camelCase** for all functions: `handleLogout`, `fetchArticles`, `calculateBMI`
- Prefix event handlers with `handle`: `handleSendMessage`, `handleSearch`
- API functions use descriptive verbs: `getAllArticles`, `createTicket`, `updateProfile`

### Variable Naming

- **camelCase** for variables: `currentTime`, `selectedFiles`, `isLoading`
- Boolean state: use `is`/`has` prefixes or descriptive names: `isOpen`, `loading`, `sending`
- Unused variables: prefix with underscore: `_geist`, `_unused`

### Type Naming

- **PascalCase** for types/interfaces: `ApiResponse<T>`, `Article`, `ChatMessage`
- Suffix API responses with `Response`: `ArticlesResponse`, `LoginResponse`
- Suffix component props with `Props`: `ButtonProps`, `CardProps`

## Import Ordering

Follow this order for imports:

```typescript
"use client";                                    // 1. Directive (if needed)

import React from "react";                       // 2. React
import { useState, useEffect } from "react";
import type { ReactNode } from "react";          // 3. Type imports

import Link from "next/link";                    // 4. Next.js imports
import { useRouter } from "next/navigation";

import { Button } from "@radix-ui/react-button"; // 5. Third-party libraries
import { toast } from "sonner";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button"; // 6. Internal imports (@/ alias)
import { useAuth } from "@/components/auth/auth-context";
import { apiClient } from "@/lib/api-config";

import { localHelper } from "./utils";           // 7. Relative imports
import "./styles.css";                           // 8. CSS imports (last)
```

## Component Structure Pattern

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// ... more imports

export default function PageComponent() {
  // 1. Hooks (router, context, state)
  const router = useRouter();
  const { user, loading } = useAuth();
  const [data, setData] = useState<DataType[]>([]);

  // 2. Effects
  useEffect(() => {
    fetchData();
  }, []);

  // 3. Event handlers
  const handleSubmit = async () => {
    // implementation
  };

  // 4. Helper functions
  const formatData = (item: DataType) => {
    // implementation
  };

  // 5. Early returns for loading/error states
  if (loading) {
    return <LoadingSpinner />;
  }

  // 6. Main render
  return (
    <main className="container mx-auto px-4 py-8">
      {/* JSX content */}
    </main>
  );
}
```

## Error Handling

### Use the centralized error handler

```typescript
import { getErrorMessage } from "@/lib/error-handler";

try {
  setLoading(true);
  setError(null);
  const response = await apiClient.get("/api/data");
  setData(response.data);
} catch (err: any) {
  console.error("Fetch error:", err);
  setError(getErrorMessage(err));
} finally {
  setLoading(false);
}
```

### Toast notifications for user feedback

```typescript
import { toast } from "sonner";

toast.success("Operation completed successfully");
toast.error("Something went wrong");
```

## API Patterns

### API Response Type

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
```

### Making API Calls

```typescript
import { apiClient } from "@/lib/api-config";

const response = await apiClient.get<ApiResponse<DataType>>("/api/endpoint");
const data = response.data.data;
```

## UI Components (shadcn/ui)

- Located in `components/ui/`
- Use CVA (class-variance-authority) for variant styling
- Import from `@/components/ui/[component]`
- Use `cn()` utility from `@/lib/utils` for conditional classnames

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

<Button variant="destructive" size="sm" className={cn("custom-class", condition && "conditional-class")}>
  Click me
</Button>
```

## Context Providers

```typescript
const MyContext = createContext<ContextValue | undefined>(undefined);

export function MyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialValue);
  return <MyContext.Provider value={{ state, setState }}>{children}</MyContext.Provider>;
}

export function useMyContext() {
  const ctx = useContext(MyContext);
  if (!ctx) throw new Error("useMyContext must be used within MyProvider");
  return ctx;
}
```

## Important Notes

1. **TypeScript build errors are ignored** in `next.config.mjs` - still write type-safe code
2. **Images are unoptimized** - use standard `<img>` or Next.js `Image` component
3. **Server Components** are the default in App Router - add `"use client"` only when needed
4. **API base URL** is configured in `lib/api-config.ts` - use `apiClient` for all requests
5. **Authentication** is handled via `AuthProvider` context - use `useAuth()` hook

## Common Pitfalls to Avoid

- Don't use `"use client"` unnecessarily - keep components server-side when possible
- Don't import from `react` in server components that don't need it
- Always handle loading and error states in data-fetching components
- Use the path alias `@/` instead of relative paths for cleaner imports
- Don't hardcode API URLs - use the configured `apiClient`

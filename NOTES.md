# Implementation Notes

## TL;DR

### What Was Completed

- **All core requirements**: Component architecture (DDD style), data fetching (TanStack Query), add treatment dialog, search/status filters, pagination, status updates with optimistic UI
- **Tests**: Comprehensive unit and integration tests using Vitest + MSW (55 tests passing)
- **i18n & Error Handling**: Full internationalization (EN/HU) with next-intl, language selector. Two-tier error boundaries (app + page level) with translated error messages using react-error-boundary
- **CI/CD**: GitHub Actions workflow with typecheck, lint, build, test verification
- **Type Safety**: Comprehensive type safety using TypeScript, Zod, and next-intl

### Data Fetching Strategy: TanStack Query (Client-Side)

**Why this choice?**

- **Perfect for highly interactive dashboards** - Instant filter/search feedback without server round-trips, debounce search
- **Optimistic updates** - Status changes feel instant, rollback on error
- **Smart caching** - 60s stale time, automatic refetch, request deduplication
- **Behind authentication** - No SEO needed (would use hybrid/Server Components for public pages)
- **Excellent testability** - Fast unit tests, easy mocking at API layer
- **Built-in resilience** - Auto-retry (2x), request cancellation, error recovery

### What I Would Tackle Next

- **API content translation** - Translate backend responses (doctor names, procedures) for full i18n
- **E2E tests** - Add Playwright for critical user flows (create treatment, filter, status update)
- **Storybook** - Component documentation and visual testing
- **Reusable search/filter** - Extract into generic `<DataTable>` component for other entities
- **Deployment** - Set up dev/prod environments with real database (Vercel + PostgreSQL)
- **Sentry monitoring** - Add error tracking and performance monitoring
- **Analytics** - Add Google Analytics for user behavior tracking
- **Authentication** - Add NextAuth.js with role-based access control
- **Landing page** - Public marketing page with treatment tracking demo
- **Doctors dropdown** - Replace text input with searchable select, validate against doctors list

### Trade-offs & Assumptions

- **Bundle size vs UX**: Chose TanStack Query (~13KB) for superior interactivity over Server Components' smaller bundle
- **Traditional pagination vs infinite scroll**: Better accessibility, keyboard navigation, and shareability
- **nuqs for URL state**: Avoids state management boilerplate, makes filters shareable
- **DDD architecture**: More upfront structure for long-term maintainability and scalability
- **shadcn/ui (Radix UI)**: Built on Radix UI primitives which are WAI-ARIA compliant out of the box - excellent accessibility (keyboard navigation, screen readers, focus management) with minimal effort

---

## What I Completed (Detailed)

### 1. CI/CD Setup

- ✅ Created GitHub Actions workflow (`.github/workflows/ci.yml`)
  - Configured to run on push to `main` and all pull requests
  - Runs type checking (`tsc --noEmit`)
  - Runs linting (`npm run lint`)
  - Runs build verification (`npm run build`)
- ✅ Set up branch protection rules for `main` branch in GitHub
  - Requires pull requests before merging
  - Requires CI status checks to pass
  - Prevents force pushes
  - Ensures conversation resolution before merging
- ✅ Enabled GitHub Copilot review for automated code review on pull requests

### 2. Component Architecture Refactoring (DDD Style)

- ✅ Refactored monolithic `app/page.tsx` (259 lines) into modular DDD structure
- ✅ Created `modules/treatment/` directory following domain-driven design principles
- ✅ Extracted reusable components
- ✅ `app/page.tsx` now serves as thin wrapper (5 lines) - follows Next.js App Router best practices
- ✅ Maintained type safety throughout refactoring
- ✅ Applied state colocation principles - kept state at appropriate level (screen level)

### 3. Type Safety Improvements

- ✅ Consolidated status constants into single source of truth (`modules/treatment/types.ts`)
  - Usage: `STATUS.SCHEDULED.value` for values, `STATUS.SCHEDULED.label` for display
- ✅ Extended pattern to `FILTER_STATUS` by spreading `STATUS` and adding `ALL` option
- ✅ Removed underscore from constant names (e.g., `IN_PROGRESS` → `INPROGRESS`)
  - Keeps key names cleaner while maintaining `in_progress` as the actual value
- ✅ Made `STATUS_OPTIONS` array programmatic (`modules/treatment/constants.ts`)
  - Uses `Object.values(FILTER_STATUS).map()` to automatically derive options
  - Adding new status to `STATUS` automatically updates all dependent arrays
  - Eliminates manual maintenance of option lists
- ✅ Type derivation from constants using TypeScript utilities
  - `type TreatmentStatus = (typeof STATUS)[keyof typeof STATUS]["value"]`
  - Ensures type safety while keeping single source of truth

### 4. Data Fetching Implementation

- ✅ **TanStack Query Integration**
  - Chose TanStack Query over Server Components/Server Actions for:
    - Better client-side interactivity with filters and search (avoiding server round-trips)
    - Built-in request cancellation when filters change or user navigates away
    - Automatic retry logic (configured to 2 retries) for handling unstable API
    - Smart client-side caching with stale-while-revalidate strategy (`staleTime: 60s`)
    - Optimistic updates support (needed for Point 6: Status Updates)
  - Configured `QueryClient` in `app/providers.tsx` with sensible defaults
  - Disabled `refetchOnWindowFocus` to reduce unnecessary network requests

- ✅ **Runtime Type Safety with Zod**
  - Created Zod schemas for API response validation (`TreatmentSchema`, `TreatmentsResponseSchema`)
  - **BE → FE Entity Transformation** using Zod `.transform()`:
    - Status property: `"in_progress"` (snake_case) → `"inProgress"` (camelCase)
    - Notes cleanup: empty string → `undefined` for cleaner optional handling
    - Cost field: passed through for BE compatibility but documented as not displayed in UI
  - Transformation happens at API boundary (`modules/treatment/api.ts`), ensuring only clean FE entities reach React Query cache
  - Separated concerns:
    - `TreatmentBE` (in `lib/types.ts`): Backend entity used by API routes and mock layer
    - `Treatment` (derived from Zod schema): Frontend entity used by components
    - `BE_TO_FE_STATUS` mapping for status transformation

- ✅ **Centralized API Client** (`lib/apiClient.ts`)
  - Single source for all HTTP communication
  - Benefits:
    - Easy to modify base URLs and API versioning
    - Centralized error handling with custom `ApiError` class
    - Future-ready for interceptors (auth tokens, request/response logging)
    - Consistent headers across all requests
    - Type-safe HTTP methods (`get`, `post`, `patch`, `delete`)
  - Query parameter support via `params` option

- ✅ **Query Key Factory Pattern** (`modules/treatment/queryKeys.ts`)
  - Hierarchical structure: `["treatments"]` → `["treatments", "detail"]` → `["treatments", "detail", id]`
  - Benefits:
    - Granular cache invalidation (invalidate all treatments vs specific treatment)
    - Type-safe query keys with `as const`
    - Maintainable structure that scales with more entities
    - Clear naming convention for different query types

- ✅ **UX Improvements**
  - Loading states: Skeleton components (`TreatmentCardSkeleton`) for better perceived performance
  - Error states: User-friendly error messages with "Try again" button using `refetch()`
  - Disabled states: Filters disabled during loading to prevent race conditions
  - Built-in features from TanStack Query:
    - Request deduplication (multiple components requesting same data)
    - Background refetching for fresh data
    - Automatic garbage collection of unused cache entries

### 5. Search and Status Filters with URL State

- ✅ **nuqs Integration for Type-Safe URL State Management**
  - Chose nuqs over React state for URL as single source of truth:
    - Shareable URLs with filters preserved
    - Browser back/forward navigation works naturally
    - No state management boilerplate
    - Type-safe query parameter parsing
  - Custom Zod-based parser for `TreatmentStatusFilter` (`parseAsTreatmentStatusFilter`):
    - Validates URL params at runtime using existing Zod schemas
    - Returns properly typed union: `"all" | "scheduled" | "inProgress" | "completed" | "cancelled"`
    - Falls back to default value for invalid params

- ✅ **Debounced Search for Better UX**
  - Created `useDebouncedQueryState` custom hook (`lib/hooks/use-debounced-query-state.ts`):
    - Returns three values: `[inputValue, setInputValue, debouncedValue]`
    - `inputValue` updates immediately for responsive input field
    - `debouncedValue` updates after 400ms delay for API queries
    - Prevents excessive API requests while user is typing
    - Syncs with URL param changes from browser navigation
  - Used `useDebounce` helper hook for reusable debounce logic
  - Input field maintains focus during API requests (not disabled during loading)

- ✅ **Centralized Query Parameter Constants**
  - Created `TREATMENT_QUERY_PARAMS` in `modules/treatment/treatment-types.ts`:
    - `SEARCH: "search"` and `STATUS: "status"`
    - Single source of truth for query param keys
    - Module-specific to prevent collisions
    - Easy to refactor if param names need to change
  - Follows existing module architecture pattern

- ✅ **Server-Side Filtering**
  - Updated `fetchTreatments` to accept filter params (`search`, `status`)
  - Query keys include filters for proper cache segmentation
  - TanStack Query automatically refetches when filter values change
  - Better performance than client-side filtering for large datasets

### 6. Pagination

- ✅ **Traditional Pagination over Infinite Scroll**
  - Chose pagination instead of lazy loading/infinite scroll for:
    - **Better accessibility**: Clear page boundaries, screen reader friendly
    - **Keyboard navigation**: Users can tab through page numbers
    - **Direct navigation**: Users can jump to specific pages
    - **Shareability**: URL params make it easy to share exact page/filter combinations
    - **Cognitive clarity**: Users know exactly where they are in the dataset
    - **Simpler implementation**: Less complex than intersection observers and virtual scrolling

### 7. Error Handling & Internationalization

- ✅ **Two-Tier Error Boundary Architecture**
  - Implemented using `react-error-boundary` (2M+ weekly downloads, maintained by Kent C. Dodds)
  - **App-level boundary** (`app/[locale]/providers.tsx`):
    - Wraps entire application
    - Catches all uncaught React errors globally
    - Prevents full app crashes
    - Logs errors for monitoring integration (Sentry-ready)
  - **Page-level boundary** (`app/[locale]/treatments-page-content.tsx`):
    - Wraps treatments feature specifically
    - Provides granular error logging ("Treatments page error" vs "App-level error")
    - Allows feature-specific error recovery
    - Keeps other features working if one crashes

- ✅ **Reusable Error Fallback Component** (`components/error-fallback.tsx`)
  - Fully internationalized with next-intl
  - Shows user-friendly error messages in current locale (EN/HU)
  - Displays error message if available, otherwise generic description
  - "Try again" button to reset error boundary
  - Consistent UI with shadcn/ui components

- ✅ **Internationalization (i18n)**
  - Implemented using next-intl with App Router integration
  - **Two locales**: English (en) and Hungarian (hu)
  - **Middleware setup** (`middleware.ts`):
    - Automatic locale detection and routing
    - Redirects root `/` to default locale `/en`
    - Handles `/en` and `/hu` routes
  - **Translation files** (`i18n/messages/en.json`, `i18n/messages/hu.json`):
    - Organized by namespace: `errors`, `treatments`
    - All UI strings translated (55+ strings)
    - Supports interpolation for dynamic values (`{{error}}`)
  - **Language selector** (`components/language-selector.tsx`):
    - Dropdown in header for switching languages
    - Preserves current route and filters when switching
    - Uses next-intl navigation for seamless transitions
  - **Type-safe translations**:
    - Full TypeScript support with `useTranslations` hook
    - Compile-time checking for missing translation keys

- ✅ **Benefits of Combined Approach**
  - **Resilience**: Errors caught at multiple levels prevent cascading failures
  - **User experience**: Friendly, translated error messages instead of blank screens
  - **Developer experience**: Clear error logs with context for debugging
  - **Maintainability**: Reusable components, easy to add more error boundaries
  - **Accessibility**: Error messages respect user's language preference
  - **Future-ready**: Easy to integrate with error monitoring services (Sentry, LogRocket)

## Project Conventions

### FileName Conventions

- ✅ Use kebab-case for file names (e.g., `treatment-card.tsx`)
- ✅ Use PascalCase for component names (e.g., `TreatmentCard`)

### Commit Messages

Following [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) specification:

- Format: `<type>[optional scope]: <description>`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, etc.
- Examples:
  - `ci: add GitHub Actions workflow`
  - `feat: add pagination to treatments list`
  - `fix: resolve status update bug`
  - `docs: update README with setup instructions`

### Code Formatting

Automated code formatting using Prettier + EditorConfig:

- **EditorConfig** (`.editorconfig`) - Controls basic formatting:
  - Indentation: 2 spaces
  - Line endings: LF
  - Charset: UTF-8
- **Prettier** - Uses opinionated defaults:
  - Semicolons: enabled
  - Trailing commas: ES5 compatible
  - Format on save: enabled (Windsurf/VS Code)
- **Exclusions** (`.prettierignore`):
  - `components/**` - shadcn/ui components kept in original style
- **Pre-commit Hook** (`simple-git-hooks` + `lint-staged`):
  - Automatically runs on staged files before commit
  - ESLint --fix for `.ts` and `.tsx` files
  - Prettier format for all staged files
- **Scripts**:
  - `npm run format` - Format all files
  - `npm run format:check` - Check formatting (CI)

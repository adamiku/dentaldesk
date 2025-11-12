# DentalDesk - Tabeo Front-end Tech Challenge

Welcome! This is a take-home coding challenge where you'll be improving a dental treatments management interface built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

The current implementation is functional but intentionally rough — it's a starting point that needs refinement. Your task is to transform it into a production-ready, maintainable codebase by addressing the areas outlined below.

### What to Improve

#### 1. Component Architecture

The main page currently has everything in one file. Extract reusable components into separate modules to improve maintainability.

#### 2. Data Fetching

The current data fetching is basic and doesn't handle edge cases well. Improve it by:

- Implementing proper client-side caching
- Handling request cancellations (e.g., when navigating away or filters change)
- Adding type safety with runtime validation
- Improve the UX with skeletons, error states with retry, and disabled states

Feel free to use third‑party libraries you’re familiar with or even Server Components.

#### 3. Add Treatment Dialog

The "Add treatment" dialog is currently not functional. Integrate it with the API endpoint:

- Use `react-hook-form` with Zod validation
- Handle server-side errors gracefully
- Show success/error feedback with toast notifications (Sonner is already installed)

#### 4. Search and Status Filters

Currently, search and status filtering happen client-side on already-loaded data. Rework these to use the API endpoints instead, which support query parameters for filtering.

#### 5. Lazy Loading / Pagination

The treatments list currently loads all items at once. Implement lazy loading or pagination to improve performance as the dataset grows. The API already supports pagination via query parameters. Improve the UX by keeping search and pagination state in URL.

#### 6. Status Updates

The status update dropdown doesn't actually update anything. Integrate it with the API endpoint and implement optimistic UI updates for a better user experience.

## Nice‑to‑haves (optional)

- Tests for data hooks or critical components
- i18n
- Simple CI (typecheck/lint/build)

### What You Don't Need to Do

- **No work in `/api` folder** — The API endpoints are already implemented and working
- **No work in `/mock` folder** — The mock data layer is provided and should remain unchanged

## 📡 API Documentation

The API endpoints are already implemented. Here's how to use them:

⚠️ Note: The API is intentionally unstable. Some requests may fail or return errors at random — this is part of the challenge. Handle these gracefully with retries, error states, or user feedback.

### Treatment Type

```typescript
type TreatmentStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

interface Treatment {
  id: number;
  patient: string;
  procedure: string;
  dentist: string;
  date: string;
  status?: TreatmentStatus;
  notes?: string;
  cost?: number;
}
```

### Fetch Treatments List

**GET** `/api/treatments`

Query parameters:

- `search` (optional): Search term that matches patient, procedure, or dentist names (case-insensitive)
- `status` (optional): Filter by status (`"scheduled"`, `"in_progress"`, `"completed"`, `"cancelled"`, or `"all"`)
- `page` (optional): Page number (default: `1`)
- `pageSize` (optional): Items per page (default: `9`, max: `100`)

**Example:**

```typescript
// Fetch first page with default page size
fetch("/api/treatments");

// Search with filters and pagination
fetch("/api/treatments?search=patel&status=completed&page=1&pageSize=20");
```

**Response:**

```typescript
{
  "data": Treatment[],
  "total": number,
  "page": number,
  "pageSize": number,
  "totalPages": number
}
```

### Fetch Single Treatment

**GET** `/api/treatments/[id]`

**Example:**

```typescript
fetch("/api/treatments/1");
```

**Response:**

```typescript
Treatment;
```

**Error responses:**

- `400`: Invalid treatment id
- `404`: Treatment not found

### Create New Treatment

**POST** `/api/treatments`

**Request body:**

```typescript
{
  patient: string;      // Required
  procedure: string;     // Required
  dentist: string;      // Required
  date: string;         // Required (ISO date string)
  status?: TreatmentStatus;  // Optional, defaults to "scheduled"
  notes?: string;       // Optional
  cost?: number;         // Optional
}
```

**Example:**

```typescript
fetch("/api/treatments", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    patient: "Jane Doe",
    procedure: "Filling",
    dentist: "Dr. Smith",
    date: "2024-01-15",
    status: "scheduled",
    notes: "Regular checkup",
  }),
});
```

**Response:**

- `201`: Created treatment object
- `422`: Missing required field (response includes `message`)

### Update Treatment Status

**PATCH** `/api/treatments/[id]`

**Request body:**

```typescript
{
  status: TreatmentStatus; // Required
}
```

**Example:**

```typescript
fetch("/api/treatments/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    status: "in_progress",
  }),
});
```

**Response:**

- `200`: Updated treatment object
- `400`: Invalid treatment id
- `404`: Treatment not found
- `422`: Status is required (response includes `message`)

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🧠 What We're Looking For

- **Clear React code and sensible state management** — How you organize state, whether you use context, hooks, or other patterns
- **Correct handling of async data and mutations** — Loading states, error handling, race conditions
- **Clean, reusable components** — Not everything in one file, sensible component boundaries
- **Good use of the existing design system** — Leverage shadcn/ui components effectively
- **UX details** — Loading/empty/error states, disabled states, feedback on actions
- **Reasonable responsiveness** — The UI should work well on different screen sizes

## 🔗 Version Control & Submission

- Please use Git for version control throughout your work, with clear and meaningful commits.
- Share a link to your repository (e.g., GitHub, GitLab, Bitbucket) so we can access the source code.
- If the repository is private, please invite us to the project so we can review it.

## 📝 Please Include

At the end, add a short note in a `NOTES.md` file:

- **What you completed** — A brief summary of the improvements you made
- **Anything you'd improve** — What would you tackle next?
- **Any trade-offs or assumptions you made** — Why did you choose certain approaches?

### ✅ Submission Checklist

- [ ] Core requirements delivered (architecture, data, dialog, filters, pagination, status updates)
- [ ] Solid UX and resilience (loading/empty/error states, retries, optimistic updates)
- [ ] Clean commits; repo link shared; access granted if private
- [ ] `NOTES.md` included with summary, next steps, and trade-offs

Optional: tests, i18n, and simple CI are appreciated.

Thanks again for taking the time — we're looking forward to your solution.

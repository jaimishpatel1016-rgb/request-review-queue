## Setup

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
pnpm install
```

Create a `.env` file:

```
MONGODB_URI=your_mongodb_connection_string
PORT=4000
```

```bash
pnpm dev
pnpm test       
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend expects the API at `http://localhost:4000/api` by default. Override with `NEXT_PUBLIC_API_URL` in your environment if needed.

### Business Rules

- A request cannot be **approved** unless `requiredFieldsComplete` is true.
- A request cannot be **rejected** without providing a rejection reason.
- Every status change and owner reassignment creates a history entry.

## Architecture

**Backend:** Express + Mongoose, controller/service/model layers. Business logic lives in services. History and notes are subdocuments on the request document, simple to query, no cross-collection issues.

**Frontend:** Next.js, React Query, shadcn components. Mutations are centralized in hooks. Axios interceptor extracts backend error messages for toasts.

**Tests:** Vitest + `mongodb-memory-server` — runs against a real in-memory MongoDB, no external DB needed.

### Tradeoffs

- Owner list is hardcoded on the frontend, would need a user service in production
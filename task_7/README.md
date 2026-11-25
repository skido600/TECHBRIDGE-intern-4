# TechBridge Task Management API — Task 7

A responsive internship dashboard connected to a REST API built with Express, TypeScript and Bun. Task data is stored in `backend/data/tasks.json`, so status updates persist when the server restarts.

## Requirements

- Bun (recommended) or Node.js with a compatible TypeScript runner
- A terminal

## Run the project with Bun

Open a terminal in the `backend` folder:

```bash
cd backend
bun install
bun run dev
```

Open:

- Dashboard: http://localhost:3000/dashboard.html
- All tasks: http://localhost:3000/api/tasks
- API health: http://localhost:3000/api/health

The backend also serves the frontend, so you do not need a separate frontend server or CORS configuration.

## API documentation

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check whether the API is running |
| GET | `/api/tasks` | Return all internship tasks |
| GET | `/api/tasks/:id` | Return one task by ID |
| PUT | `/api/tasks/:id` | Update a task's status |
| POST | `/api/tasks` | Create a task (optional challenge) |
| DELETE | `/api/tasks/:id` | Delete a task (optional challenge) |

### Update a task

Send a `PUT` request to `/api/tasks/3` with JSON:

```json
{
  "status": "completed"
}
```

Allowed statuses: `not-started`, `in-progress`, `completed`.

### Create a task

Send a `POST` request to `/api/tasks` with JSON:

```json
{
  "title": "Build a portfolio",
  "description": "Create and publish a personal developer portfolio."
}
```

### Delete a task

Send a `DELETE` request to `/api/tasks/9`.

## Project structure

```text
techbridge-task-management/
├── backend/
│   ├── data/
│   │   └── tasks.json
│   ├── src/
│   │   ├── server.ts
│   │   ├── store.ts
│   │   └── types.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── dashboard.js
│   └── dashboard.html
└── README.md
```

## Features

- Loads task information from the backend using `fetch()`
- Loading, empty and API error states
- Backend connection indicator and retry action
- Task detail modal that fetches one task from the API
- Mark as completed using the PUT endpoint
- Progress counts and percentage update from API data
- All, Completed, In progress and Not started filters
- Search tasks by title, description or technology
- Optional create and delete endpoints
- Responsive layout for desktop and mobile
- JSON file persistence

## Notes about the seeded internship tasks

The eight seeded records follow the TechBridge internship work discussed for this project: Homepage, Programs, 30-Day Internship Tasks Experience, Internship Roadmap, Challenge Hub, Intern Dashboard, Task Management API and Complete Internship Platform. Task 8 is included as the next milestone from the official roadmap. Review `backend/data/tasks.json` and adjust any task descriptions or statuses to match your final evidence before submission.

## Submission checklist

1. Run the backend and verify the dashboard and API endpoints.
2. Test loading/error states, filters, task details and status updates.
3. Capture screenshots or a short screen recording.
4. Publish your evidence on LinkedIn and tag TechBridge Services.
5. Copy the LinkedIn post URL into the official TechBridge Task Submission Form.

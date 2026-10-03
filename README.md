# Task Board

A small full-stack task management board for teams. Tasks can be created, edited, deleted, moved between status columns and assigned optional due dates. The application also highlights overdue tasks and supports drag-and-drop between status columns.

## Features

* Create tasks with:

  * Required title
  * Optional description
  * Status
  * Optional due date
* Edit existing tasks
* Delete tasks with confirmation
* Move tasks between Todo, In Progress and Done
* Drag and drop tasks between status columns
* Highlight overdue tasks
* Validate task titles and statuses
* Persist tasks using SQLite
* Filter tasks by status through the API
* REST API for task CRUD operations
* Backend API tests using Vitest and Supertest

## Tech Stack

### Frontend

* Vue 3
* TypeScript
* Vite
* Lucide Vue Next

### Backend

* Node.js
* Express
* TypeScript

### Database

* SQLite
* better-sqlite3

### Testing

* Vitest
* Supertest

## Project Structure

```text
task-board/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── app.ts
│   │   └── server.ts
│   └── tests/
│       └── tasks.test.ts
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── EditTaskModal.vue
│       │   ├── TaskCard.vue
│       │   └── TaskForm.vue
│       ├── types/
│       │   └── task.ts
│       ├── App.vue
│       └── style.css
│
└── README.md
```

## Getting Started

### Prerequisites

* Node.js
* npm

### 1. Install backend dependencies

From the project root:

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

Open a second terminal and run:

```bash
cd frontend
npm install
```

## Running the Application

### Start the backend

From the `backend` directory, run:

```bash
npx tsx src/server.ts
```

The backend API runs on:

```text
http://localhost:3000
```

### Start the frontend

In a second terminal:

```bash
cd frontend
npm run dev
```

Vite will provide a local URL for the frontend, typically:

```text
http://localhost:5173
```

Open the provided URL in a browser.

## Running Tests

From the `backend` directory:

```bash
npm test
```

The test suite covers:

* Retrieving tasks
* Creating tasks
* Rejecting invalid task titles
* Rejecting invalid task statuses
* Updating tasks
* Handling updates for missing tasks
* Deleting tasks
* Handling deletion of missing tasks

## API

The backend exposes the following endpoints:

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| GET    | `/tasks`             | Retrieve all tasks                |
| GET    | `/tasks?status=todo` | Retrieve tasks filtered by status |
| POST   | `/tasks`             | Create a new task                 |
| PATCH  | `/tasks/:id`         | Update an existing task           |
| DELETE | `/tasks/:id`         | Delete a task                     |

### Task fields

```json
{
  "id": 1,
  "title": "Complete README",
  "description": "Document the application",
  "status": "todo",
  "dueDate": "2026-10-05",
  "createdAt": "2026-10-03T10:00:00.000Z"
}
```

The supported task statuses are:

```text
todo
in_progress
done
```

## Validation

The backend validates task input before modifying the database.

* Title is required
* Title cannot be empty
* Title cannot exceed 100 characters
* Status must be one of `todo`, `in_progress`, or `done`
* Requests for non-existent task IDs return a `404` response
* Invalid input returns an appropriate error response

Frontend forms also provide basic browser-level validation, while backend validation remains the source of truth for API requests.

## Persistence

Tasks are stored in a SQLite database using `better-sqlite3`.

This means tasks are persisted to disk rather than being stored only in application memory. As a result, tasks remain available after the backend server is stopped and restarted.

SQLite was chosen because the application has a small data model and does not require a separate database server.

## Design Decisions and Trade-offs

### Vue with TypeScript

Vue 3 was chosen for the frontend because it provides a simple component-based structure for building the task board and handling reactive state.

TypeScript was used to provide type checking for task data and task statuses, reducing the chance of passing invalid values between components.

### Express

Express was chosen for the backend because the application only requires a small REST API. It provides a straightforward way to implement the required CRUD operations and validation.

### SQLite

SQLite was selected as the persistence layer because it is lightweight and requires minimal setup while still providing persistent storage across server restarts.

For a larger production application with many concurrent users, a hosted database such as PostgreSQL would be more appropriate.

### Component-based frontend

The frontend separates the task card, task creation form and edit modal into individual Vue components.

This keeps the main board responsible for coordinating tasks and API communication while allowing individual UI elements to remain focused on their own responsibilities.

### Drag and drop

Drag and drop was implemented using the browser's native drag-and-drop functionality rather than introducing an additional drag-and-drop dependency.

When a task is dropped into another status column, the frontend sends a `PATCH` request to the existing task endpoint to update the task's status. The board then refreshes its task data so the change is reflected in the UI and persisted in SQLite.

## Overdue Tasks

A task is considered overdue when:

* It has a due date in the past, and
* Its status is not `done`

Tasks due on the current date are not considered overdue.

Completed tasks are not highlighted as overdue even if their due date has passed.

## Stretch Features

The following optional stretch feature was implemented:

* **Drag and drop between status columns**

The other optional stretch features were not implemented so that development could remain focused on the core requirements and maintain a clean, reliable implementation within the intended time limit.

## What I Would Improve With More Time

If more development time were available, I would consider:

* Adding title search for larger task lists
* Adding sorting by due date
* Adding more frontend tests for task creation, editing and drag-and-drop behaviour
* Improving frontend loading and error states
* Adding a deployment configuration for a hosted version of the application
* Adding more comprehensive accessibility support for keyboard-based task movement
* Improve the UI of the task board

## AI Usage

I used ChatGPT during development for step-by-step implementation guidance, debugging assistance, explanations of unfamiliar code and concepts, and discussion of design and implementation decisions.

I reviewed and tested the suggested implementations.

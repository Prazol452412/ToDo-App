# To-Do List REST API

A REST API for a collaborative To-Do List application, built with Node.js, Express, and MongoDB (Mongoose).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Setup](#project-setup)
- [Environment Variables](#environment-variables)
- [Database Setup - Local MongoDB](#database-setup---local-mongodb)
- [Database Setup - MongoDB Atlas (Cloud)](#database-setup---mongodb-atlas-cloud)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)
- [Troubleshooting](#troubleshooting)
- [Verifying Data Persistence](#verifying-data-persistence)

---

## Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB, either installed locally or a MongoDB Atlas account

---

## Project Setup

1. Clone the repository:

```bash
   git clone <your-repo-url>
   cd todo-api
```

2. Install dependencies:

```bash
   npm install
```

3. Create a `.env` file in the project root (see [Environment Variables](#environment-variables) below).

4. Start MongoDB, either locally or via Atlas (see database setup sections below).

5. Run the server:

```bash
   npm run dev
```

The API will be available at `http://localhost:5000`.

---

## Environment Variables

Create a `.env` file in the project root. Do not commit this file, it is already listed in `.gitignore`.

```
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
```

| Variable    | Description                        | Required              |
| ----------- | ---------------------------------- | --------------------- |
| `PORT`      | Port the Express server listens on | No (defaults to 5000) |
| `MONGO_URI` | Full MongoDB connection string     | Yes                   |

---

## Database Setup - Local MongoDB

### Step 1: Install MongoDB Community Edition

- Windows/macOS/Linux: download and install from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
- macOS with Homebrew:

```bash
  brew tap mongodb/brew
  brew install mongodb-community
```

### Step 2: Start the MongoDB service

```bash
mongod
```

By default, this runs MongoDB on `127.0.0.1:27017`.

### Step 3: Set your connection string

In `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/todo-api
```

Here, `todo-api` is the database name. MongoDB creates it automatically the first time data is written.

### Step 4: Verify the connection

Run the server:

```bash
npm run dev
```

Expected terminal output:

```
MongoDB connected: 127.0.0.1
Server running on port 5000
```

---

## Database Setup - MongoDB Atlas (Cloud)

### Step 1: Create a free Atlas account

Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up.

### Step 2: Create a cluster

- Click "Build a Database" and choose the Free (M0) tier
- Pick a cloud provider and region close to you
- Click "Create"

### Step 3: Create a database user

- In "Database Access," click "Add New Database User"
- Set a username and password (save these, you will need them in your connection string)
- Give the user "Read and write to any database" permissions

### Step 4: Allow network access

- In "Network Access," click "Add IP Address"
- For development and testing, choose "Allow Access from Anywhere" (`0.0.0.0/0`)
- For production, restrict this to specific IPs

### Step 5: Get your connection string

- Go to "Database," then click "Connect" on your cluster
- Choose "Drivers," then select "Node.js"
- Copy the connection string, which looks like this:

```
  mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Set your connection string

In `.env`, insert your credentials and add a database name before the `?`:

```
MONGO_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/todo-api?retryWrites=true&w=majority
```

Note: if your password contains special characters (`@`, `#`, `%`, etc.), URL-encode them or the connection will fail.

### Step 7: Verify the connection

```bash
npm run dev
```

Expected output:

```
MongoDB connected: cluster0-shard-00-00.xxxxx.mongodb.net
Server running on port 5000
```

---

## Running the Server

```bash
npm run dev
```

This uses nodemon to auto-restart the server on file changes. To run without nodemon:

```bash
npm start
```

---

## API Endpoints

| Method | Endpoint       | Description                                           |
| ------ | -------------- | ----------------------------------------------------- |
| POST   | /api/tasks     | Create a new task                                     |
| GET    | /api/tasks     | Get all tasks (optional `?completed=true` or `false`) |
| GET    | /api/tasks/:id | Get a single task by ID                               |
| PUT    | /api/tasks/:id | Fully update a task                                   |
| PATCH  | /api/tasks/:id | Partially update a task                               |
| DELETE | /api/tasks/:id | Delete a task                                         |

### Task Schema

| Field       | Type    | Notes                                 |
| ----------- | ------- | ------------------------------------- |
| title       | String  | Required, trimmed, max 100 characters |
| description | String  | Optional                              |
| isCompleted | Boolean | Defaults to false                     |
| dueDate     | Date    | Optional                              |
| createdAt   | Date    | Auto-generated                        |
| updatedAt   | Date    | Auto-generated                        |

---

## Testing the API

Use the included `api.http` file with the VS Code "REST Client" extension, or import the endpoints into Postman or Thunder Client manually using the endpoint table above.

Example request bodies:

Create a task:

```json
{
  "title": "Finish backend assignment",
  "description": "Build the REST API for the To-Do app",
  "dueDate": "2026-08-25"
}
```

Update a task (PATCH):

```json
{
  "isCompleted": true
}
```

---

## Troubleshooting

| Problem                                      | Likely Cause                                                   | Fix                                                                        |
| -------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `MongooseServerSelectionError`               | MongoDB is not running locally                                 | Run `mongod` in a separate terminal                                        |
| `Authentication failed`                      | Wrong username or password in Atlas URI                        | Recheck credentials in Database Access                                     |
| Connection timeout on Atlas                  | IP not whitelisted                                             | Add your IP (or `0.0.0.0/0`) in Network Access                             |
| `MONGO_URI is undefined`                     | `.env` file missing or `dotenv.config()` not called before use | Confirm `.env` exists and `dotenv.config()` runs at the top of `server.js` |
| Special characters in password break the URI | Password not URL-encoded                                       | Encode characters like `@` to `%40`, `#` to `%23`                          |

---

## Verifying Data Persistence

Once connected, create a task via `POST /api/tasks` and confirm it is stored:

Local setup: open a new terminal, run `mongosh`, then:

```js
use todo-api
db.tasks.find().pretty()
```

Atlas setup: go to your cluster, then "Browse Collections" in the Atlas dashboard to view documents directly.

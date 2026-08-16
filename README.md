# To-Do List REST API

A production-ready REST API for a collaborative To-Do List application built with Node.js, Express, and MongoDB (Mongoose).

## Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete tasks
- ✅ **Data Validation** - Mongoose schema validation with helpful error messages
- ✅ **Error Handling** - Global error handler with clean JSON responses
- ✅ **Async/Await** - Modern promise-based controller functions with graceful error catching
- ✅ **MongoDB Integration** - Persistent data storage with automatic timestamps
- ✅ **Filter Support** - Query tasks by completion status
- ✅ **Environment Configuration** - Secure setup via .env file

## Project Structure

```
.
├── config/
│   └── database.js          # MongoDB connection logic
├── controllers/
│   └── taskController.js    # Business logic for all endpoints
├── middleware/
│   ├── asyncHandler.js      # Wraps async functions to catch errors
│   └── errorHandler.js      # Global error handling middleware
├── models/
│   └── Task.js              # Mongoose schema and model
├── routes/
│   └── taskRoutes.js        # Route definitions and middleware
├── .env                      # Environment variables (create from .env.example)
├── .env.example              # Template for environment variables
├── package.json              # Project metadata and dependencies
├── server.js                 # Express app setup and entry point
└── README.md                 # This file
```

## Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **npm** (comes with Node.js)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This installs:

- **express** - Web framework
- **mongoose** - MongoDB object modeling
- **dotenv** - Environment variable management
- **nodemon** - Auto-restart on file changes (dev dependency)

### 2. Configure Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Then edit `.env` and set your MongoDB connection string:

#### Option A: Local MongoDB

```
MONGODB_URI=mongodb://localhost:27017/todoapp
PORT=3000
NODE_ENV=development
```

#### Option B: MongoDB Atlas (Cloud)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" and copy your connection string
4. Replace `<password>` with your database user password
5. Add the connection string to `.env`:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp?retryWrites=true&w=majority
PORT=3000
NODE_ENV=development
```

### 3. Start the Server

**Development mode** (with auto-restart on file changes):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

The server will start on `http://localhost:3000`

You should see:

```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:3000
```

## API Documentation

### Base URL

```
http://localhost:3000/api/tasks
```

### Endpoints

#### 1. CREATE Task

**POST** `/api/tasks`

Create a new task in the database.

**Request Headers:**

```
Content-Type: application/json
```

**Request Body:**

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "dueDate": "2024-12-25"
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "isCompleted": false,
    "dueDate": "2024-12-25T00:00:00.000Z",
    "createdAt": "2024-12-15T10:30:00.000Z",
    "updatedAt": "2024-12-15T10:30:00.000Z"
  }
}
```

**Error Response (400 Bad Request):**

```json
{
  "success": false,
  "message": "Title is required and cannot be empty"
}
```

---

#### 2. GET All Tasks

**GET** `/api/tasks`

Retrieve all tasks. Supports optional filtering by completion status.

**Query Parameters:**

- `completed=true` - Return only completed tasks
- `completed=false` - Return only incomplete tasks
- (no parameter) - Return all tasks

**Example Requests:**

```
GET /api/tasks
GET /api/tasks?completed=true
GET /api/tasks?completed=false
```

**Response (200 OK):**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "isCompleted": false,
      "dueDate": "2024-12-25T00:00:00.000Z",
      "createdAt": "2024-12-15T10:30:00.000Z",
      "updatedAt": "2024-12-15T10:30:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "Finish project",
      "description": null,
      "isCompleted": true,
      "dueDate": "2024-12-20T00:00:00.000Z",
      "createdAt": "2024-12-14T14:22:00.000Z",
      "updatedAt": "2024-12-15T08:15:00.000Z"
    }
  ]
}
```

---

#### 3. GET Single Task

**GET** `/api/tasks/:id`

Retrieve a specific task by its MongoDB ObjectId.

**URL Parameters:**

- `id` - The task's MongoDB ObjectId

**Example Request:**

```
GET /api/tasks/507f1f77bcf86cd799439011
```

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "isCompleted": false,
    "dueDate": "2024-12-25T00:00:00.000Z",
    "createdAt": "2024-12-15T10:30:00.000Z",
    "updatedAt": "2024-12-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Task not found"
}
```

**Error Response (400 Bad Request - Invalid ID):**

```json
{
  "success": false,
  "message": "Invalid task ID format"
}
```

---

#### 4. UPDATE Task (Full Update)

**PUT** `/api/tasks/:id`

Fully update a task. Validates all fields.

**Request Body:**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "isCompleted": true,
  "dueDate": "2024-12-31"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated title",
    "description": "Updated description",
    "isCompleted": true,
    "dueDate": "2024-12-31T00:00:00.000Z",
    "createdAt": "2024-12-15T10:30:00.000Z",
    "updatedAt": "2024-12-15T11:45:00.000Z"
  }
}
```

---

#### 5. PARTIAL UPDATE Task

**PATCH** `/api/tasks/:id`

Partially update a task. Only provided fields are updated.

**Request Body:**

```json
{
  "isCompleted": true
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "isCompleted": true,
    "dueDate": "2024-12-25T00:00:00.000Z",
    "createdAt": "2024-12-15T10:30:00.000Z",
    "updatedAt": "2024-12-15T11:50:00.000Z"
  }
}
```

---

#### 6. DELETE Task

**DELETE** `/api/tasks/:id`

Remove a task from the database permanently.

**Example Request:**

```
DELETE /api/tasks/507f1f77bcf86cd799439011
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Buy groceries",
    "description": "Milk, eggs, bread",
    "isCompleted": false,
    "dueDate": "2024-12-25T00:00:00.000Z",
    "createdAt": "2024-12-15T10:30:00.000Z",
    "updatedAt": "2024-12-15T10:30:00.000Z"
  }
}
```

**Error Response (404 Not Found):**

```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Testing with VS Code REST Client

Install the **REST Client** extension (by Huachao Zheng) in VS Code.

Use the provided `api.http` file to test all endpoints:

```bash
# Open api.http in VS Code and click "Send Request" above each request
```

Or use the Thunder Client collection: `thunder-client-collection.json`

---

## Code Architecture Explanation

### Entry Point: `server.js`

- Loads environment variables with `dotenv.config()`
- Connects to MongoDB via `connectDB()`
- Sets up middleware (JSON parser)
- Registers routes
- Implements 404 handler
- Applies global error handler (MUST be last)

### Middleware: `asyncHandler.js`

Wraps async controller functions to catch promise rejections:

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

Without this wrapper, an error in an async function would crash the server. With it, errors are caught and passed to the error handler middleware.

### Middleware: `errorHandler.js`

Global error handler (4-argument function - Express recognizes this as error middleware):

- Logs errors server-side
- Returns clean JSON response to client
- Hides stack traces in production
- Must be registered LAST in `server.js`

### Model: `Task.js`

Mongoose schema defines:

- **title**: Required, max 100 chars, trimmed
- **description**: Optional, trimmed
- **isCompleted**: Boolean, default false
- **dueDate**: Optional date
- **timestamps**: Automatic `createdAt` and `updatedAt` fields

Schema validation prevents invalid data from being saved.

### Controller: `taskController.js`

Business logic for each endpoint:

1. Validates request data (empty title, invalid ID format)
2. Performs database operations
3. Returns appropriate status codes (201, 200, 400, 404, 500)
4. Handles Mongoose validation errors
5. Throws errors for the error handler to catch

### Routes: `taskRoutes.js`

Defines HTTP methods and wraps controllers with `asyncHandler`:

```javascript
router.post("/", asyncHandler(createTask));
```

## Common Issues & Solutions

### ❌ Error: "Cannot find module 'express'"

**Solution:** Run `npm install` to install dependencies

### ❌ Error: "Cannot use import statement outside a module"

**Solution:** Ensure `"type": "module"` is in `package.json`

### ❌ Error: "MONGODB_URI is not defined"

**Solution:** Create `.env` file with valid MongoDB connection string

### ❌ Error: "MongoServerSelectionError: connect ECONNREFUSED"

**Solution:**

- Local MongoDB: Start MongoDB service (`mongod`)
- MongoDB Atlas: Check connection string and firewall whitelist

### ❌ No response from API

**Solution:** Check if `npm run dev` is running and server is listening

## Learning Outcomes

By studying this code, you'll understand:

- ✅ RESTful API design (CRUD operations, status codes)
- ✅ Express.js routing and middleware
- ✅ MongoDB and Mongoose (schema, validation, queries)
- ✅ Error handling in Node.js (try/catch, async handlers)
- ✅ Environment configuration (dotenv)
- ✅ Request/response lifecycle
- ✅ Validation and sanitization
- ✅ Clean code organization (MVC pattern)

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## License

ISC

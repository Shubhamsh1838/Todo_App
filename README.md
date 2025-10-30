# Created Todo_App which manages task reminders before 30 minutes of due 

# `Backend`: Built with Node.js, Express, MongoDB featuring JWT authentication, RESTful APIs, and automated email reminders using SendGrid. Includes secure password hashing, input validation, and cron-based task scheduling.

# `Frontend`: Developed with React, React Router, and Context API providing a responsive UI with protected routes, real-time task management, and modern CSS styling. Features form validation, error handling, and mobile-first design.

# `Full-Stack Integration`: Connected via Axios with automatic JWT token handling, creating a complete authentication system and seamless CRUD operations for a production-ready Todo application with email notifications.

# `Deployed` this project on `render` free service check this out on link
  link->  https://todo-app-taskreminder.onrender.com/

# `Github` link for this Todo_App 
  link-> https://github.com/Shubhamsh1838/Todo_App

# For `Backend` I used some tech stack that is mentioned below
-> The application will run on: http://localhost:5000 (Development) `npm run dev`

-> Runtime: Node.js
-> Framework: Express.js
-> Language: JavaScript
-> Database: MongoDB with Mongoose ODM
-> Authentication: JWT (JSON Web Tokens)
-> Email Service: Nodemailer with SendGrid integration
-> Validation: Express-validator
-> Security: Bcryptjs, Helmet, CORS
-> Scheduling: Node-cron for reminder service

# Project structure for backend

backend/
├── models/
│   ├── User.js          # User schema with password hashing
│   └── Task.js          # Task schema with user reference
├── middleware/
│   └── auth.js          # JWT authentication middleware
├── routes/
│   ├── auth.js          # Authentication routes
│   └── tasks.js         # Task management routes
├── services/
│   ├── emailService.js  # Email sending service
│   └── reminderService.js # Automated reminder service
├── server.js            # Main server file
├── package.json
└── package-lock.json

# Auth Endpoints
-> POST /api/auth/register
   * To register user data details
-> POST /api/auth/login
   * Allow user to login compare using data from database and provide token
-> GET /api/auth/me (Protected)
   * Returns current user data

# Task Endpoints (All Protected)
-> GET /api/tasks
   * Fetch all tasks for authenticated user
   * Sorted by creation date (newest first)
-> POST /api/tasks
   * Post a new task details and add it to already existing
-> PUT /api/tasks/:id
   * Update task properties
-> DELETE /api/tasks/:id
   * Delete a specific task


#  Email Reminder System
-> Cron Job: Runs every minute to check for due tasks
-> Reminder Window: 30 minutes before due date
-> Smart Tracking: Prevents duplicate reminders

# Email Features
-> Development Mode: Logs emails to console
-> Production Mode: Sends real emails via SendGrid
-> HTML Templates: Beautiful, responsive email design
-> Error Handling: Graceful failure handling

# API Workflow
-> User Registration/Login → Get JWT token
-> Access Protected Routes → Include token in Authorization header
-> Manage Tasks → CRUD operations with user isolation
-> Automated Reminders → System checks for due tasks every minute


# For `Frontend` I used some tech stack that is mentioned below
-> The application will run on: http://localhost:3000 (Development) `npm start`

-> Framework: React 19.2.0
-> Routing: React Router DOM 7.9.4
-> HTTP Client: Axios 1.13.0
-> State Management: React Context API
-> Styling: Pure CSS with modern design principles
-> Build Tool: Create React App 5.0.1

# Project structure for frontend

frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── TaskForm.js & TaskForm.css
│   │   └── TaskList.js & TaskList.css
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   └── Dashboard.js & Dashboard.css
│   ├── services/
│   │   └── api.js
│   ├── utils/
│   │   └── AuthContext.js
│   ├── App.js & App.css
│   └── index.js & index.css
│── package.json
└── package-lock.json

# Component Architecture

# Core Components

* App.js - Root component with routing and authentication provider
    -> Manages application routing
    -> Provides authentication context
    -> Implements protected route logic

* AuthContext.js - Centralized authentication state management
    -> Manages user session state
    -> Handles login/logout operations
    -> Provides authentication methods to entire app

* Dashboard.js - Main task management interface
    -> Displays user tasks
    -> Handles task operations (create, read, update, delete)
    -> Manages task form modals

* TaskForm.js - Reusable form component for task creation/editing
    -> Modal-based form interface
    -> Form validation and state management
    -> Supports both create and edit modes

* TaskList.js - Task display and interaction component
    -> Renders task cards with status indicators
    -> Handles task actions (complete, edit, delete)
    -> Responsive grid layout

# Page Components

* Login.js - User authentication page
    -> Email/password form
    -> Error handling and loading states
    -> Navigation to registration

* Register.js - User registration page
    -> User registration form with validation
    -> Password confirmation
    -> Error handling

# Design Principles
-> Mobile-First: Responsive design that works on all devices
-> Intuitive Interactions: Predictable and user-friendly interface

# Task Management Features

* Task Operations
-> Create: Modal form with title, description, and due date
-> Read: Grid display with status indicators and due dates
-> Update: Inline editing with modal form
-> Delete: Confirmation-less deletion with undo pattern

* Task Status System
-> Completed: Green indicator with strikethrough text
-> Overdue: Red indicator for past due dates
-> Due Soon: Yellow indicator for tasks due within 24 hours
-> Upcoming: Blue indicator for future tasks
-> No Due Date: Gray indicator

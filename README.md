# Task Management API (Node.js + Express + MongoDB)

This is a **Node.js** backend application built using **Express.js** and **MongoDB**. It provides APIs for managing tasks, authentication, and user management.

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js v20** (Download from [nodejs.org](https://nodejs.org/))

## Setup Instructions

Follow these steps to set up and run the project:

### 1️⃣ Clone the repository
   ```bash
   git clone https://github.com/Ravindra-Developer/backend.git
   cd backend
   ```

### 2️⃣ Install dependencies
   ```bash
   npm install
   ```

### 3️⃣ Create an **.env** file in the root directory and configure the following:
   ```
   MONGO_URI=mongodb+srv://developer:qVjz8kJXmEqpFOp1@cluster0.nmj3z.mongodb.net/task_management_app
   JWT_SECRET=TASK_MANAGEMENT_APP
   ```

### 4️⃣ Start the server
   ```bash
   npm start
   ```
   The server will start on **http://localhost:3000**.


## 📌 Additional Notes

- If you face issues with dependencies, try reinstalling:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Make sure **MongoDB is running** before starting the server.
- Use **Postman** or any API testing tool to test the endpoints.

Happy Coding! 🚀
`
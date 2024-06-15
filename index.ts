import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

// Middleware to parse JSON bodies
app.use(express.json());

// Function to create the users table
async function createTable(): Promise<void> {
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );`;

  try {
    await pool.query(createUserTableQuery);
    console.log("Users table created successfully");
  } catch (err) {
    console.error("Error creating users table", err);
  }
}

// Route to create the users table
app.get("/create-users-table", async (req: Request, res: Response) => {
  try {
    await createTable();
    res.send("Users table created successfully");
  } catch (err) {
    console.error("Error creating users table", err);
    res.status(500).send("Something went wrong");
  }
});

// Example route to test the database connection
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err);
    res.status(500).send("Something went wrong");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

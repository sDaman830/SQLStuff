const express = require("express");
const { Pool } = require("pg");

// Create a new Express application
const app = express();

// Set up the PostgreSQL connection pool
const pool = new Pool({
  user: "postgres", // Database username
  host: "localhost", // Database host
  database: "mydatabase", // Database name
  password: "Ghattu12", // Database password
  port: 5432, // Database port
});

// Middleware to parse JSON bodies
app.use(express.json());

// Example route to test the database connection
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).send("Something went wrong");
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

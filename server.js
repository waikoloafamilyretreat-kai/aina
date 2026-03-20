const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

const db = new sqlite3.Database("./contact.db", (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (
    typeof name !== "string" || name.trim().length < 2 ||
    typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof message !== "string" || message.trim().length < 1
  ) {
    return res.status(400).json({
      error: "Please provide valid name, email, and message."
    });
  }

  const sql = `
    INSERT INTO contacts (name, email, message)
    VALUES (?, ?, ?)
  `;

  db.run(sql, [name.trim(), email.trim(), message.trim()], function (err) {
    if (err) {
      console.error("Database insert error:", err.message);
      return res.status(500).json({
        error: "Failed to save message."
      });
    }

    res.status(201).json({
      success: true,
      id: this.lastID,
      message: "Contact message saved successfully."
    });
  });
});

app.get("/api/contact", (req, res) => {
  db.all(
    `SELECT id, name, email, message, created_at FROM contacts ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error("Database read error:", err.message);
        return res.status(500).json({ error: "Failed to fetch messages." });
      }

      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Impordime npm package'id mille algselt installisime
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pkg from "pg";
import jwt from "jsonwebtoken";
import hash from "./hash.js"

// Lae sisse .env failist muutujad
dotenv.config();

// Loome Express backendi rakenduse
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ühendame backendi andmebaasiga
const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// GET endpoint, et kuvada kõiki kasutajaid andmebaasist
app.get("/users", async (req, res) => {
  try {
    // SQL päring andmebaasist 'users' tabelist
    const result = await pool.query("SELECT * FROM users");
    // Tagastame saadud päringu tulemuse JSON formaadis
    res.json(result.rows);
  } catch (err) {
    // Kui tekib viga, kuvame seda konsoolis ja saadame kliendile veateate
    console.error("Error fetching users", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST endpoint, et lisada uus kasutaja
app.post("/users", async (req, res) => {
  // Võtame päringu body'st välja first_name, last_name, email, password väärtused
  // (siin eeldame, et backendiga ühendatud frontend saadab meile /users endpointi korral first_name, last_name, email, password)
  const { first_name, last_name, email, password } = req.body;
  const passwordHash = await hash.hashPassword(password);
  try {
    // SQL päring, mis lisab 'users' tabelisse uue kasutaja
    const result = await pool.query(
      "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, email, passwordHash],
    );
    // Tagastame kliendile päringu tulemuse
    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Kui tekib viga, kuvame seda konsoolis ja saadame kliendile veateate
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const info = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);
    if (info.rows.length === 0) {
      console.log("No user with this email");
    } else {
      const dbPassword = info.rows[0].password;
      const passwordMatch = await hash.comparePassword(password, dbPassword);
      if (passwordMatch) {
        console.log("Passwords match");
        const token = jwt.sign(
          { userId: info.rows[0].userid },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN },
        );
        return res.json({ token });
      } else {
        console.log("Incorrect password");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send("No token");
  }
  const token = header.split(" ")[1];
  if (!token) {
    return res.status(401).send("Malformed token");
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).send("Invalid token");
  }
};

app.get("/protected", auth, async (req, res) => {
  res.set("Cache-Control", "no-store")
  const userId = req.user.userId;
  const data = await pool.query("SELECT first_name, last_name, email FROM users WHERE userid = $1", [userId]);

  if (data.rows.length === 0) return res.status(404).json({ error: "No user found" });
  res.json(data.rows[0]);
});

// Käivitame serveri
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
});

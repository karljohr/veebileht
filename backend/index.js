// Impordime npm package'id mille algselt installisime
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pkg from "pg";

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
        console.error(err);
        res.status(500).send("Server error");
    }
});

// POST endpoint, et lisada uus kasutaja
app.post("/users", async (req, res) => {
    // Võtame päringu body'st välja first_name, last_name, email, password väärtused
    // (siin eeldame, et backendiga ühendatud frontend saadab meile /users endpointi korral first_name, last_name, email, password)
    const { first_name, last_name, email, password } = req.body;
    try {
        // SQL päring, mis lisab 'users' tabelisse uue kasutaja
        const result = await pool.query(
            "INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *",
            [first_name, last_name, email, password]
        );
        // Tagastame kliendile päringu tulemuse
        res.status(201).json(result.rows[0]);
    } catch (err) {
        // Kui tekib viga, kuvame seda konsoolis ja saadame kliendile veateate
        console.error(err);
        res.status(500).send("Server error");
    }
});

// Käivitame serveri
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
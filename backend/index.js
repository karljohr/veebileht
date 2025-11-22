// Impordime npm package'id mille algselt installisime
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pkg from "pg";
import jwt from "jsonwebtoken";
import hash from "./hash.js";
import { v4 as uuidv4 } from "uuid";

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
    res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/protected", auth, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const userId = req.user.userId;
  const data = await pool.query(
    "SELECT first_name, last_name, email FROM users WHERE userid=$1",
    [userId],
  );

  if (data.rows.length === 0)
    return res.status(404).json({ error: "No user found" });
  res.json(data.rows[0]);
});

app.get("/api/user", auth, async (req, res) => {
  res.set("Cache-Control", "no-store");
  const userId = req.user.userId;
  res.json(userId);
});

app.post("/changeData", async (req, res) => {
  try {
    const { firstName, lastName, email, userId } = req.body;
    const dbData = await pool.query(
      "SELECT first_name, last_name, email FROM users WHERE userid=$1",
      [userId],
    );

    const user = dbData.rows[0];

    const firstNameF = firstName === "" ? user.first_name : firstName;
    const lastNameF = lastName === "" ? user.last_name : lastName;
    const emailF = email === "" ? user.email : email;

    const result = await pool.query(
      "UPDATE users SET first_name=$1, last_name=$2, email=$3 WHERE userid=$4",
      [firstNameF, lastNameF, emailF, userId],
    );
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  const TOKEN_EXPIRY_MINUTES = 60; // Token kehtib 60 minutit

  if (!email) {
    return res.status(400).json({ message: "E-posti aadress on nõutav." });
  }

  try {
    const userResult = await pool.query(
      "SELECT userid, email FROM users WHERE email = $1",
      [email],
    );
    const user = userResult.rows[0];

    if (!user) {
      // Turvalisus: Tagastab alati OK, isegi kui kasutajat ei leia (hoiab ära kasutajanimede lekkimise)
      console.log(
        `FORGOT PASSWORD: Kasutajat ${email} ei leitud, aga tagastatakse OK.`,
      );
      // Simuleeritud token arenduseks
      return res.status(200).json({
        message:
          "Kui sellise e-posti aadressiga konto eksisteerib, saadame lingi.",
        token: "simulated-token-" + Math.random().toString(36).substring(2, 10),
      });
    }

    const resetToken = uuidv4();
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MINUTES * 60 * 1000);

    // Salvesta token ja aegumiskuupäev andmebaasi
    await pool.query(
      "UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE userid = $3",
      [resetToken, expiresAt, user.userid],
    );

    // Logib tokeni konsooli
    console.log(
      `FORGOT PASSWORD: Loodud token kasutajale ${user.email}: ${resetToken}`,
    );

    // vastus
    return res.status(200).json({
      message:
        "Token genereeritud ja salvestatud edukalt. Jätka alloleva nupuga.",
      token: resetToken,
    });
  } catch (error) {
    console.error("Error in forgot-password:", error);
    return res.status(500).json({ message: "Serveri viga tokeni loomisel." });
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res
      .status(400)
      .json({ message: "Token ja uus salasõna on nõutavad." });
  }

  try {
    const userResult = await pool.query(
      "SELECT userid, password, reset_password_expires FROM users WHERE reset_password_token = $1",
      [token],
    );
    const user = userResult.rows[0];

    if (!user) {
      return res
        .status(400)
        .json({ message: "Vigane parooli lähtestamise kood." });
    }

    // Kontrolli aegumist
    const now = new Date();
    if (now > user.reset_password_expires) {
      // Kustuta aegunud token andmebasist
      await pool.query(
        "UPDATE users SET reset_password_token = NULL, reset_password_expires = NULL WHERE userid = $1",
        [user.userid],
      );
      return res
        .status(400)
        .json({ message: "Parooli lähtestamise link on aegunud." });
    }

    // Krüpteeri uus parool
    const hashedPassword = await hash.hashPassword(password);

    // Uuenda parool ja kustuta token
    await pool.query(
      "UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE userid = $2",
      [hashedPassword, user.userid],
    );

    console.log(
      `RESET PASSWORD: Kasutaja ${user.userid} parool edukalt muudetud ja token kustutatud.`,
    );
    return res.status(200).json({ message: "Salasõna on edukalt uuendatud." });
  } catch (error) {
    console.error("Error in reset-password:", error);
    return res
      .status(500)
      .json({ message: "Serveri viga salasõna muutmisel." });
  }
});

//
app.get("/api/user-boxes", auth, async (req, res) => {
  const userId = req.user.userId;

  const data = await pool.query(
    "SELECT boxh, boxm, boxe, boxl FROM userinventory WHERE userid = $1",
    [userId],
  );

  res.json(data.rows[0]);
});

app.post("/api/prize", async (req, res) => {
  const id = req.body.boxId;
  if (id === 0) return res.json("error");

  try {
    const prize = await pool.query(
      "SELECT prize FROM prizes WHERE boxtype = $1 ORDER BY RANDOM() LIMIT 1",
      [id],
    );

    if (prize.rows.length <= 0) {
      return res.json({ error: "No prize found" });
    }

    res.json({ prize: prize.rows[0].prize });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/update-inventory", auth, async (req, res) => {
  const userId = req.user.userId;
  let { boxh, boxm, boxe, boxl } = req.body;
  if (!boxh) boxh = 0;
  if (!boxm) boxm = 0;
  if (!boxe) boxe = 0;
  if (!boxl) boxl = 0;

  console.log(boxh, boxm, boxe, boxl);

  try {
    await pool.query(
      "UPDATE userinventory SET boxh=$2, boxm=$3, boxe=$4, boxl=$5 WHERE userid=$1",
      [userId, boxh, boxm, boxe, boxl],
    );
  } catch (error) {
    console.error(error);
  }
});

app.get("/inventories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM userinventory");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
  }
});

// Käivitame serveri.
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", details: err.message });
});

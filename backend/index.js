// Impordime npm package'id mille algselt installisime
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import pkg from "pg";
import jwt from "jsonwebtoken";
import hash from "./hash.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import fs from "fs";

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

// Pildi üles- ja allalaadimiseks vajalikud
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static("uploads"));

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

app.post("/api/profile/password_change", auth, async (req, res) => {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Palun sisesta nii vana kui ka uus salasõna." });
    }

    if (newPassword.length < 6) {
        return res.status(400).json({ error: "Uus salasõna peab olema vähemalt 6 tähemärki pikk." });
    }

    try {
        const userResult = await pool.query(
            "SELECT password FROM users WHERE userid = $1",
            [userId]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: "Kasutajat ei leitud." });
        }

        const storedHash = userResult.rows[0].password;

        const passwordMatch = await hash.comparePassword(oldPassword, storedHash);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Sisestatud vana salasõna on vale." });
        }

        const newHash = await hash.hashPassword(newPassword);

        await pool.query(
            "UPDATE users SET password = $1 WHERE userid = $2",
            [newHash, userId]
        );

        res.status(200).json({ message: "Salasõna edukalt muudetud." });

    } catch (err) {
        console.error("Viga salasõna muutmisel:", err);
        res.status(500).json({ error: "Serveri viga salasõna muutmisel." });
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

app.post("/api/update-inventory", auth, async (req) => {
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

// Avatud saagikastide statistika lisamine.
app.post("/api/lootbox-status", auth, async (req, res) => {
  const userId = req.user.userId;
  try {
    await pool.query(
      "UPDATE userstats SET openedboxes = userstats.openedboxes + 1 WHERE userid = $1",
      [userId],
    );
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
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

// Kasutaja žetoonide hulga näitamine.
app.get("/api/wallet", auth, async (req, res) => {
  const userId = req.user.userId;
  const amount = await pool.query(
    "SELECT balance FROM wallets WHERE userid = $1",
    [userId],
  );
  res.json(amount.rows[0]);
});

// Kasutaja muu statistika näitamine.
app.get("/api/stats", auth, async (req, res) => {
  const userId = req.user.userId;
  const stats = await pool.query(
    "SELECT openedboxes, boughtdayp, spentchips FROM userstats WHERE userid = $1",
    [userId],
  );
  res.json(stats.rows[0]);
});

// Žetoonide lisamine
app.post("/api/wallet/increase", auth, async (req, res) => {
  const userId = req.user.userId;
  const { amount, reason } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE wallets SET balance = balance + $1 WHERE userid = $2",
      [amount, userId],
    );
    await client.query(
      "INSERT INTO transactions(userid, amount, reason) VALUES ($1, $2, $3)",
      [userId, amount, reason],
    );
    await client.query("COMMIT");
    res.status(200).json({ message: "Transaction successful" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ error: "Transaction failed." });
  } finally {
    client.release();
  }
});

// Žetoonide eemaldamine
app.post("/api/wallet/deduct", auth, async (req, res) => {
  const userId = req.user.userId;
  const { amount, reason } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE wallets SET balance = balance - $1 WHERE userid = $2",
      [amount, userId],
    );
    await client.query(
      "INSERT INTO transactions(userid, amount, reason) VALUES ($1, $2, $3)",
      [userId, amount, reason],
    );
    await client.query("COMMIT");
    res.status(200).json({ message: "Transaction successful" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ error: "Transaction failed." });
  } finally {
    client.release();
  }
});

// Saagikastide ostu sooritamine
app.post("/api/lootbox-purchase", auth, async (req, res) => {
  const userId = req.user.userId;
  const { amount, reason } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE wallets SET balance = balance - $1 WHERE userid = $2",
      [amount, userId],
    );
    await client.query(
      "INSERT INTO transactions(userid, amount, reason) VALUES ($1, $2, $3)",
      [userId, amount, reason],
    );
    await client.query(
      "INSERT INTO lootbox_transactions (userid, boxh, boxm, boxe, boxl) VALUES ($1, (SELECT COALESCE(SUM(quantity), 0) FROM cart_items WHERE cartid = (SELECT cartid FROM cart WHERE userid = $1) AND productid = 1), (SELECT COALESCE(SUM(quantity), 0) FROM cart_items WHERE cartid = (SELECT cartid FROM cart WHERE userid = $1) AND productid = 2), (SELECT COALESCE(SUM(quantity), 0) FROM cart_items WHERE cartid = (SELECT cartid FROM cart WHERE userid = $1) AND productid = 3), (SELECT COALESCE(SUM(quantity), 0) FROM cart_items WHERE cartid = (SELECT cartid FROM cart WHERE userid = $1) AND productid = 4))",
      [userId],
    );
    await client.query(
      "UPDATE userinventory u SET boxh = u.boxh + l.boxh, boxm = u.boxm + l.boxm, boxe = u.boxe + l.boxe, boxl = u.boxl + l.boxl FROM lootbox_transactions l WHERE u.userid = $1 AND l.userid = $1",
      [userId],
    );
    await client.query("DELETE FROM lootbox_transactions WHERE userid = $1", [
      userId,
    ]);
    await client.query(
      "UPDATE userstats SET spentchips = userstats.spentchips + $1 WHERE userid = $2",
      [amount, userId],
    );
    await client.query("COMMIT");
    res.status(200).json({ message: "Transaction successful" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ error: "Transaction failed." });
  } finally {
    client.release();
  }
});

// Päevatoote ostu sooritamine
app.post("/api/dayproduct-purchase", auth, async (req, res) => {
  const userId = req.user.userId;
  const { amount, reason } = req.body;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE wallets SET balance = balance - $1 WHERE userid = $2",
      [amount, userId],
    );
    await client.query(
      "INSERT INTO transactions(userid, amount, reason) VALUES ($1, $2, $3)",
      [userId, amount, reason],
    );
    await client.query(
      "UPDATE userinventory SET dailyproduct = (SELECT name FROM dayproduct WHERE activated = true) WHERE userid = $1",
      [userId],
    );
    await client.query(
      "UPDATE dayproduct SET sold = true WHERE activated = true",
    );
    await client.query(
      "UPDATE userstats SET spentchips = userstats.spentchips + $1 WHERE userid = $2",
      [amount, userId],
    );
    await client.query(
      "UPDATE userstats SET boughtdayp = userstats.boughtdayp + 1 WHERE userid = $1",
      [userId],
    );
    await client.query("COMMIT");
    res.status(200).json({ message: "Transaction successful" });
  } catch (e) {
    await client.query("ROLLBACK");
    console.error(e);
    res.status(500).json({ error: "Transaction failed." });
  } finally {
    client.release();
  }
});

app.post("/api/cart/add", auth, async (req, res) => {
  const userId = req.user.userId;
  const { productID, quantity } = req.body;

  if (!productID || !quantity || quantity < 1) {
    return res.status(400).json({ error: "Vigane toote ID või kogus." });
  }

  try {
    // Leia või loo kasutajale aktiivne cartID
    let cartResult = await pool.query(
      "SELECT cartid FROM cart WHERE userid = $1",
      [userId],
    );
    let cartId;

    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        "INSERT INTO cart (userid) VALUES ($1) RETURNING cartid",
        [userId],
      );
      cartId = newCart.rows[0].cartid;
    } else {
      cartId = cartResult.rows[0].cartid;
    }

    // Kontrolli, kas toode juba ostukorvis olemas
    const itemResult = await pool.query(
      "SELECT cartitemid, quantity FROM cart_items WHERE cartid = $1 AND productid = $2",
      [cartId, productID],
    );

    if (itemResult.rows.length > 0) {
      const existingQuantity = itemResult.rows[0].quantity;
      const newQuantity = existingQuantity + quantity;

      await pool.query(
        "UPDATE cart_items SET quantity = $1 WHERE cartitemid = $2",
        [newQuantity, itemResult.rows[0].cartitemid],
      );
    } else {
      await pool.query(
        "INSERT INTO cart_items (cartid, productid, quantity) VALUES ($1, $2, $3)",
        [cartId, productID, quantity],
      );
    }

    const updatedTotal = await pool.query(
      "SELECT SUM(quantity) AS total_items FROM cart_items WHERE cartid = $1",
      [cartId],
    );

    res.status(201).json({
      message: "Toode lisatud/uuendatud ostukorvis.",
      totalItems: parseInt(updatedTotal.rows[0].total_items) || 0,
    });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).send("Server error ostukorvi lisamisel.");
  }
});

app.get("/api/cart", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const cartResult = await pool.query(
      "SELECT cartid FROM cart WHERE userid = $1",
      [userId],
    );

    if (cartResult.rows.length === 0) {
      return res
        .status(200)
        .json({ items: [], totalMinPrice: 0, totalMaxPrice: 0 });
    }

    const cartId = cartResult.rows[0].cartid;

    // Ostukorvi esemete saamine
    const itemsQuery = `
      SELECT 
        ci.cartitemid, ci.productid, ci.quantity, 
        pc.name, pc.min_price, pc.max_price
      FROM cart_items ci 
      JOIN product_catalogue pc ON ci.productid = pc.productid 
      WHERE ci.cartid = $1
      ORDER BY ci.cartitemid ASC;
    `;

    const itemsResult = await pool.query(itemsQuery, [cartId]);
    const items = itemsResult.rows;

    let totalMinPrice = 0;
    let totalMaxPrice = 0;

    items.forEach((item) => {
      totalMinPrice += parseFloat(item.min_price) * item.quantity;
      totalMaxPrice += parseFloat(item.max_price) * item.quantity;
    });

    res.status(200).json({
      items: items,
      totalMinPrice: totalMinPrice.toFixed(2),
      totalMaxPrice: totalMaxPrice.toFixed(2),
    });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).send("Server error ostukorvi laadimisel.");
  }
});

app.get("/admin", auth, async (req, res) => {
  const userId = req.user.userId;
  if (userId === 13) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.get("/api/info", async (req, res) => {
  try {
    const prizes = await pool.query("SELECT boxtype, prize FROM prizes");
    res.json(prizes.rows);
  } catch (error) {
    console.error(error);
  }
});

app.post("/api/add-box", auth, async (req, res) => {
  const userId = req.user.userId;
  const { boxtype, prize } = req.body;
  if (userId === 13) {
    await pool.query("INSERT INTO prizes (boxtype, prize) VALUES ($1, $2)", [
      boxtype,
      prize,
    ]);
    res.status(201).json({ message: "Prize added successfully" });
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
});

app.post("/api/delete-box", auth, async (req, res) => {
  const userId = req.user.userId;
  const { boxtype, prize } = req.body;
  if (userId === 13) {
    await pool.query("DELETE FROM prizes WHERE prize=$1 AND boxtype=$2", [
      prize,
      boxtype,
    ]);
    res.status(201).json({ message: "Prize deleted successfully" });
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
});

app.post("/api/delete-day", auth, async (req, res) => {
  const userId = req.user.userId;
  const id = req.body.id;
  if (userId === 13) {
    const result = await pool.query(
      "SELECT picture FROM dayproduct WHERE id=$1",
      [id],
    );
    const imagePath = result.rows[0].picture;

    await pool.query("DELETE FROM dayproduct WHERE id=$1", [id]);

    console.log(imagePath);
    if (imagePath) {
      fs.unlink(`.${imagePath}`, (err) => {
        if (err) {
          console.error("File delete error:", err);
        }
      });
    }

    res.status(201).json({ message: "Day product deleted successfully" });
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
});

app.get("/api/dayproduct", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM dayproduct WHERE activated=true",
    );
    if (data.rows.length === 0) {
      return res.status(404).json({ message: "No active daily product found" });
    }
    const {
      name,
      description,
      startprice,
      endprice,
      activated,
      picture,
      sold,
    } = data.rows[0];
    const time = new Date();
    const step = Math.floor((startprice - endprice) / 24);
    let price;
    if (time.getHours() < 24) {
      price = startprice - step * time.getHours();
    } else {
      price = endprice;
    }
    res.json({
      name,
      description,
      price,
      startprice,
      endprice,
      activated,
      picture,
      sold,
    });
  } catch (error) {
    console.error(error);
  }
});

app.get("/api/dayproducts", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM dayproduct");
    console.log(data.rows);
    res.json(data.rows);
  } catch (error) {
    console.error(error);
  }
});

app.delete("/api/cart/clear", auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const cartResult = await pool.query(
      "SELECT cartid FROM cart WHERE userid = $1",
      [userId],
    );
    if (cartResult.rows.length === 0) {
      return res
        .status(200)
        .json({ message: "Ostukorvi ei leitud/on juba tühi." });
    }
    const cartId = cartResult.rows[0].cartid;

    await pool.query("DELETE FROM cart_items WHERE cartid = $1", [cartId]);
    await pool.query("DELETE FROM cart WHERE cartid = $1", [cartId]);

    res.status(200).json({ message: "Ostukorv tühjendatud edukalt." });
  } catch (err) {
    console.error("Viga ostukorvi tühjendamisel:", err);
    res.status(500).json({ error: "Server error ostukorvi tühjendamisel." });
  }
});

app.post("/api/cart/add_one", auth, async (req, res) => {
  const userId = req.user.userId;
  const { cartItemId } = req.body;

  try {
    const cartResult = await pool.query(
      "SELECT cartid FROM cart WHERE userid = $1",
      [userId],
    );
    if (cartResult.rows.length === 0) {
      return res.status(404).json({ message: "Ostukorvi ei leitud." });
    }
    const cartId = cartResult.rows[0].cartid;

    const updateResult = await pool.query(
      "UPDATE cart_items SET quantity = quantity + 1 WHERE cartitemid = $1 AND cartid = $2 RETURNING quantity",
      [cartItemId, cartId],
    );

    if (updateResult.rows.length === 0) {
      return res.status(404).json({ message: "Eset ei leitud ostukorvist." });
    }

    return res.status(200).json({
      message: "Kogust suurendati.",
      newQuantity: updateResult.rows[0].quantity,
    });
  } catch (err) {
    console.error("Viga eseme koguse suurendamisel:", err);
    res.status(500).json({ error: "Server error eseme koguse suurendamisel." });
  }
});

app.post("/api/cart/remove", auth, async (req, res) => {
  const userId = req.user.userId;
  const { cartItemId } = req.body;

  if (!cartItemId) {
    return res.status(400).json({ error: "Ese ID (cartItemId) on nõutav." });
  }

  try {
    const itemResult = await pool.query(
      `SELECT ci.quantity, ci.cartid 
       FROM cart_items ci
       JOIN cart c ON ci.cartid = c.cartid
       WHERE ci.cartitemid = $1 AND c.userid = $2`,
      [cartItemId, userId],
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({
        message: "Eset ei leitud ostukorvist või see ei kuulu sinule.",
      });
    }

    const currentQuantity = itemResult.rows[0].quantity;

    if (currentQuantity > 1) {
      await pool.query(
        "UPDATE cart_items SET quantity = quantity - 1 WHERE cartitemid = $1",
        [cartItemId],
      );
      return res.status(200).json({ message: "Eseme kogust vähendati." });
    } else {
      await pool.query("DELETE FROM cart_items WHERE cartitemid = $1", [
        cartItemId,
      ]);
      return res.status(200).json({ message: "Ese eemaldati ostukorvist." });
    }
  } catch (err) {
    console.error("Viga eseme eemaldamisel/vähendamisel:", err);
    res
      .status(500)
      .json({ error: "Server error eseme eemaldamisel/vähendamisel." });
  }
});

app.post("/api/add-day", auth, async (req, res) => {
  const userId = req.user.userId;
  const { name, description, startPrice, endPrice, picture } = req.body;
  console.log(name, description, startPrice, endPrice, picture);
  if (userId === 13) {
    try {
      await pool.query(
        "INSERT INTO dayproduct (name, description, startprice, endprice, picture) VALUES ($1, $2, $3, $4, $5)",
        [name, description, startPrice, endPrice, picture],
      );
      console.log("Successfully added a new dayproduct");
      res.status(201).json({ message: "Prize added successfully" });
    } catch (error) {
      console.log(error);
    }
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
});

app.post("/api/activateDay", auth, async (req, res) => {
  const userId = req.user.userId;
  if (userId !== 13) return console.log("Unauthorized");

  try {
    const id = req.body.id;
    await pool.query("UPDATE dayproduct SET activated = (id = $1)", [id]);
    console.log("Successfully activated a new dayproduct");
  } catch (error) {
    console.log("Error:", error);
  }
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  } else {
    res.json({ filePath: `/uploads/${req.file.filename}` });
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

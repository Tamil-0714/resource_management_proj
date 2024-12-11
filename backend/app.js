const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { ensureAuthenticated, ensureAdminAuthenticated } = require("./middleware/middleware");
const loginRoute = require("./routes/loginRoute");
const logoutRoute = require("./routes/logoutRoute");
const profileRoute = require("./routes/profileRoute");
const { fetchReqInfo, addNewStd } = require("./DB/db");
const bcrypt = require("bcrypt");

const app = express();
const port = 8050;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your origin as needed
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Configuration
app.use(
  session({
    secret: "iam_iron_man",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 86400000 },
  })
);

// Login Route
app.post("/login", loginRoute);

// Profile Route (Protected)
app.get("/profile", ensureAuthenticated, profileRoute);

// this route need to secure
app.post("/stdReqInfo", ensureAdminAuthenticated, async (req, res) => {
  const { stdId } = req.body;
  const rows = await fetchReqInfo(stdId);

  res.status(200).json({ reqInfo: rows });
});
// this route need to secure
app.post("/newStd", ensureAdminAuthenticated, async (req, res) => {
  const { stdName, stdId, stdPass } = req.body;
  if (stdName && stdId && stdPass) {
    bcrypt.hash(stdPass, 10, async (err, hash) => {
      if (err) {
        console.error("error in hashing");
        return res.status(500).send("internal server error ");
      }
      const rows = await addNewStd(stdName, stdId, hash);
      if (rows?.affectedRows === 1) {
        res.status(200).json({ message: "success" });
      } else {
        res.status(300).json({ message: "id is already exist" });
      }
    });
  } else {
    res.status(300).json({ message: "invalid data" });
  }
});

// Logout Route
app.post("/logout", logoutRoute);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});

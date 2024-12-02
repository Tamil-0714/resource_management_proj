const express = require("express");
const cors = require("cors");
const session = require("express-session");
const { ensureAuthenticated } = require("./middleware/middleware");
const loginRoute = require("./routes/loginRoute");
const logoutRoute = require("./routes/logoutRoute");
const profileRoute = require("./routes/profileRoute");

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
    cookie: { secure: false, httpOnly: true, maxAge: 60000 },
  })
);

// Login Route
app.post("/login", loginRoute);

// Profile Route (Protected)
app.get("/profile", ensureAuthenticated, profileRoute);

// Logout Route
app.post("/logout", logoutRoute);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});

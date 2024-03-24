const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
require("dotenv/config");
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors(
  {
    origin: process.env.ORIGIN,
    credentials: true,
    exposedHeaders:'Authorization'
  }
));
app.use(express.json());
app.use(
  cookieSession({
    name: "conetese-session",
    keys: [process.env.COOKIE_SECRET],
    httpOnly: true,
  })
);
app.use(express.static("public"));

const db = require("./app/models");
const { initializeDatabase } = require("./app/models/initialDatabase");

const PORT = process.env.PORT || 3000;

// Rotas
app.get("/", (req, res) => {
  res.json({ message: "Welcome to cariri application." });
});
require("./app/routes/auth.routes")(app);

// Sincronize o banco de dados após registrar as rotas
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");
  initializeDatabase();

  // Inicie o servidor após sincronizar o banco de dados
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
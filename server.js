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
    name: "cavalo-session",
    keys: [process.env.COOKIE_SECRET],
    httpOnly: true,
  })
);
app.use(express.static("public"));

// Database e sincronização
const db = require("./app/models");

const PORT = process.env.PORT || 3000;

// Rotas
app.get("/", (req, res) => {
  res.json({ message: "Welcome to cavalo application." });
});

// Registre suas rotas antes de sincronizar o banco de dados para evitar erros de rota
require("./app/routes/auth.routes")(app);

// Sincronize o banco de dados após registrar as rotas
db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and Resync Db");

  // Inicie o servidor após sincronizar o banco de dados
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
});
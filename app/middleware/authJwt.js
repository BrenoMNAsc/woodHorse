const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Professional = db.professional;
const Companies = db.companies;

const authenticate = (req, res, next) => {
  const accessToken = req.headers['Authorization'];
  accessToken ? accessToken = accessToken.split(' ')[1] : accessToken
  const refreshToken = req.cookies['refreshToken'];
  console.log(`\n\n\n${refreshToken}\n\n\n`)

  if (!accessToken && !refreshToken) {
    return res.status(401).send('Acesso negado! Token não detectado.');
  }

  try {
    const decoded = jwt.verify(accessToken, config.secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).send('Acesso negado! Token de recarga não detectado.');
    }

    try {
      const decoded = jwt.verify(refreshToken, config.secret);
      const accessToken = jwt.sign(
        { id: decoded.id },
        config.secret,
        {
          algorithm: 'HS256',
          allowInsecureKeySizes: true,
          expiresIn: '1d',
        });
      res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .header('Authorization', accessToken);
      next()
    } catch (error) {
      console.log(`\n${error}\n`)
      return res.status(405).send('Token de recarga inválido.');
    }
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const [companies, professional] = await Promise.all([
      Companies.findByPk(req.userId),
      Professional.findByPk(req.userId),
    ]);
    const user = companies || professional;
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require admin role.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate user role.",
    });
  }
};

const isModerator = async (req, res, next) => {
  try {
    const [companies, professional] = await Promise.all([
      Companies.findByPk(req.userId),
      Professional.findByPk(req.userId),
    ]);
    const user = companies || professional;
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require moderator role.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate moderator role.",
    });
  }
};

const isModeratorOrAdmin = async (req, res, next) => {
  try {
    const [companies, professional] = await Promise.all([
      Companies.findByPk(req.userId),
      Professional.findByPk(req.userId),
    ]);
    const user = companies || professional;
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      if (roles[i].name === "moderator" || roles[i].name === "admin") {
        return next();
      }
    }

    return res.status(403).send({
      message: "Require moderator or admin role.",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Unable to validate moderator or admin role.",
    });
  }
};

const authJwt = {
  authenticate,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
};

module.exports = authJwt;

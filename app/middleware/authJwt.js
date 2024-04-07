const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

const authenticate = (req, res, next) => {
  const accessToken = req.headers['Authorization'];
  accessToken ? accessToken = accessToken.split(' ')[1] : accessToken
  const refreshToken = req.cookies['refreshToken'];

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
      return res.status(405).send('Token de recarga inválido.');
    }
  }
};

const authJwt = {
  authenticate,
};

module.exports = authJwt;

const { verifySignUp, upload, cmpUpload } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup/professional",
    [
      upload,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signupProfessional
  );

  app.post(
    "/api/auth/signup/company",
    [
      cmpUpload,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signupCompany
  );

  app.post("/api/auth/signin/", controller.signin);
};

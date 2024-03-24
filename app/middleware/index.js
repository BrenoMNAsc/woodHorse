const authJwt = require("./authJwt");
const verifySignUp = require("./verifySignUp");
const verifySubmitPost = require("./verifySubmitPost")
const verifyTypeOfUser = require("./verifyTypeOfUser")
const reciver = require('./reciver')
const upload = reciver.upload;
const cmpUpload = reciver.cmpUpload;

module.exports = {
  authJwt,
  verifySignUp,
  verifySubmitPost,
  verifyTypeOfUser,
  upload,
  cmpUpload
};
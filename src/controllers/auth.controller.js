const auth = require("../repository/auth.repo.js");
const bcrypt = require("bcrypt");

const { UserEntity } = require("../models/auth.model.js");

function signUp(req, res) {
  console.log("Auth Controller Launched 😎");

  const saltRounds = 10;
  const { nama, username, password, userAgent } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const userModel = new UserEntity(nama, username, hash, "Agent/Develop");

  auth.signUp(userModel, function (err, result) {
    if (err) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    } else {
      return res.status(201).json({
        message: "Successfully Register",
      });
    }
  });
}

module.exports = { signUp };

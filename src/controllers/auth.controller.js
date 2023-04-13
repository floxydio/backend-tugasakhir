const auth = require("../repository/auth.repo.js");
const bcrypt = require("bcrypt");

const { UserEntity } = require("../models/auth.model.js");

function signIn(req, res) {
  console.log("Auth Controller Launched 😎");
  const { username, password } = req.body;
  auth.signIn(username, function (err, result) {
    if (err) {
      return res.status(400).json({
        message: "Something Went Wrong",
      });
    } else {
      if (result.length > 0) {
        const hash = result[0].password;
        const compare = bcrypt.compareSync(password, hash);
        if (compare) {
          return res.status(200).json({
            statusLogin: "LOGIN",
            message: "Successfully Login",
          });
        } else {
          return res.status(400).json({
            message: "Username or Password Incorrect",
          });
        }
      }
    }
  });
}

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

module.exports = { signUp, signIn };

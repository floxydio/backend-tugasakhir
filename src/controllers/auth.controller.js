const auth = require("../repository/auth.repo.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function signIn(req, res) {
  const { username, password } = req.body;
  auth.signIn(username, function (err, result) {
    if (err) {
      return res.status(400).json({
        message: "Something Went Wrong",
        err: err,
      });
    } else {
      if (result.length > 0) {
        const hash = result[0].password;
        const compare = bcrypt.compareSync(password, hash);
        if (compare) {
          var token = jwt.sign(
            {
              exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
              data: {
                id: result[0].id,
                nama: result[0].nama,
                role: result[0].status_role,
                kelas_id: result[0].kelas_id,
              },
            },
            "dev_token"
          );
          // let userAgent = window.navigator.userAgent;
          auth.updateUserAgent(
            req.headers["user-agent"],
            result[0].username,
            function (err, result) {}
          );
          return res.status(200).json({
            status: 200,
            accessToken: token,
            message: "Successfully Login",
          });
        } else {
          return res.status(400).json({
            message: "Username or Password Incorrect",
          });
        }
      } else {
        return res.status(400).json({
          message: "Username Not Found",
        });
      }
    }
  });
}

function editProfile(req, res) {
  const saltRounds = 10;
  const { nama, password, notelp } = req.body;
  const { id } = req.params;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  auth.editProfile(id, nama, hash, notelp, function (err, result) {
    if (err) {
      return res.status(400).json({
        message: "Something went wrong",
      });
    } else {
      return res.status(201).json({
        message: "Successfully Update User",
      });
    }
  });
}

function signUp(req, res) {
  const saltRounds = 10;
  const { nama, username, password,statususer, userAgent, kelasid } = req.body;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  auth.signUp(nama, username, hash,statususer, userAgent,kelasid, function (err, result) {
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

function getDataUser(req, res) {
  auth.getUser(function (err, result) {
    if (err) {
      return res.status(400).json({
        err: err,
        message: "Something went wrong",
      });
    } else {
      return res.status(200).json({
        data: result,
        message: "Successfully GET User",
      });
    }
  });
}

function getDataJWT(req, res) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      message: "Token Not Found",
    });
  } else {
    jwt.verify(token, "dev_token", function (err, decoded) {
      if (err) {
        return res.status(401).json({
          message: "Token Invalid",
        });
      } else {
        return res.status(200).json({
          status: 200,
          data: decoded.data,
        });
      }
    });
  }
}

function getUserByMurid(req, res) {
  auth.getSiswaByRole(function(err,result) {
    if (err) {
      return res.status(400).json({
        err: err,
        message: "Something went wrong",
      });
    } else {
      return res.status(200).json({
        data: result,
        message: "Successfully GET User",
      });
    }
  })
}

module.exports = { signUp, signIn, getDataJWT, getDataUser, editProfile, getUserByMurid };

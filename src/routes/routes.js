const {
  findAllGuru,
  createGuru,
} = require("../controllers/teacher.controller.js");
const { signUp } = require("../controllers/auth.controller.js");

function Routes(app) {
  app.get("/", function (req, res) {
    res.send("Test");
  });

  app.post("/v1/sign-up", signUp);

  app.get("/v1/guru", findAllGuru);
  app.post("/v1/guru", createGuru);
}

module.exports = { Routes };

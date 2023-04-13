const {
  findAllGuru,
  createGuru,
} = require("../controllers/teacher.controller.js");
const { signUp, signIn } = require("../controllers/auth.controller.js");
const { createTest, getData } = require("../controllers/test.controller");

function Routes(app) {
  app.get("/", function (req, res) {
    res.send("Test");
  });

  app.post("/v1/sign-up", signUp);
  app.post("/v1/sign-in", signIn);

  app.get("/v1/guru", findAllGuru);
  app.post("/v1/guru", createGuru);
  // Endpoint
  app.post("/v1/test", createTest);
  app.get("/v1/test", getData);
}

module.exports = { Routes };

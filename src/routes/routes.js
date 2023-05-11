const {
  findAllGuru,
  createGuru,
} = require("../controllers/teacher.controller.js");
const {
  signUp,
  signIn,
  getDataJWT,
} = require("../controllers/auth.controller.js");
const { sendAbsence } = require("../controllers/absen.controller.js");
const { getFindData } = require("../controllers/pelajaran.controller.js");

function Routes(app) {
  app.get("/", function (req, res) {
    res.send("Api Running  🚀\n\n\nAsk Dio if have question");
  });

  app.post("/v1/sign-up", signUp);
  app.post("/v1/sign-in", signIn);
  app.get("/v1/refresh-token", getDataJWT);

  app.get("/v1/guru", findAllGuru);
  app.post("/v1/guru", createGuru);

  app.post("/v1/absen", sendAbsence);

  app.get("/v1/pelajaran/:id/:kelas", getFindData);
  // Endpoint
}

module.exports = { Routes };

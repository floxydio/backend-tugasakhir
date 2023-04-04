const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { Routes } = require("./src/routes/routes");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

Routes(app);

app.listen(port, () => {
  console.log(`🚀 Server Running on 'http://localhost:${port}'`);
});

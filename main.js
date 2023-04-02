const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const { Routes } = require("./src/routes/routes");
const model = require("./src/models/teacher.model");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// const teacher = new model.TeacherEntity(1, "Dio", 42, "Inggris", 1, 4);
// console.log(teacher).;
Routes(app);

app.listen(port, () => {
  console.log(`🚀 Server Running on 'http://localhost:${port}'`);
});

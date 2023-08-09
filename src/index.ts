// const bodyParser = require("body-parser");
// const express = require("express");
// const cors = require("cors");
// const app = express();
// const port = 3000;
// const { Routes } = require("./src/routes/routes");
import express, { Express } from 'express';
import Routes from './routes/routes';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from "cors";
import helmet from "helmet"
import compression from "compression"

export const app: Express = express()

dotenv.config()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet())
app.use(compression())


Routes(app);

app.listen(process.env.PORT, () => {
  console.log(`Server Running`);
});

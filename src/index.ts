import express, { Express } from 'express';
import Routes from './routes/routes';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from "cors";
import helmet from "helmet"
import compression from "compression"
import { rateLimit } from "express-rate-limit"
import { PrismaClient } from '@prisma/client';


export const app: Express = express()

dotenv.config()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  legacyHeaders: false
})
const prisma = new PrismaClient()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet())
app.use(compression())
app.use(limiter)


Routes(app);

app.listen(process.env.NODE_ENV === "development" ? process.env.PORT : process.env.PORT_NEW, () => {
  prisma.$connect().then(() => {
    console.log("Database Connected");
  }).catch((err) => {
    console.log("Database Connection Failed");
    console.log(err);
  })
  console.log(`Server Running on -> ${process.env.NODE_ENV === "development" ? process.env.PORT : process.env.PORT_NEW} || ${process.env.NODE_ENV === "development" ? "Development" : "Production"} Mode`);
});

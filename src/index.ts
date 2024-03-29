import express, { Express } from 'express';
import Routes from './routes/routes';
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import cors from "cors";
import helmet from "helmet"
import compression from "compression"
import { rateLimit } from "express-rate-limit"
import { PrismaClient } from '@prisma/client';
const expressJSDocSwagger = require('express-jsdoc-swagger');


export const app: Express = express()
const options = {
  info: {
    version: '2.0.0',
    title: 'INISS Api Documentation',
    description: 'INISS Api Typescript',
    license: {
      name: 'MIT',
    },
  },
  security: {
    BasicAuth: {
      type: 'http',
      scheme: 'basic',
    },
  },
  baseDir: __dirname,
  filesPattern: './controllers/*.ts',
  swaggerUIPath: '/api-docs',
  exposeSwaggerUI: true,
  exposeApiDocs: false,
  apiDocsPath: '/v3/api-docs',
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
  multiple: true,
};
dotenv.config()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  legacyHeaders: false
})
const prisma = new PrismaClient()


app.use(bodyParser.urlencoded({ extended: true, limit: '50mb', parameterLimit: 50000 }));
app.use(cors());
app.use(helmet(
  {
    hidePoweredBy: true
  }
))
app.use(compression())
// app.use(limiter)


Routes(app);
expressJSDocSwagger(app)(options);


app.listen(process.env.NODE_ENV === "development" ? process.env.PORT : process.env.PORT_NEW, () => {
  prisma.$connect().then(() => {

    console.log(`
    _____ _   _ _____  _____ _____            _____ _____ 
 |_   _| \ | |_   _|/ ____/ ____|     /\   |  __ \_   _|
   | | |  \| | | | | (___| (___      /  \  | |__) || |  
   | | | . | | | |  \___ \\___ \    / /\ \ |  ___/ | |  
  _| |_| |\  |_| |_ ____) |___) |  / ____ \| |    _| |_ 
 |_____|_| \_|_____|_____/_____/  /_/    \_\_|   |_____|
 
  => Database Connected
  => Server Running on :${process.env.NODE_ENV === "development" ? process.env.PORT : process.env.PORT_NEW} || ${process.env.NODE_ENV === "development" ? "Development" : "Production"} Mode
  => Version Status :${process.env.VERSION_CURRENT}
  => Happy Code :)
    `)
  }).catch((err) => {
    console.log("Database Connection Failed :(");
    process.exit(1)
  })
});

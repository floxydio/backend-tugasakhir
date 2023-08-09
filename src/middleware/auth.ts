import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

export class middlewareAuth {
  public authenticatetoken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.header("x-access-token");
    const token = authHeader && authHeader?.split(' ')[1];

    if (token == null) {
      return res.status(401).json({
        message: 'Token Not Found',
      });
    }
    jwt.verify(token, `${process.env.JWT_TOKEN_SECRET}`, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: 'User Unauthorized',
        });
      }
    });

    next();
  }


}

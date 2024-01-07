import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()
export class middlewareAuth {
  /**
   * Middleware function to authenticate a token.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function to call.
   */
  public authenticatetoken(req: Request, res: Response, next: NextFunction) {
    const token = req.header("x-access-token");
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
      } else {

        next();
      }
    });
  }
}

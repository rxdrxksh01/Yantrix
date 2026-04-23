import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../../shared/error/AppError.js';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import {config} from '../../config/env.config.js';
import { UserRepository } from '../../infrastructure/repositories/User.repository.js';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      // console.log(req.cookies);
    if (!token) {
      throw new AppError("Invalid credentials", 401);
    }
    
    const decodedToken = jwt.verify(token, config.jwt.secret) as JwtPayload;

    const userRepository = new UserRepository();
    const user = await userRepository.findById(decodedToken.user_id);
    // console.log("Decoded token:", decodedToken);
    // console.log("Authenticated user:", user);

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    req.user = user;

    next();
  } catch (error) {
    throw new AppError("Invalid Access Token", 401);
  }
}
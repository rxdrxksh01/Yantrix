import type { Request, Response, NextFunction } from "express";
import { UserService } from "../../application/services/User.service.js";
import type { UpdateUserDto } from "../../application/dtos/User.dto.js";
import { AppError } from "../../shared/error/AppError.js";
import { AppResponse } from "../../shared/response/AppResponse.js";

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { first_name, last_name, email, phone_number, address } = req.body;

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("Invalid email format");
    } else if (phone_number && !/^\d{10}$/.test(phone_number)) {
      throw new AppError("Phone number must be 10 digits");
    } else if (
      first_name &&
      (!first_name.trim().length || first_name.trim().length < 3 || first_name.trim().length > 50)
    ) {
      throw new AppError(
        "First name must be between 3 and 50 characters",
      );
    }

    const updateUserDto: Omit<UpdateUserDto, "password" | "govt_id" | "refreshToken"> = {
      first_name,
      last_name,
      email,
      phone_number,
      address
    }

    try {
      const user = req.user;
      if (!user) {
        throw new AppError("Unauthorized", 401);
      }
      const updatedUser = await this.userService.updateProfile(user, updateUserDto);
      res
        .status(200)
        .json(new AppResponse(200, updatedUser, "Profile updated successfully"));
    } catch (error) {
      next(error);
    }
  }

  // uploadGovtId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  //   const govt_id = req.file as Express.Multer.File;

  //   if (!govt_id) {
  //     throw new AppError("Government ID is required");
  //   }

  //   try {
  //     const user = req.user;
  //     if (!user) {
  //       throw new AppError("Unauthorized", 401);
  //     }
  //     const updatedUser = await this.userService.updateGovtId(user, govt_id);
  //     res
  //       .status(200)
  //       .json(new AppResponse(200, updatedUser, "Government ID updated successfully"));
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
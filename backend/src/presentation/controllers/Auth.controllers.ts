import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/services/Auth.service.js";
import type {
  RegisterUserDto,
  UpdateUserDto,
} from "../../application/dtos/User.dto.js";
import { AppError } from "../../shared/error/AppError.js";
import { AppResponse } from "../../shared/response/AppResponse.js";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { first_name, last_name, email, phone_number, address, password } =
      req.body;
    const govt_id = req.file as Express.Multer.File;
    // console.log("Received registration data");
    if (!email && !phone_number) {
      throw new AppError("Either email or phone number must be provided");
    } else if (!govt_id) {
      throw new AppError("Government ID is required");
    } else if (!password || password.length < 6) {
      throw new AppError("Password must be at least 6 characters long");
    } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("Invalid email format");
    } else if (phone_number && !/^\d{10}$/.test(phone_number)) {
      throw new AppError("Phone number must be 10 digits");
    } else if (
      !first_name ||
      !first_name.trim().length ||
      first_name.trim().length < 3 ||
      first_name.trim().length > 50
    ) {
      throw new AppError(
        "First name is required and must be between 3 and 50 characters",
      );
    }

    const registerUserDto: RegisterUserDto = {
      first_name,
      last_name,
      email,
      phone_number,
      address,
      // govt_id,
      password,
    };

    try {
      const result = await this.authService.register(registerUserDto);

      res
        .status(201)
        .cookie("accessToken", result.tokens.accessToken, { httpOnly: true })
        .cookie("refreshToken", result.tokens.refreshToken, { httpOnly: true })
        .json(
          new AppResponse(201, result.user, "User registered successfully"),
        );
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { email, phoneNumber, password } = req.body;

    if (!email?.trim() && !phoneNumber?.trim()) {
      throw new AppError("Either email or phone number must be provided");
    } else if (!password || password?.trim().length < 6) {
      throw new AppError("Password must be at least 6 characters long");
    }

    const loginUserDto = {
      email,
      phoneNumber,
      password,
    };

    try {
      const result = await this.authService.login(loginUserDto);

      res
        .status(200)
        .cookie("accessToken", result.tokens.accessToken, { httpOnly: true })
        .cookie("refreshToken", result.tokens.refreshToken, { httpOnly: true })
        .json(new AppResponse(200, result.user, "User logged in successfully"));
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new AppError("Unauthorized", 401);
      }
      await this.authService.logout(user);
      res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new AppResponse(200, null, "User logged out successfully"));
    } catch (error) {
      next(error);
    }
  };

  getMe = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = req.user;
      if (!user) {
        throw new AppError("Unauthorized", 401);
      }
      res
        .status(200)
        .json(new AppResponse(200, user, "User data retrieved successfully"));
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || currentPassword.trim().length < 6) {
      throw new AppError("Current password must be at least 6 characters long");
    } else if (!newPassword || newPassword.trim().length < 6) {
      throw new AppError("New password must be at least 6 characters long");
    } else if (currentPassword === newPassword) {
      throw new AppError(
        "New password must be different from current password",
      );
    }

    try {
      const user = req.user;
      // console.log("Authenticated user for password change:", user);
      if (!user) {
        throw new AppError("Unauthorized", 401);
      }
      await this.authService.changePassword(user, currentPassword, newPassword);
      res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
          new AppResponse(
            200,
            null,
            "Password changed successfully, Please Login again",
          ),
        );
    } catch (error) {
      next(error);
    }
  };

  // refreshTokens = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<void> => {
  //   const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

  //   if (!incomingToken) {
  //     throw new AppError("Unauthorized Request.", 401);
  //   }

  //   try {
  //     const result = await this.authService.refreshTokens(incomingToken);

  //     res
  //     .status(200)
  //     .cookie("accessToken", result.tokens.accessToken, { httpOnly: true })
  //     .cookie("refreshToken", result.tokens.refreshToken, { httpOnly: true })
  //     .json(
  //       new AppResponse(
  //         200,
  //         {
  //           user: result.user
  //         },
  //         "Tokens Refreshed Successfully"
  //       )
  //     )
  //   } catch (error) {
  //     next(error)
  //   }
  // };
}

import type { UpdateUserDto } from "../dtos/User.dto.js";
import type { IUserRepository } from "../../core/interfaces/IUserRepository.js";
import { RepositoryFactory } from "../../infrastructure/factories/Repository.factory.js";
import type { UserEntity } from "../../core/entities/User.entity.js";

export class UserService {
  private userRepository: IUserRepository;

  constructor() {
    this.userRepository =
      RepositoryFactory.getUserRepository() as IUserRepository;
  }

  async updateProfile(
    user: UserEntity,
    updateUserDto: Omit<UpdateUserDto, "password" | "refreshToken">,
  ): Promise<UserEntity | null> {
    const updatedUser = await this.userRepository.update(
      String(user.user_id),
      updateUserDto,
    );

    return updatedUser;
  }
}
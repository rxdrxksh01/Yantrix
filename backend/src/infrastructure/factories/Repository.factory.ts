import type { IUserRepository } from "../../core/interfaces/IUserRepository.js";
import { UserRepository } from "../repositories/User.repository.js";

export class RepositoryFactory {
    private static userRepository: IUserRepository;

    static getUserRepository(): IUserRepository {
    if (!this.userRepository) {
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }
}
import type { IUserRepository } from "../../core/interfaces/IUserRepository.js";
import DatabaseClient from "../database/prisma.client.js";
import { UserEntity } from "../../core/entities/User.entity.js";
import type { UserRole } from "../../core/entities/User.entity.js";
import type {
  RegisterUserDto,
  UpdateUserDto,
} from "../../application/dtos/User.dto.js";
import { Role } from "@prisma/client";

export class UserRepository implements IUserRepository {
  private prisma = DatabaseClient.getInstance();

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: id,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.user_id,
      user.first_name,
      user.last_name ?? undefined,
      user.email ?? undefined,
      user.phone_number ?? undefined,
      user.address ?? undefined,
      user.createdAt,
      user.updatedAt,
    );
  }

  async delete(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.delete({
      where: {
        user_id: id,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.user_id,
      user.first_name,
      user.last_name ?? undefined,
      user.email ?? undefined,
      user.phone_number ?? undefined,
      user.address ?? undefined,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();

    return users.map(
      (user) =>
        new UserEntity(
          user.user_id,
          user.first_name,
          user.last_name ?? undefined,
          user.email ?? undefined,
          user.phone_number ?? undefined,
          user.address ?? undefined,
          user.createdAt,
          user.updatedAt,
        ),
    );
  }

  async createUser(
    data: RegisterUserDto & { refreshToken: string },
  ): Promise<UserEntity | null> {
    const newUser = await this.prisma.user.create({
      data: {
        user_id: crypto.randomUUID(),
        first_name: data.first_name,
        last_name: data.last_name ?? null,
        email: data.email ?? null,
        password: data.password,
        phone_number: data.phone_number ?? null,
        address: data.address ?? null,
        refreshToken: data.refreshToken,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    await this.assignRole(newUser.user_id, Role.CUSTOMER);

    return new UserEntity(
      newUser.user_id,
      newUser.first_name,
      newUser.last_name ?? undefined,
      newUser.email ?? undefined,
      newUser.phone_number ?? undefined,
      newUser.address ?? undefined,
      newUser.createdAt,
      newUser.updatedAt,
    );
  }

  async update(id: string, data: UpdateUserDto): Promise<UserEntity | null> {
    const user = await this.prisma.user.update({
      where: {
        user_id: id,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.user_id,
      user.first_name,
      user.last_name ?? undefined,
      user.email ?? undefined,
      user.phone_number ?? undefined,
      user.address ?? undefined,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.user_id,
      user.first_name,
      user.last_name ?? undefined,
      user.email ?? undefined,
      user.phone_number ?? undefined,
      user.address ?? undefined,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findByPhone(phoneNumber: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone_number: phoneNumber,
      },
    });

    if (!user) return null;

    return new UserEntity(
      user.user_id,
      user.first_name,
      user.last_name ?? undefined,
      user.email ?? undefined,
      user.phone_number ?? undefined,
      user.address ?? undefined,
      user.createdAt,
      user.updatedAt,
    );
  }

  async findAuthByEmail(
    email: string,
  ): Promise<{ user: UserEntity; hashedPassword: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return null;

    return {
      user: new UserEntity(
        user.user_id,
        user.first_name,
        user.last_name ?? undefined,
        user.email ?? undefined,
        user.phone_number ?? undefined,
        user.address ?? undefined,
        user.createdAt,
        user.updatedAt,
      ),
      hashedPassword: user.password,
    };
  }

  async findAuthByPhone(
    phoneNumber: string,
  ): Promise<{ user: UserEntity; hashedPassword: string } | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone_number: phoneNumber,
      },
    });

    if (!user) return null;

    return {
      user: new UserEntity(
        user.user_id,
        user.first_name,
        user.last_name ?? undefined,
        user.email ?? undefined,
        user.phone_number ?? undefined,
        user.address ?? undefined,
        user.createdAt,
        user.updatedAt,
      ),
      hashedPassword: user.password,
    };
  }

  async getRefreshTokenById(id: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        user_id: id,
      },
      select: {
        refreshToken: true,
      },
    });

    return user?.refreshToken ?? null;
  }

  async assignRole(user_id: string, role: Role): Promise<UserRole | null> {
    const userRole = await this.prisma.userRole.create({
      data: {
        user_id,
        role,
      },
    });

    return {
      user_id: userRole.user_id,
      role: userRole.role,
    };
  }
}
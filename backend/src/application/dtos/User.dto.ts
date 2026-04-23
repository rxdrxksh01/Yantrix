export interface RegisterUserDto {
  first_name: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  password: string;
}

export interface LoginUserDto {
  email?: string;
  phone_number?: string;
  password: string;
}

export interface UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  password?: string;
  refreshToken?: string;
}
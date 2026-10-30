export interface UserDto {
  id: number;
  username: string;
  fullName: string;
  email: string;
  nip?: string;
  telepon?: string;
  roleId: number;
  roleCode: string;
  roleName: string;
  satkerId?: number;
  kodeSatker?: string;
  namaSatker?: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export interface LoginResponseDto {
  token: string;
  expiresAt: string;
  user: UserDto;
}

export interface RoleDto {
  id: number;
  roleCode: string;
  roleName: string;
  description?: string;
  userCount: number;
}

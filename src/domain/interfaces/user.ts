export interface ICreateUser {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  password: string;
  confirm_password: string;
}

export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateUser {
  name?: string;
  email?: string;
  isAdmin?: boolean;
}

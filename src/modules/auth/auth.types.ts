export interface RegisterUserInput {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginUserInput {
  identifier: string;
  password: string;
}
export interface UserRegisterInput {
  id: any;

  displayName?: string;

  firstName: string;

  lastName: string;

  email: string;

  password?: string;

  origin?: string;

  roles?: string[];
}

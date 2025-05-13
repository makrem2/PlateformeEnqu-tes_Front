import { Role } from './role';

export class User {
  [x: string]: any;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  date_naissance?: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: string;
  username?: string;
  email?: string;
  password?: string;
  lastLogin?: string;
  profile_picture?: string;
  address?: string;
  is_active?: string;
  roles: Role[] = [];
  token?: string;
}

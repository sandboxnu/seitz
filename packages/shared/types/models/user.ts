export enum Role {
  BasicUser = "Basic User",
  UserManager = "User Manager",
  StudyManager = "Study Manager",
  SuperAdmin = "Super Admin",
}

export interface CreateUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  studies?: string[];
  favoriteBatteries?: string[];
  recentStudyIds?: string[] | null;
  recentBatteries?: string[];
}

export interface IUser extends Required<CreateUser> {
  token: string;
  verified: boolean;
  verifyPassword(password: string): Promise<boolean>;
}

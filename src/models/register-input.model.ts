import type UserRole from "./user-roles.model";

export interface RegisterInput {
  FirstName: string
  LastName: string
  email: string
  password: string
  role: UserRole
  phone: string | null
}

import { type RegisterInput } from "./register-input.model";

export interface RegisteredUser extends Omit<RegisterInput, "password"> {}

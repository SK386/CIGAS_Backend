import { CustomError } from "./middlewares/errorHandler";
import { isValidNewUser, type validationUser } from "./validations";
import { StatusCodes } from "http-status-codes";

describe("isValidNewUser", () => {
  it("should return an error when FirstName is missing", () => {
    const user: validationUser = {
      FirstName: "",
      LastName: "Doe",
      email: "johndoe@example.org",
      phone: "",
      password: "1234",
      confirmpassword: "1234"
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a first name!"));
  });
  it("should return an error when LastName is missing", () => {
    const user: validationUser = {
      FirstName: "John",
      LastName: "",
      email: "johndoe@example.org",
      phone: "",
      password: "1234",
      confirmpassword: "1234"
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a last name!"));
  });
  it("should return an error when email is missing", () => {
    const user: validationUser = {
      FirstName: "John",
      LastName: "Doe",
      email: "",
      phone: "",
      password: "1234",
      confirmpassword: "1234"
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need an email!"));
  });
  it("should return an error when email is invalid", () => {
    const user: validationUser = {
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe",
      phone: "",
      password: "1234",
      confirmpassword: "1234"
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "User email is not valid!"));
  });
  it("should return an error when phone number is invalid", () => {
    const user: validationUser = {
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe@example.org",
      phone: "(011) 2424-3456788",
      password: "1234",
      confirmpassword: "1234"
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "User phone number is not valid!"));
  });
  it("should return an error when password is missing", () => {
    const user: validationUser = {
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe@example.org",
      phone: "",
      password: "",
      confirmpassword: "1234"
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a password!"));
  });
  it("should return an error when confirmpassword is missing", () => {
    const user: validationUser = {
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe@example.org",
      phone: "",
      password: "1234",
      confirmpassword: ""
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "You need a to confirm your password!"));
  });
  it("Should return an error when password and confirmpassword are different", () => {
    const user: validationUser = {
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe@example.org",
      phone: "",
      password: "1234",
      confirmpassword: "123"
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(new CustomError(StatusCodes.UNPROCESSABLE_ENTITY, "The passwords don't match!"));
  });
  it("Should return undefined as the user is valid", () => {
    const user: validationUser = {
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe@example.org",
      phone: "(87) 98812-3456",
      password: "1234",
      confirmpassword: "1234"
    };

    const result = isValidNewUser(user);

    expect(result).toEqual(undefined);
  });
});

import { describe, vi, expect, it } from "vitest";
import { createUser, findUserByEmail } from "../src/utils/users";
import prisma from "../src/__mocks__/client";
import { type Person } from "@prisma/client";
import { type validationUser } from "../src/validations";

vi.mock("../src/client");

describe("createUser", () => {
  it("should return a new user", async() => {
    const mockedNewUserCreation = {
      id: 1,
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe@gmail.com",
      phone: "",
      password: "1234",
      role: "Hardcoded"
    };

    const mockedNewUser: validationUser = {
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe@gmail.com",
      phone: "",
      password: "1234",
      confirmpassword: "1234"
    };

    prisma.person.create.mockResolvedValue(mockedNewUserCreation);

    const newUser = await createUser(mockedNewUser);

    const { password: _, ...expectedUserWithoutPassword } = mockedNewUserCreation;

    expect(newUser).toEqual(expectedUserWithoutPassword);
  });
});

describe("findUserByEmail", () => {
  it("should return an user", async() => {
    const mockedUser: Person = {
      id: 1,
      FirstName: "John",
      LastName: "Doe",
      email: "johndoe@gmail.com",
      phone: "",
      password: "1234",
      role: "Hardcoded"
    };

    prisma.person.findUnique.mockResolvedValue(mockedUser);

    const user = await findUserByEmail("johndoe@gmail.com");

    expect(user).toEqual(mockedUser);
  });
});

import prisma from "../client";
import { type Person } from "@prisma/client";
import { type validationUser } from "../validations";
import { genSalt, hash } from "bcrypt";

export async function createUser(userData: validationUser): Promise< Record<string, unknown> | Error | undefined> {
  const salt = await genSalt(12);
  const passwordHash = await hash(userData.password, salt);

  try {
    const newUser = await prisma.person.create({
      data: {
        FirstName: userData.FirstName,
        LastName: userData.LastName,
        email: userData.email,
        phone: userData.phone,
        password: passwordHash,
        role: "Hardcoded"
      }
    });

    const { password: _, ...newUserObj } = newUser;
    return newUserObj;
  } catch (error) {
    return new Error(String(error));
  }
}

export async function findUserByEmail(email: string): Promise<Person | null> {
  return await prisma.person.findUnique({
    where: { email }
  });
}

export async function findUserByID(id: number): Promise<Person | null> {
  return await prisma.person.findUnique({
    where: { id }
  });
}

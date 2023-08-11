import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import jwt from "jsonwebtoken";
import { compare, genSalt, hash } from "bcrypt";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { env } from "process";

const prisma = new PrismaClient();

export async function register(req, res) {
    const { FirstName, LastName, email, password, confirmpassword } = req.body;

    // Validations
    if (!FirstName) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: "You need a name"
        });
    }
    if (!LastName) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: "You need a last name"
        });
    }
    if (!email) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: "You need an email"
        });
    }
    if (!password) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: "You need a password"
        });
    }
    if (!confirmpassword) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: "You need to confirm your password"
        });
    }

    // Validating the fields themselves

    // Verifying if the user already exists
    const existingUser = await prisma.person.findUnique({
        where: {
            email: email
        }
    });

    if (existingUser) {
        return res.status(StatusCodes.CONFLICT).json({
            error: ReasonPhrases.CONFLICT,
            msg: "Email address already exists!"
        });
    }

    if (password !== confirmpassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: ReasonPhrases.BAD_REQUEST,
            msg: "Passwords do not match!"
        });
    }

    const salt = await genSalt(12);
    const passwordHash = await hash(password, salt);

    try {
        const newUser = await prisma.person.create({
            data: {
                FirstName,
                LastName,
                email,
                password: passwordHash
            }
        });
        return res.json({ user: newUser });
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            msg: "Internal error, try again later!"
        });
    }
}

export async function login(req, res) {
    const {email, password} = req.body;

    if (!email) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: "You need an email!"
        });
    }

    if (!password) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: "You need a password!"
        });
    }

    // Verifying if the user already exists
    const user = await prisma.person.findUnique({
        where: {
            email: email
        }
    });

    if (!user) {
        return res.status(StatusCodes.NOT_FOUND).json({
            error: ReasonPhrases.NOT_FOUND,
            msg: "User does not exist!"
        });
    }

    const checkPassword = await compare(password, user.password);

    if (!checkPassword) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: "Invalid password!"
        });
    }

    try {
        const secret = env.SECRET;
        
        const token = jwt.sign({
            id: user.uuid,
        },
        secret
        );

        return res.status(StatusCodes.ACCEPTED).json({msg: "Authentication successful!", token});
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err: ReasonPhrases.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Try again later."});
    }
}
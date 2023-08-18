import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { isValidNewUser } from "../validations.js";
import { compare, genSalt, hash } from "bcrypt";
import prismaclient from "@prisma/client";
import { tokenMiddleware } from "../middlewares/tokenValidation.js";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { env } from "process";

export const authRoutes = Router();
const prisma = new prismaclient.PrismaClient();

authRoutes.post("/register", async (req, res) => {
    // #swagger.tags = ['Authorization']
    // #swagger.summary = "Create a new user."
    /* #swagger.responses[200] = {
        schema: { $ref: '#/definitions/User' }


    } */

    const { FirstName, LastName, email, phone, password, confirmpassword } = req.body;

    const User = {
        FirstName,
        LastName,
        email,
        phone,
        password,
        confirmpassword,
    };

    const validUser = isValidNewUser(User);

    if (validUser != true) {
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(validUser);
    }

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
                phone,
                password: passwordHash,
                role: "Hardcoded"
            }
        });

        delete newUser.password; // We shouldn't include user's password on the return section.
        return res.json({ user: newUser });
    } catch (error) {
        console.log(`Registering new user: ${error}`);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            msg: "Internal error, try again later!"
        });
    }
});


authRoutes.post("/login", async (req, res) => {
    // #swagger.tags = ['Authorization']
    // #swagger.summary = "Authorize the user and send them a token."
    // #swagger.description = "It's the frontend responsability to store the token and send it in every authorized request."
    const { email, password } = req.body;

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

        return res.status(StatusCodes.ACCEPTED).json({ msg: "Authentication successful!", token });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err: ReasonPhrases.INTERNAL_SERVER_ERROR, msg: "Something went wrong. Try again later." });
    }
}
);

authRoutes.get("/authorized", tokenMiddleware, (req, res) => {
    // #swagger.tags = ['Authorization']
    // #swagger.summary = "Check if the user is authorized using the authorization middleware."
    res.json({ msg: "Authorized!" });
});
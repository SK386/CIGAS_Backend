import { ReasonPhrases, StatusCodes } from "http-status-codes";
import prismaclient from "@prisma/client";
import { tokenMiddleware } from "../middlewares/tokenValidation.js";
import { Router } from "express";

export const usersRoutes = Router();
const prisma = new prismaclient.PrismaClient();

usersRoutes.get("/:userID", tokenMiddleware, async (req, res) => {
    // #swagger.tags = ["Users"]
    // #swagger.summary = "Get user information using their ID."
    try{
        const userID = parseInt(req.params.userID, 10);
        if(isNaN(userID)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({error: ReasonPhrases.UNPROCESSABLE_ENTITY, msg: "userID is supposed to be a number!"});
        }

        const user = await prisma.person.findUnique({
            where: { uuid: userID },
            select: {
                uuid: true,
                FirstName: true,
                LastName: true,
                email: true,
                password: false,
                phone: false,
                role: true
            }
        });

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({error: ReasonPhrases.NOT_FOUND, msg: "User not found!"});
        }

        res.json(user);
    } catch(error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: ReasonPhrases.INTERNAL_SERVER_ERROR, msg: "Internal server error, try again later!"});
    
    }
});
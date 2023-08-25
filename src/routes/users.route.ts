import { Router } from "express";
import { UserByID } from "../controllers/users.controller";

const router = Router();

/**
 * @swagger
 * /users/{userID}:
 *   get:
 *     summary: Gather info about a user based on their ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userID
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 */
router.get("/:userID", UserByID);

export default router;

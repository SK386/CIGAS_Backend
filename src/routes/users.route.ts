import { Router } from "express";
import { UserByID, search } from "../controllers/users.controller";

const router = Router();

/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search for an user
 *     tags:
 *       - user
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: false
 *         description: query
 *       - in: query
 *         name: uuid
 *         schema:
 *           type: integer
 *         required: false
 *         description: User ID
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
 */
router.get("/search", search);

export default router;

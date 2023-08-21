import { Router } from "express";
import { UserAuthenticated } from "../controllers/user.controller";

const router = Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get the authenticated user
 *       security:
 *        - BearerAuth: []
 *       responses:
 *         200:
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/user'
 */
router.get("/", UserAuthenticated);

export default router;

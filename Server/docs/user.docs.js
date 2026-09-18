/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User management
 */

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get the profile of the logged-in user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
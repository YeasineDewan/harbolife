/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - product
 *         - quantity
 *         - price
 *       properties:
 *         product:
 *           type: string
 *           example: 68cafda1898ebb5b4cb77b88
 *         quantity:
 *           type: number
 *           example: 2
 *         price:
 *           type: number
 *           example: 38
 *     Order:
 *       type: object
 *       required:
 *         - user
 *         - items
 *         - total
 *         - address
 *       properties:
 *         user:
 *           type: string
 *           example: 68cafda1898ebb5b4cb77b88
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *         total:
 *           type: number
 *           example: 76
 *         status:
 *           type: string
 *           enum: [pending, shipped, delivered, canceled]
 *           example: pending
 *         address:
 *           type: string
 *           example: 123 Main St, Cairo, Egypt
 *         is_deleted:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Order management
 */

/**
 * @swagger
 * /api/order/create-order:
 *   post:
 *     summary: Create a new order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - total
 *               - address
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *               total:
 *                 type: number
 *                 example: 76
 *               address:
 *                 type: string
 *                 example: 123 Main St, Cairo, Egypt
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/order/:
 *   get:
 *     summary: Get all orders for the logged-in user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/order/{id}/cancel:
 *   patch:
 *     summary: Cancel an existing order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID to cancel
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *       400:
 *         description: Bad request (e.g. already canceled or not allowed)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
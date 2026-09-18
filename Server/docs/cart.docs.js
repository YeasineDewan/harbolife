/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
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
 *     Cart:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         user:
 *           type: string
 *           example: 68cafda1898ebb5b4cb77b88
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CartItem'
 *         total_price:
 *           type: number
 *           example: 76
 *         is_deleted:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-21T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-09-21T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Cart management
 */

/**
 * @swagger
 * /api/cart/get-user-cart:
 *   get:
 *     summary: Get the logged-in user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       404:
 *         description: Cart not found
 */

/**
 * @swagger
 * /api/cart/add-to-cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *               - price
 *             properties:
 *               product:
 *                 type: string
 *                 example: 68cafda1898ebb5b4cb77b88
 *               quantity:
 *                 type: number
 *                 example: 2
 *               price:
 *                 type: number
 *                 example: 38
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/cart/:productId:
 *   patch:
 *     summary: Update quantity of an item in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Item quantity updated
 *       400:
 *         description: Bad request
 *
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/cart/clear-cart:
 *   delete:
 *     summary: Clear all items from the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 *       400:
 *         description: Bad request
 */

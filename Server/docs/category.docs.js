/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           example: Pain Relief
 *         description:
 *           type: string
 *           example: Medications for pain relief
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
 *   - name: Category
 *     description: Category management
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Add a new category (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Bad request
 *
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of categories
 */

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get a single category by ID
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 *
 *   patch:
 *     summary: Update a category by ID (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Bad request
 *
 *   delete:
 *     summary: Delete a category by ID (Admin only)
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */

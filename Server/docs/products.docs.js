/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - category
 *         - stock
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           example: Cataflam
 *         description:
 *           type: string
 *           example: Cataflam contains Diclofenac Potassium, used to treat pain.
 *         price:
 *           type: number
 *           example: 38
 *         category:
 *           type: string
 *           example: 68cafda1898ebb5b4cb77b88
 *         stock:
 *           type: number
 *           example: 20
 *         has_strips:
 *           type: boolean
 *           example: false
 *         strip_count:
 *           type: number
 *           example: 0
 *         requires_prescription:
 *           type: boolean
 *           example: false
 *         image:
 *           type: string
 *           format: binary
 *         top_selling :
 *           type: boolean
 *           example: false
 *         rating:
 *           type: number
 *           example: 4
 *         is_deleted:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Product management
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Add a new product (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *
 *   get:
 *     summary: Get all products
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: List of products
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *
 *   patch:
 *     summary: Update a product by ID (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Product Name
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               has_strips:
 *                 type: boolean
 *               strip_count:
 *                 type: number
 *               requires_prescription:
 *                 type: boolean
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Bad request
 *
 *   delete:
 *     summary: Delete a product by ID (Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

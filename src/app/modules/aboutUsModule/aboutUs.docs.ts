/**
 * @swagger
 * /about-us/create-or-update:
 *  post:
 *      summary: Create or update about us
 *      tags: [About Us]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/AboutUsSchema'
 *      responses:
 *          201:
 *              description: About us created successfully
 *          400:
 *              description: Bad request
 *
 * /about-us/retrive:
 *  get:
 *      summary: Retrieve about us
 *      tags: [About Us]
 *      responses:
 *          200:
 *              description: About us retrieved successfully
 *          400:
 *              description: Bad request
 */

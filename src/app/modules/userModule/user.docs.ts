/**
 * @swagger
 * /user/create:
 *  post:
 *      summary: Create new user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/UserSchema'
 *      responses:
 *          201:
 *              description: User created successfully
 *          400:
 *              description: Bad request
 */

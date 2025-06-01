/**
 * @swagger
 * /privacy-policy/create:
 *  post:
 *      summary: Create new privacy policy
 *      tags: [Privacy Policy]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/PrivacyPolicySchema'
 *      responses:
 *          201:
 *              description: Privacy policy created successfully
 *          400:
 *              description: Bad request
 * 
 * /privacy-policy/retrive:
 *  get:
 *      summary: Retrieve privacy policy
 *      tags: [Privacy Policy]
 *      responses:
 *          200:
 *              description: Privacy policy retrieved successfully
 *          400:
 *              description: Bad request
 */

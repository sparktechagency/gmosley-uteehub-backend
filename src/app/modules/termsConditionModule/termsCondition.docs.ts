/**
 * @swagger
 * /terms-condition/create:
 *  post:
 *      summary: Create new terms condition
 *      tags: [Terms Condition]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/TermsConditionSchema'
 *      responses:
 *          201:
 *              description: Terms condition created successfully
 *          400:
 *              description: Bad request
 * 
 * /terms-condition/retrive:
 *  get:
 *      summary: Retrieve terms condition
 *      tags: [Terms Condition]
 *      responses:
 *          200:
 *              description: Terms condition retrieved successfully
 *          400:
 *              description: Bad request
 */

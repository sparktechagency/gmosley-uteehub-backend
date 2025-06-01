/**
 * @swagger
 * /faq/create:
 *  post:
 *      summary: Create new faq
 *      tags: [FAQ]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/FAQSchema'
 *      responses:
 *          201:
 *              description: Faq created successfully
 *          400:
 *              description: Bad request
 *
 * /faq/retrive:
 *  get:
 *      summary: Retrieve faq
 *      tags: [FAQ]
 *      responses:
 *          200:
 *              description: Faq retrieved successfully
 *          400:
 *              description: Bad request
 *
 * /faq/delete/:id:
 *  delete:
 *      summary: Delete faq
 *      tags: [FAQ]
 *      responses:
 *          200:
 *              description: Faq deleted successfully
 *          400:
 *              description: Bad request
 *
 * /faq/update/:id:
 *  patch:
 *      summary: Update faq
 *      tags: [FAQ]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/FAQSchema'
 *      responses:
 *          200:
 *              description: Faq updated successfully
 *          400:
 *              description: Bad request
 */

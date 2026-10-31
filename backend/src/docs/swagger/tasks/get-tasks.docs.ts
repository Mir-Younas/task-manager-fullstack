/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Fetch tasks
 *     description: |
 *       Fetch tasks with filtering, searching, sorting, and pagination.
 *       Regular users can fetch only their own tasks.
 *       Admins can fetch all tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter tasks by status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *         example: pending
 *
 *       - in: query
 *         name: search
 *         required: false
 *         description: Case-insensitive search by task title
 *         schema:
 *           type: string
 *           maxLength: 100
 *         example: API
 *
 *       - in: query
 *         name: sort
 *         required: false
 *         description: Sort tasks by creation date
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *           default: newest
 *         example: newest
 *
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number (starting from 1)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Maximum number of tasks per page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 10
 *
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - success
 *                 - tasks
 *                 - pagination
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 tasks:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 68a4684be6671b45f9aa23fd
 *                       title:
 *                         type: string
 *                         example: Complete Task API
 *                       description:
 *                         type: string
 *                         example: Complete Swagger documentation for the Task API
 *                       status:
 *                         type: string
 *                         enum: [pending, in_progress, completed]
 *                         example: pending
 *                       author:
 *                         type: object
 *                         nullable: true
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: Mir Younas
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                 pagination:
 *                   type: object
 *                   required:
 *                     - page
 *                     - limit
 *                     - total
 *                     - totalPages
 *                   properties:
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *
 *       400:
 *         description: Invalid query parameters
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User account is blocked
 */

export {};

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     summary: Fetch tasks
 *     description: Regular users can fetch only their own tasks. Admins can fetch all tasks.
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Tasks fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: User account is blocked
 */

export {};

/**
 * @openapi
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Fetch a task by ID
 *     description: Only the task author or an admin can view the task.
 *     tags:
 *       - Tasks
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB task ID
 *     responses:
 *       200:
 *         description: Task fetched successfully
 *       400:
 *         description: Invalid task ID
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions or blocked account
 *       404:
 *         description: Task not found
 */

export {};

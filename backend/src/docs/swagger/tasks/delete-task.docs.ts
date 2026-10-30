/**
 * @openapi
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete a task
 *     description: Only the task author or an admin can delete the task.
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
 *         description: Task deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Task deleted successfully
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

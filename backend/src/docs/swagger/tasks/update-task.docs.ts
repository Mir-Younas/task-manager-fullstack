/**
 * @openapi
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update a task
 *     description: Only the task author or an admin can update the task.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             minProperties: 1
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 example: Updated Task API
 *               description:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Update and test the Task API documentation
 *               status:
 *                 type: string
 *                 enum: [pending, in-progress, completed]
 *                 example: completed
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid request data, task ID, or no changes detected
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Insufficient permissions or blocked account
 *       404:
 *         description: Task not found
 */

export {};

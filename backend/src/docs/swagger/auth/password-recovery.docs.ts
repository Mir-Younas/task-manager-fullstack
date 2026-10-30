/**
 * @openapi
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     description: Requests a password reset email without revealing whether an eligible account exists.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@example.com
 *     responses:
 *       200:
 *         description: Password reset request processed
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: If an eligible account exists with this email, a password reset link has been sent.
 *       400:
 *         description: Invalid email
 *       429:
 *         description: Too many password reset requests
 *
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset account password
 *     description: Sets a new password using a valid password reset token. Existing authentication cookies are cleared.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 description: Password reset token received by email.
 *                 example: your-password-reset-token
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewPassword@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Password reset successfully. Please log in again.
 *       400:
 *         description: Invalid request, token, or password
 *       401:
 *         description: Invalid or expired password reset token
 */

export {};

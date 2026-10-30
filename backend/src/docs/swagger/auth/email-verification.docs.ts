/**
 * @openapi
 * /api/auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     description: Verifies an account using the token received in the verification email.
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
 *             properties:
 *               token:
 *                 type: string
 *                 description: Verification token received by email.
 *                 example: your-email-verification-token
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Email verified successfully. Please log in.
 *       400:
 *         description: Invalid request or verification token
 *       401:
 *         description: Invalid or expired verification token
 *
 * /api/auth/resend-verification:
 *   post:
 *     summary: Resend email verification link
 *     description: Requests a new verification email for an account that still requires verification. The response does not reveal whether the email is registered.
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
 *         description: Verification request processed
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: If your account requires verification, an email has been sent.
 *       400:
 *         description: Invalid email
 *       429:
 *         description: Too many verification email requests
 */

export {};

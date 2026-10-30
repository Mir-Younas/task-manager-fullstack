/**
 * @openapi
 * tags:
 *   - name: Authentication
 *     description: User registration, authentication, Google OAuth, email verification, password recovery, and session management.
 *
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Creates an unverified account and attempts to send an email verification link. Email verification is required before password login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Test User
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       201:
 *         description: Account created. Email delivery may succeed or fail.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Account created successfully. Please check your email to verify your account.
 *                 emailSent:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Newly registered user without password.
 *       400:
 *         description: Invalid registration data
 *       409:
 *         description: Email already registered
 *       429:
 *         description: Too many registration requests
 */

export {};

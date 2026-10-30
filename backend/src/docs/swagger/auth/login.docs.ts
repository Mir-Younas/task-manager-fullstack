/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a verified, active user and sets HTTP-only access and refresh token cookies.
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
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: testuser@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only authentication cookies.
 *             schema:
 *               type: string
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
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   description: Authenticated user without password.
 *       400:
 *         description: Invalid login request
 *       401:
 *         description: Invalid email or password
 *       403:
 *         description: Email not verified or account access restricted
 *       429:
 *         description: Too many login attempts or temporary login cooldown
 *
 * /api/auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns the user associated with the valid access token cookie.
 *     tags:
 *       - Authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Authenticated user information.
 *       401:
 *         description: Missing, invalid, or expired access token
 *       403:
 *         description: Account access restricted
 */

export {};

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh authentication session
 *     description: Uses the HTTP-only refresh token cookie to issue a new access token cookie.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Session refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: Updated HTTP-only access token cookie.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Session refreshed successfully
 *       401:
 *         description: Missing, invalid, expired, or revoked refresh token
 *       403:
 *         description: Account is not eligible for authentication
 *
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Revokes the supplied refresh session when present and clears authentication cookies.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *         headers:
 *           Set-Cookie:
 *             description: Authentication cookies cleared.
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Logout successful
 */

export {};

type ActionEmailTemplateParams = {
  heading: string;
  message: string;
  buttonLabel: string;
  actionUrl: string;
  appName: string;
};

const escapeHtml = (value: string): string => {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(
    /[&<>"']/g,
    (character) => entities[character] ?? character,
  );
};

export const buildActionEmailTemplate = ({
  heading,
  message,
  buttonLabel,
  actionUrl,
  appName,
}: ActionEmailTemplateParams): string => {
  const url = new URL(actionUrl);

  if (
    url.protocol !== "https:" &&
    !(
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1"].includes(url.hostname)
    )
  ) {
    throw new Error("Invalid email action URL");
  }

  const safeHeading = escapeHtml(heading);
  const safeMessage = escapeHtml(message);
  const safeButtonLabel = escapeHtml(buttonLabel);
  const safeActionUrl = escapeHtml(url.toString());
  const safeAppName = escapeHtml(appName);

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${safeHeading}</title>
      </head>

      <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="padding:40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;">
                <tr>
                  <td style="padding:36px 32px;">
                    <h2 style="margin:0 0 20px;color:#111827;font-size:24px;">
                      ${safeHeading}
                    </h2>

                    <p style="color:#4b5563;font-size:15px;line-height:1.7;">
                      ${safeMessage}
                    </p>

                    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px 0;">
                      <tr>
                        <td bgcolor="#2563eb" style="border-radius:6px;">
                          <a href="${safeActionUrl}" style="display:inline-block;padding:14px 24px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;">
                            ${safeButtonLabel}
                          </a>
                        </td>
                      </tr>
                    </table>

                    <p style="color:#6b7280;font-size:13px;line-height:1.6;">
                      If the button does not work, copy this link into your browser:
                    </p>

                    <p style="font-size:12px;line-height:1.6;overflow-wrap:anywhere;">
                      <a href="${safeActionUrl}" style="color:#2563eb;">
                        ${safeActionUrl}
                      </a>
                    </p>

                    <p style="color:#6b7280;font-size:13px;line-height:1.6;">
                      If you did not request this action, you can safely ignore this email.
                    </p>

                    <hr style="border:0;border-top:1px solid #e5e7eb;margin:28px 0;" />

                    <p style="color:#9ca3af;font-size:12px;text-align:center;">
                      &copy; ${safeAppName}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

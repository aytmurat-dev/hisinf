interface EmailLayoutOptions {
  title: string
  bodyHtml: string
  locale?: string
  buttonText?: string
  buttonUrl?: string
}

export function emailLayout({
  title,
  bodyHtml,
  locale = 'uz',
  buttonText,
  buttonUrl,
}: EmailLayoutOptions): string {
  const isKaa = locale === 'kaa'
  const portalName = 'hisinf.uz'
  const footerNote = isKaa
    ? 'Mektep oqıwshıları ushın tariyxıy maǵlıwmatlar portalı'
    : 'Maktab oʻquvchilari uchun tarixiy maʼlumotlar portali'

  const buttonHtml =
    buttonText && buttonUrl
      ? `
      <table border="0" cellpadding="0" cellspacing="0" style="margin-top:24px;margin-bottom:24px;">
        <tr>
          <td align="center" bgcolor="#8c2f1b" style="border-radius:4px;">
            <a href="${buttonUrl}" target="_blank" style="display:inline-block;padding:12px 24px;font-family:'IBM Plex Sans',Arial,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;letter-spacing:0.02em;">
              ${buttonText}
            </a>
          </td>
        </tr>
      </table>`
      : ''

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f5efe3;font-family:'IBM Plex Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#2c2825;line-height:1.6;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:#f5efe3;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width:580px;background-color:#ffffff;border:1px solid #e5dcce;border-radius:6px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid #ede4d6;background-color:#faf6ef;">
              <div style="font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#8c2f1b;font-weight:600;margin-bottom:4px;">
                ${portalName}
              </div>
              <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;color:#1c1917;font-weight:bold;line-height:1.3;">
                ${title}
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;font-size:15px;color:#3d3733;line-height:1.65;">
              ${bodyHtml}
              ${buttonHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#faf6ef;border-top:1px solid #ede4d6;font-size:12px;color:#78716c;text-align:center;">
              <p style="margin:0 0 6px 0;font-weight:500;">
                <a href="${process.env.NEXT_PUBLIC_SERVER_URL || 'https://hisinf.uz'}" style="color:#8c2f1b;text-decoration:none;">${portalName}</a>
                &nbsp;·&nbsp;
                ${footerNote}
              </p>
              <p style="margin:0;font-size:11px;color:#a8a29e;">
                © ${new Date().getFullYear()} HISINF.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

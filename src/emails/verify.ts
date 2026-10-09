import { emailLayout } from './layout'

interface GenerateEmailArgs {
  user: {
    locale?: string | null
    displayName?: string | null
    email?: string | null
  }
  token: string
}

export function generateVerifyEmailSubject(args?: { user?: { locale?: string | null } }): string {
  const locale = args?.user?.locale ?? 'uz'
  return locale === 'kaa'
    ? 'Elektron pochtanı tastıyıqlaw — hisinf.uz'
    : 'Elektron pochtani tasdiqlash — hisinf.uz'
}

export function generateVerifyEmailHTML({ user, token }: GenerateEmailArgs): string {
  const locale = user?.locale || 'uz'
  const isKaa = locale === 'kaa'
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
  const verifyUrl = `${serverUrl}/${locale}/tasdiqlash?token=${token}`

  const title = isKaa ? 'Akkaunttı tastıyıqlań' : 'Akkauntingizni tasdiqlang'
  const greeting = isKaa
    ? `Húrmetli <strong>${user.displayName || 'oqıwshı'}</strong>,`
    : `Hurmatli <strong>${user.displayName || 'oʻquvchi'}</strong>,`
  const intro = isKaa
    ? 'hisinf.uz portalında dizimnen ótkenińiz ushın raxmet. Akkaunttı iske túsiriw ushın tómendegi túymeni basıń:'
    : 'hisinf.uz portalida roʻyxatdan oʻtganingiz uchun rahmat. Akkauntni faollashtirish uchun quyidagi tugmani bosing:'
  const btnText = isKaa ? 'Pochtanı tastıyıqlaw' : 'Pochtani tasdiqlash'
  const fallbackText = isKaa
    ? `Túyme islemese, usı siltemeni brauzerge kóshirip qoyıń:<br/><a href="${verifyUrl}" style="color:#8c2f1b;word-break:break-all;">${verifyUrl}</a>`
    : `Tugma ishlamasa, ushbu havolani brauzerga nusxalab qoʻying:<br/><a href="${verifyUrl}" style="color:#8c2f1b;word-break:break-all;">${verifyUrl}</a>`

  const bodyHtml = `
    <p style="margin-top:0;">${greeting}</p>
    <p>${intro}</p>
    <p style="font-size:13px;color:#78716c;margin-top:24px;">${fallbackText}</p>
  `

  return emailLayout({
    title,
    bodyHtml,
    locale,
    buttonText: btnText,
    buttonUrl: verifyUrl,
  })
}

import { emailLayout } from './layout'

interface GenerateResetEmailArgs {
  user: {
    locale?: string | null
    displayName?: string | null
    email?: string | null
    collection?: string
    lastLoginAt?: string | null
  }
  token: string
}

export function generateResetPasswordEmailSubject(args?: { user?: { locale?: string | null; collection?: string; lastLoginAt?: string | null } }): string {
  const locale = args?.user?.locale ?? 'uz'
  const isInvite = args?.user?.collection === 'users' && !args?.user?.lastLoginAt
  if (isInvite) {
    return 'hisinf.uz tahririyatiga taklifnoma'
  }
  return locale === 'kaa'
    ? 'Paroldi tiklew — hisinf.uz'
    : 'Parolni tiklash — hisinf.uz'
}

export function generateResetPasswordEmailHTML({ user, token }: GenerateResetEmailArgs): string {
  const locale = user?.locale || 'uz'
  const isKaa = locale === 'kaa'
  const isStaff = user?.collection === 'users'
  const isInvite = isStaff && !user?.lastLoginAt
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'

  const resetUrl = isStaff
    ? `${serverUrl}/admin/reset-password?token=${token}`
    : `${serverUrl}/${locale}/parolni-tiklash/yangi?token=${token}`

  if (isInvite) {
    const title = 'Tahririyatga xush kelibsiz!'
    const greeting = `Hurmatli <strong>${user.displayName || 'hamkasb'}</strong>,`
    const intro = `Sizni <strong>hisinf.uz</strong> tahririyatiga taklif qilishdi. Admin panelga kirish va yangi parol oʻrnatish uchun quyidagi tugmani bosing:`
    const btnText = 'Parol oʻrnatish va kirish'
    const fallbackText = `Tugma ishlamasa, ushbu havolani oching:<br/><a href="${resetUrl}" style="color:#8c2f1b;word-break:break-all;">${resetUrl}</a>`

    const bodyHtml = `
      <p style="margin-top:0;">${greeting}</p>
      <p>${intro}</p>
      <p style="font-size:13px;color:#78716c;margin-top:24px;">${fallbackText}</p>
    `

    return emailLayout({
      title,
      bodyHtml,
      locale: 'uz',
      buttonText: btnText,
      buttonUrl: resetUrl,
    })
  }

  const title = isKaa ? 'Paroldi tiklew' : 'Parolni tiklash'
  const greeting = isKaa
    ? `Húrmetli <strong>${user.displayName || 'qollanıwshı'}</strong>,`
    : `Hurmatli <strong>${user.displayName || 'foydalanuvchi'}</strong>,`
  const intro = isKaa
    ? 'Parolıńızdı tiklew ushın soraw kelip tústi. Jańa parol ornatıw ushın tómendegi túymeni basıń:'
    : 'Parolingizni tiklash boʻyicha soʻrov kelib tushdi. Yangi parol oʻrnatish uchun quyidagi tugmani bosing:'
  const btnText = isKaa ? 'Paroldi tiklew' : 'Parolni tiklash'
  const warning = isKaa
    ? 'Eger bul sorawdı siz jibermegen bolsańız, usı xattı itibarsız qaldırıń.'
    : 'Agar ushbu soʻrovni siz yubormagan boʻlsangiz, ushbu xatni eʼtiborsiz qoldiring.'
  const fallbackText = isKaa
    ? `Túyme islemese, usı siltemeni brauzerge kóshirip qoyıń:<br/><a href="${resetUrl}" style="color:#8c2f1b;word-break:break-all;">${resetUrl}</a>`
    : `Tugma ishlamasa, ushbu havolani brauzerga nusxalab qoʻying:<br/><a href="${resetUrl}" style="color:#8c2f1b;word-break:break-all;">${resetUrl}</a>`

  const bodyHtml = `
    <p style="margin-top:0;">${greeting}</p>
    <p>${intro}</p>
    <p style="font-size:13px;color:#78716c;">${warning}</p>
    <p style="font-size:13px;color:#78716c;margin-top:24px;">${fallbackText}</p>
  `

  return emailLayout({
    title,
    bodyHtml,
    locale,
    buttonText: btnText,
    buttonUrl: resetUrl,
  })
}

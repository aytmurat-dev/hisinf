import { emailLayout } from './layout'

interface InquiryReplyArgs {
  toEmail: string
  subject?: string | null
  replyText: string
  locale?: string
}

export function generateInquiryReplyHTML({
  subject,
  replyText,
  locale = 'uz',
}: InquiryReplyArgs): string {
  const isKaa = locale === 'kaa'
  const title = isKaa ? 'Múrjatıńızǵa juwap' : 'Murojaatingizga javob'
  const intro = subject
    ? isKaa
      ? `Sizniń «<strong>${subject}</strong>» temasındaǵı múrjatıńızǵa tahririyat tárepinen juwap berildi:`
      : `Sizning «<strong>${subject}</strong>» mavzusidagi murojaatingizga tahririyat tomonidan javob berildi:`
    : isKaa
      ? 'Sizniń múrjatıńızǵa tahririyat tárepinen juwap berildi:'
      : 'Sizning murojaatingizga tahririyat tomonidan javob berildi:'

  const bodyHtml = `
    <p style="margin-top:0;">${intro}</p>
    <div style="background-color:#faf6ef;border-left:3px solid #8c2f1b;padding:16px 20px;margin:20px 0;font-size:15px;line-height:1.6;color:#2c2825;white-space:pre-wrap;">${replyText}</div>
    <p style="font-size:13px;color:#78716c;">
      ${isKaa ? 'Qosımsha sorawlarıńız bolsa, sayt arqalı baylanısıwıńız múmkin.' : 'Qoʻshimcha savollaringiz boʻlsa, sayt orqali bogʻlanishingiz mumkin.'}
    </p>
  `

  return emailLayout({
    title,
    bodyHtml,
    locale,
    buttonText: isKaa ? 'Saytqa ótiw' : 'Saytga oʻtish',
    buttonUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'https://hisinf.uz',
  })
}

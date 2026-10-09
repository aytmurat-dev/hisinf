import type { CollectionAfterChangeHook } from 'payload'
import { emailLayout } from '../emails/layout'
import type { User } from '@/payload-types'

export const notifyWorkflow: CollectionAfterChangeHook = async ({
  req,
  doc,
  previousDoc,
}) => {
  if (req.context?.disableNotifications) return doc

  const from = previousDoc?.workflowStatus
  const to = doc?.workflowStatus
  if (!to || from === to) return doc

  const serverUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    'http://localhost:3000'
  const title = (typeof doc.title === 'string' ? doc.title : doc.title?.uz) || 'Nomsiz maqola'

  try {
    if (to === 'in_review') {
      // Notify active editors & admins
      const staffRes = await req.payload.find({
        collection: 'users',
        where: {
          and: [
            { role: { in: ['admin', 'editor'] } },
            { isActive: { not_equals: false } },
          ],
        },
        pagination: false,
      })

      const editUrl = `${serverUrl}/admin/collections/posts/${doc.id}`
      const bodyHtml = `
        <p style="margin-top:0;">Yangi maqola tekshiruvga yuborildi: <strong>«${title}»</strong>.</p>
        <p>Iltimos, maqolani koʻrib chiqing va tasdiqlang yoki tuzatish uchun izoh qoldiring.</p>
      `
      const emailHtml = emailLayout({
        title: 'Yangi maqola tekshiruvda',
        bodyHtml,
        locale: 'uz',
        buttonText: 'Tahririyatda ochish',
        buttonUrl: editUrl,
      })

      for (const editor of staffRes.docs) {
        if (editor.email) {
          await req.payload.sendEmail({
            to: editor.email,
            subject: `[Tekshiruv] «${title}» tekshiruvga yuborildi`,
            html: emailHtml,
          }).catch((err) => {
            req.payload.logger.warn?.({ err, to: editor.email }, 'Workflow notification send failed')
          })
        }
      }
    } else if (to === 'changes_requested' || to === 'approved' || to === 'published') {
      // Find author
      let authorUser: User | null = null
      const authorId = typeof doc.author === 'object' && doc.author ? doc.author.id : doc.author

      if (authorId) {
        authorUser = await req.payload
          .findByID({
            collection: 'users',
            id: authorId,
          })
          .catch(() => null)
      }

      if (authorUser?.email) {
        let subject = ''
        let headerTitle = ''
        let bodyHtml = ''
        let btnText = 'Maqolani koʻrish'
        const postUrl =
          to === 'published'
            ? `${serverUrl}/uz/maqolalar/${doc.slug}`
            : `${serverUrl}/admin/collections/posts/${doc.id}`

        if (to === 'changes_requested') {
          const notes = Array.isArray(doc.reviewNotes) ? doc.reviewNotes : []
          const lastNote = notes.length > 0 ? (notes[notes.length - 1] as { note?: string })?.note : ''
          subject = `[Tuzatish] «${title}» maqolangiz qaytarildi`
          headerTitle = 'Tuzatish kiritish soʻraldi'
          bodyHtml = `
            <p style="margin-top:0;"><strong>«${title}»</strong> sarlavhali maqolangiz muharrir tomonidan qaytarildi.</p>
            ${
              lastNote
                ? `<div style="background-color:#faf6ef;border-left:3px solid #8c2f1b;padding:12px 16px;margin:16px 0;font-size:14px;"><strong>Muharrir izohi:</strong><br/>${lastNote}</div>`
                : ''
            }
            <p>Iltimos, koʻrsatilgan kamchiliklarni toʻgʻrilab, qayta tekshiruvga yuboring.</p>
          `
          btnText = 'Tahrirlash'
        } else if (to === 'approved') {
          subject = `[Tasdiqlandi] «${title}» tasdiqlandi`
          headerTitle = 'Maqolangiz tasdiqlandi'
          bodyHtml = `
            <p style="margin-top:0;">Tabriklaymiz! <strong>«${title}»</strong> nomli maqolangiz muharrir tomonidan tasdiqlandi va tez orada chop etiladi.</p>
          `
        } else if (to === 'published') {
          subject = `[Chop etildi] «${title}» saytda eʼlon qilindi`
          headerTitle = 'Maqolangiz chop etildi'
          bodyHtml = `
            <p style="margin-top:0;">Ajoyib xabar! <strong>«${title}»</strong> nomli maqolangiz hisinf.uz saytida chop etildi va barcha oʻquvchilar uchun ochiq.</p>
          `
          btnText = 'Saytda oʻqish'
        }

        const emailHtml = emailLayout({
          title: headerTitle,
          bodyHtml,
          locale: 'uz',
          buttonText: btnText,
          buttonUrl: postUrl,
        })

        await req.payload.sendEmail({
          to: authorUser.email,
          subject,
          html: emailHtml,
        }).catch((err) => {
          req.payload.logger.warn?.({ err, to: authorUser?.email }, 'Workflow author notification failed')
        })
      }
    }
  } catch (error) {
    req.payload.logger.warn?.({ error }, 'Workflow notification hook encountered an error')
  }

  return doc
}

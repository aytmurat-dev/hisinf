import type { Payload } from 'payload'

function textToLexical(text: string) {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)

  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        textFormat: 0,
        textStyle: '',
        children: p.split('\n').flatMap((line, i) => [
          ...(i > 0 ? [{ type: 'linebreak', version: 1 }] : []),
          {
            type: 'text',
            text: line,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ]),
      })),
    },
  }
}

export default async function run(payload: Payload) {
  const isDryRun = process.argv.includes('--dry-run')
  payload.logger.info(`[02-convert-content] Starting plain text to Lexical migration (dry-run: ${isDryRun})...`)

  const locales: ('uz' | 'kaa')[] = ['uz', 'kaa']
  let totalConverted = 0

  for (const locale of locales) {
    const posts = await payload.find({
      collection: 'posts',
      locale,
      fallbackLocale: false,
      limit: 1000,
      overrideAccess: true,
    })

    payload.logger.info(`Checking ${posts.totalDocs} posts for locale '${locale}'...`)

    for (const post of posts.docs) {
      const content = (post as unknown as { content?: string }).content
      const body = post.body

      const hasContent = Boolean(content && content.trim())
      const hasBody = Boolean(
        body &&
        typeof body === 'object' &&
        Array.isArray((body as { root?: { children?: unknown[] } }).root?.children) &&
        (body as { root?: { children?: unknown[] } }).root!.children!.length > 0,
      )

      if (hasContent && !hasBody) {
        totalConverted++
        payload.logger.info(
          `[${locale}] Post ${post.id} (${post.slug}): Converting content (${content!.length} chars) to Lexical body`,
        )

        if (!isDryRun) {
          const lexicalJson = textToLexical(content!)
          await payload.update({
            collection: 'posts',
            id: post.id,
            locale,
            data: {
              body: lexicalJson,
            },
            overrideAccess: true,
            draft: false,
            context: {
              disableRevalidate: true,
              disableNotifications: true,
              skipWorkflow: true,
            },
          })
        }
      }
    }
  }

  payload.logger.info(
    `[02-convert-content] Completed. Total converted entries: ${totalConverted} ${isDryRun ? '(DRY RUN)' : ''}`,
  )
}

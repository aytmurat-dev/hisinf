declare module 'jsdom' {
  export class JSDOM {
    constructor(html?: string | Buffer, options?: Record<string, unknown>)
    window: {
      document: Document
      [key: string]: unknown
    }
  }
}

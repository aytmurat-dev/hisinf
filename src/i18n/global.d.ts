import type uz from '../../messages/uz.json'

declare module 'next-intl' {
  interface AppConfig {
    Messages: typeof uz
  }
}

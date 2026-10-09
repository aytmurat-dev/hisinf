import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { isStaffUser } from '@/access'
import { AdminChatClient } from './AdminChatClient'

export const metadata: Metadata = {
  title: 'Adminlar Chati — hisinf.uz Tahririyat',
}

export default async function AdminChatPage() {
  const payload = await getPayloadClient()
  const reqHeaders = await headers()
  const { user } = await payload.auth({ headers: reqHeaders })

  if (!user || !isStaffUser(user)) {
    redirect('/admin/login')
  }

  return <AdminChatClient />
}

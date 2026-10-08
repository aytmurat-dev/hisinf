'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Shield,
  FileText,
  Users,
  MessageSquare,
  Mail,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  FileUp,
  KeyRound,
  User,
  Phone,
  Lock,
} from 'lucide-react'

interface PostItem {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  coverImageUrl: string
  createdAt: string
}

interface UserItem {
  id: number
  firstName: string
  lastName: string
  username: string
  phone: string
  displayPassword: string
  createdAt: string
}

interface CommentItem {
  id: number
  authorName: string
  body: string
  createdAt: string
  postId: number
  postTitle: string
}

interface InquiryItem {
  id: number
  name: string
  phone: string
  message: string
  createdAt: string
}

export default function AdminDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params.locale as string) || 'uz'

  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Login form if not admin
  const [loginUsername, setLoginUsername] = useState('admin')
  const [loginPassword, setLoginPassword] = useState('admin123')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Active tab: 'posts' | 'users' | 'comments' | 'inquiries'
  const [activeTab, setActiveTab] = useState<'posts' | 'users' | 'comments' | 'inquiries'>('posts')

  // Data states
  const [posts, setPosts] = useState<PostItem[]>([])
  const [users, setUsers] = useState<UserItem[]>([])
  const [comments, setComments] = useState<CommentItem[]>([])
  const [inquiries, setInquiries] = useState<InquiryItem[]>([])
  const [loadingData, setLoadingData] = useState(false)

  // Feedback message
  const [actionMsg, setActionMsg] = useState('')

  // Post modal states
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [postTitle, setPostTitle] = useState('')
  const [postExcerpt, setPostExcerpt] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postCoverUrl, setPostCoverUrl] = useState('')
  const [parsingDoc, setParsingDoc] = useState(false)
  const [docMsg, setDocMsg] = useState('')
  const [savingPost, setSavingPost] = useState(false)

  // User edit modal states
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [userFirstName, setUserFirstName] = useState('')
  const [userLastName, setUserLastName] = useState('')
  const [userUsername, setUserUsername] = useState('')
  const [userPhone, setUserPhone] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [savingUser, setSavingUser] = useState(false)

  const loadAllData = useCallback(async () => {
    setLoadingData(true)
    try {
      const [resPosts, resUsers, resComments, resInquiries] = await Promise.all([
        fetch(`/api/admin/posts?locale=${locale}`),
        fetch('/api/admin/users'),
        fetch('/api/admin/comments'),
        fetch('/api/admin/inquiries'),
      ])

      if (resPosts.ok) {
        const d = await resPosts.json()
        setPosts(d.posts || [])
      }
      if (resUsers.ok) {
        const d = await resUsers.json()
        setUsers(d.users || [])
      }
      if (resComments.ok) {
        const d = await resComments.json()
        setComments(d.comments || [])
      }
      if (resInquiries.ok) {
        const d = await resInquiries.json()
        setInquiries(d.inquiries || [])
      }
    } catch (_e) {
      // ignore
    } finally {
      setLoadingData(false)
    }
  }, [locale])

  const checkCurrentAdmin = useCallback(async () => {
    try {
      const res = await fetch('/api/readers/me')
      const data = await res.json()
      if (data.user && data.user.username === 'admin') {
        setIsAdmin(true)
        loadAllData()
      } else {
        setIsAdmin(false)
      }
    } catch (_e) {
      setIsAdmin(false)
    } finally {
      setCheckingAuth(false)
    }
  }, [loadAllData])

  // Check auth on mount
  useEffect(() => {
    checkCurrentAdmin()
  }, [checkCurrentAdmin])

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const res = await fetch('/api/readers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      })

      const data = await res.json()

      if (!res.ok || data.reader?.username !== 'admin') {
        setLoginError(data.error || 'Faqat administrator hisobi (admin / admin123) bilan kirish mumkin!')
        return
      }

      setIsAdmin(true)
      loadAllData()
      router.refresh()
    } catch (_err) {
      setLoginError('Server bilan ulanishda xatolik')
    } finally {
      setLoginLoading(false)
    }
  }

  const showNotification = (msg: string) => {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 4000)
  }

  // --- Post Functions ---
  const handleOpenNewPost = () => {
    setEditingPostId(null)
    setPostTitle('')
    setPostExcerpt('')
    setPostContent('')
    setPostCoverUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop')
    setDocMsg('')
    setPostModalOpen(true)
  }

  const handleOpenEditPost = (post: PostItem) => {
    setEditingPostId(post.id)
    setPostTitle(post.title === 'Mavzusiz post' ? '' : post.title)
    setPostExcerpt(post.excerpt)
    setPostContent(post.content)
    setPostCoverUrl(post.coverImageUrl)
    setDocMsg('')
    setPostModalOpen(true)
  }

  const handleDeletePost = async (id: number) => {
    if (!confirm('Haqiqatan ham ushbu maqolani oʻchirmoqchimisiz?')) return

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
        showNotification('Maqola muvaffaqiyatli oʻchirildi!')
      }
    } catch (_e) {
      alert('Maqolani oʻchirishda xatolik')
    }
  }

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postContent.trim()) {
      alert('Post matni toʻldirilishi majburiy!')
      return
    }

    setSavingPost(true)

    try {
      if (editingPostId) {
        // Update existing post
        const res = await fetch('/api/admin/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update',
            id: editingPostId,
            title: postTitle,
            excerpt: postExcerpt,
            content: postContent,
            coverImageUrl: postCoverUrl,
            locale,
          }),
        })
        const data = await res.json()
        if (res.ok) {
          setPosts((prev) =>
            prev.map((p) =>
              p.id === editingPostId
                ? {
                    ...p,
                    title: postTitle || 'Mavzusiz post',
                    excerpt: postExcerpt,
                    content: postContent,
                    coverImageUrl: postCoverUrl,
                  }
                : p,
            ),
          )
          setPostModalOpen(false)
          showNotification('Maqola muvaffaqiyatli tahrirlandi!')
        } else {
          alert(data.error || 'Tahrirlashda xatolik')
        }
      } else {
        // Create new post
        const formData = new FormData()
        formData.append('title', postTitle)
        formData.append('content', postContent)
        formData.append('excerpt', postExcerpt)
        formData.append('locale', locale)

        if (postCoverUrl) {
          formData.append('coverImageUrl', postCoverUrl)
        }

        const res = await fetch('/api/posts/create', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (res.ok) {
          setPostModalOpen(false)
          showNotification('Yangi maqola muvaffaqiyatli yaratildi!')
          loadAllData()
        } else {
          alert(data.error || 'Post yaratishda xatolik')
        }
      }
    } catch (_e) {
      alert('Saqlashda xatolik')
    } finally {
      setSavingPost(false)
    }
  }

  // Word / PDF doc parser
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsingDoc(true)
    setDocMsg('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.text) {
        setPostContent(data.text)
        setDocMsg(`"${file.name}" faylidan ${data.charCount} ta belgi muvaffaqiyatli ajratib olindi!`)
        if (!postTitle && file.name) {
          setPostTitle(file.name.replace(/\.[^/.]+$/, ''))
        }
      }
    } catch (_err) {
      alert('Faylni oʻqishda xatolik')
    } finally {
      setParsingDoc(false)
    }
  }

  // --- User Functions ---
  const handleOpenEditUser = (u: UserItem) => {
    setEditingUserId(u.id)
    setUserFirstName(u.firstName)
    setUserLastName(u.lastName)
    setUserUsername(u.username)
    setUserPhone(u.phone)
    setUserPassword(u.displayPassword || '')
    setUserModalOpen(true)
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Haqiqatan ham ushbu foydalanuvchini oʻchirmoqchimisiz?')) return

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id))
        showNotification('Foydalanuvchi oʻchirildi!')
      }
    } catch (_e) {
      alert('Foydalanuvchini oʻchirishda xatolik')
    }
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userUsername.trim()) {
      alert('Username kiritilishi shart!')
      return
    }

    setSavingUser(true)

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          id: editingUserId,
          firstName: userFirstName,
          lastName: userLastName,
          username: userUsername,
          phone: userPhone,
          password: userPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUserId
              ? {
                  ...u,
                  firstName: userFirstName,
                  lastName: userLastName,
                  username: userUsername,
                  phone: userPhone,
                  displayPassword: userPassword || u.displayPassword,
                }
              : u,
          ),
        )
        setUserModalOpen(false)
        showNotification('Foydalanuvchi maʼlumotlari va paroli muvaffaqiyatli yangilandi!')
      } else {
        alert(data.error || 'Foydalanuvchini yangilashda xatolik')
      }
    } catch (_e) {
      alert('Server bilan aloqada xatolik')
    } finally {
      setSavingUser(false)
    }
  }

  // --- Comment Functions ---
  const handleDeleteComment = async (id: number) => {
    if (!confirm('Ushbu izohni oʻchirmoqchimisiz?')) return

    try {
      const res = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id))
        showNotification('Izoh oʻchirildi!')
      }
    } catch (_e) {
      alert('Izohni oʻchirishda xatolik')
    }
  }

  // --- Inquiry Functions ---
  const handleDeleteInquiry = async (id: number) => {
    if (!confirm('Ushbu xabarni oʻchirmoqchimisiz?')) return

    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id))
        showNotification('Xabar oʻchirildi!')
      }
    } catch (_e) {
      alert('Xabarni oʻchirishda xatolik')
    }
  }

  if (checkingAuth) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">Administrator tekshirilmoqda...</p>
      </div>
    )
  }

  // Login view if not admin
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-[var(--card)] p-8 rounded-2xl border border-[var(--border)] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/15 border border-[var(--gold)] mx-auto flex items-center justify-center text-[var(--gold)]">
              <Shield className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif font-black text-[var(--foreground)]">
              Admin Boshqaruv Paneli
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              Tizimga administrator hisobi bilan kiring (username: <span className="text-[var(--gold)] font-mono">admin</span>, parol: <span className="text-[var(--gold)] font-mono">admin123</span>)
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 text-xs text-[var(--destructive)] text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Foydalanuvchi nomi</span>
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>Parol</span>
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="admin123"
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[var(--gold)] text-black font-semibold text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{loginLoading ? 'Kirilmoqda...' : 'Admin panelga kirish'}</span>
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)] text-[var(--gold)]">
              <Shield className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-serif font-black text-[var(--foreground)]">
              Admin Boshqaruv Paneli
            </h1>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Maqolalarni yaratish, tahrirlash, oʻchirish hamda foydalanuvchilar va izohlarni boshqarish
          </p>
        </div>

        <div className="flex items-center gap-3">
          {loadingData && (
            <span className="text-xs text-[var(--gold)] font-mono animate-pulse">
              Yuklanmoqda...
            </span>
          )}
          <button
            type="button"
            onClick={handleOpenNewPost}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi post qoʻshish</span>
          </button>
        </div>
      </div>

      {/* Action Notification */}
      {actionMsg && (
        <div className="p-4 rounded-xl bg-[var(--gold)]/10 border border-[var(--gold)]/30 text-xs text-[var(--gold)] flex items-center gap-2 font-medium animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--foreground)]">{posts.length}</div>
            <div className="text-[11px] text-[var(--muted-foreground)]">Jami postlar</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--foreground)]">{users.length}</div>
            <div className="text-[11px] text-[var(--muted-foreground)]">Foydalanuvchilar</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--foreground)]">{comments.length}</div>
            <div className="text-[11px] text-[var(--muted-foreground)]">Jami izohlar</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--foreground)]">{inquiries.length}</div>
            <div className="text-[11px] text-[var(--muted-foreground)]">Murojaatlar (Chat)</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-[var(--gold)] text-black'
              : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Maqolalar ({posts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-[var(--gold)] text-black'
              : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Foydalanuvchilar va Parollar ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'comments'
              ? 'bg-[var(--gold)] text-black'
              : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Izohlar ({comments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'bg-[var(--gold)] text-black'
              : 'text-[var(--foreground)] hover:bg-[var(--secondary)]'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Adminga Xabarlar ({inquiries.length})</span>
        </button>
      </div>

      {/* Tab 1: Posts Management */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Barcha maqolalar roʻyxati
            </h2>
            <button
              type="button"
              onClick={handleOpenNewPost}
              className="flex items-center gap-1.5 text-xs text-[var(--gold)] hover:underline font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yangi post qoʻshish</span>
            </button>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-[var(--border)]">
              {posts.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                  Maqolalar mavjud emas.
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--secondary)]/40 transition-colors">
                    <div className="flex items-start gap-4">
                      {post.coverImageUrl && (
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[var(--border)] bg-black/10">
                          <Image
                            src={post.coverImageUrl}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <h3 className="font-serif font-bold text-sm text-[var(--foreground)]">
                          {post.title}
                        </h3>
                        <p className="text-xs text-[var(--muted-foreground)] line-clamp-2 max-w-xl">
                          {post.excerpt || post.content.slice(0, 150)}...
                        </p>
                        <div className="text-[10px] text-[var(--gold)]">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleOpenEditPost(post)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Tahrirlash</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--destructive)]/30 text-[var(--destructive)] hover:bg-[var(--destructive)]/10 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Oʻchirish</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management with Passwords & Timestamps */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              Barcha foydalanuvchilar (Username va Parollar)
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Admin va boshqa barcha aʼzolarning parollarini shu yerdan koʻrish va oʻzgartirish mumkin
            </p>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--secondary)]/60 text-[var(--foreground)] font-semibold border-b border-[var(--border)]">
                  <tr>
                    <th className="p-3.5">ID</th>
                    <th className="p-3.5">Ism & Familiya</th>
                    <th className="p-3.5">Username</th>
                    <th className="p-3.5 text-[var(--gold)]">Parol</th>
                    <th className="p-3.5">Telefon</th>
                    <th className="p-3.5">Roʻyxatdan oʻtgan vaqti</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--secondary)]/30 transition-colors">
                      <td className="p-3.5 font-mono text-[var(--muted-foreground)]">#{u.id}</td>
                      <td className="p-3.5 font-medium text-[var(--foreground)]">
                        {u.firstName} {u.lastName}
                        {u.username === 'admin' && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] text-[10px] font-bold">
                            ADMIN
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-[var(--foreground)]">@{u.username}</td>
                      <td className="p-3.5 font-mono font-bold text-[var(--gold)] bg-[var(--gold)]/5 px-2.5 py-1 rounded">
                        {u.displayPassword || '******'}
                      </td>
                      <td className="p-3.5 text-[var(--muted-foreground)]">{u.phone}</td>
                      <td className="p-3.5 text-[var(--muted-foreground)]">
                        {new Date(u.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="px-2.5 py-1 rounded bg-[var(--secondary)] hover:text-[var(--gold)] border border-[var(--border)] transition-colors cursor-pointer"
                        >
                          Tahrirlash
                        </button>
                        {u.username !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id)}
                            className="px-2.5 py-1 rounded text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors cursor-pointer"
                          >
                            Oʻchirish
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Comments Management */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Foydalanuvchilar qoldirgan barcha izohlar
          </h2>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm divide-y divide-[var(--border)]">
            {comments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                Izohlar mavjud emas.
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[var(--secondary)]/40 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[var(--foreground)]">
                        {comment.authorName}
                      </span>
                      <span className="text-[10px] text-[var(--gold)]">
                        maqola: «{comment.postTitle}»
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        • {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--foreground)]/90">{comment.body}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="p-1.5 rounded-lg text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors cursor-pointer"
                    title="Izohni oʻchirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Inquiries (Chat with Admin) */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Sayt orqali adminga yuborilgan murojaatlar (Chat)
          </h2>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm divide-y divide-[var(--border)]">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                Hozircha hech qanday murojaat kelib tushmagan.
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-4 flex items-start justify-between gap-4 hover:bg-[var(--secondary)]/40 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-xs text-[var(--foreground)]">{inq.name}</span>
                      <a
                        href={`tel:${inq.phone}`}
                        className="text-xs text-[var(--gold)] hover:underline flex items-center gap-1 font-mono"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{inq.phone}</span>
                      </a>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        {new Date(inq.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--foreground)] leading-relaxed whitespace-pre-wrap bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
                      {inq.message}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteInquiry(inq.id)}
                    className="p-1.5 rounded-lg text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors cursor-pointer"
                    title="Xabarni oʻchirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Post Edit / Create Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                {editingPostId ? 'Maqolani tahrirlash' : 'Yangi maqola qoʻshish'}
              </h3>
              <button
                type="button"
                onClick={() => setPostModalOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                ✕ Yopish
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              {/* Word/PDF Extraction */}
              {!editingPostId && (
                <div className="p-4 rounded-xl bg-[var(--secondary)]/40 border border-dashed border-[var(--gold)]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-[var(--gold)]" />
                      <span>Word (.docx) yoki PDF (.pdf) dan matn ajratib olish</span>
                    </label>
                    {parsingDoc && <span className="text-[10px] text-[var(--gold)] animate-pulse">Oʻqilmoqda...</span>}
                  </div>
                  <input
                    type="file"
                    accept=".docx,.doc,.pdf,.txt"
                    onChange={handleDocUpload}
                    className="block w-full text-xs text-[var(--muted-foreground)] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[var(--gold)] file:text-black cursor-pointer"
                  />
                  {docMsg && <p className="text-[11px] text-[var(--gold)] font-medium">{docMsg}</p>}
                </div>
              )}

              {/* Title (Optional) */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)] flex items-center justify-between">
                  <span>Mavzu (Sarlavha)</span>
                  <span className="text-[10px] text-[var(--muted-foreground)]">Ixtiyoriy</span>
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Masalan: Milliy hududiy boʻlinish (1924 yil)"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-[var(--foreground)]">Muqova rasmi (URL)</label>
                <input
                  type="url"
                  value={postCoverUrl}
                  onChange={(e) => setPostCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">Qisqacha mazmuni</label>
                <textarea
                  rows={2}
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  placeholder="Maqola haqida 1-2 jumlada..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] resize-none"
                />
              </div>

              {/* Content (Required) */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)] flex items-center justify-between">
                  <span className="text-[var(--gold)] font-semibold">Post haqida (Toʻliq matn) *</span>
                  <span className="text-[10px] text-[var(--gold)]">Majburiy</span>
                </label>
                <textarea
                  rows={7}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Tarixiy maqola matnini bu yerga yozing yoki yuqoridagi Word/PDF yuklagich orqali yuklang..."
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium hover:bg-[var(--secondary)] cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={savingPost}
                  className="px-5 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {savingPost ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Edit Modal (Password & Username update) */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-serif font-bold text-[var(--foreground)]">
                Foydalanuvchini tahrirlash (#{editingUserId})
              </h3>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                ✕ Yopish
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--foreground)]">Ism</label>
                  <input
                    type="text"
                    value={userFirstName}
                    onChange={(e) => setUserFirstName(e.target.value)}
                    required
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--foreground)]">Familiya</label>
                  <input
                    type="text"
                    value={userLastName}
                    onChange={(e) => setUserLastName(e.target.value)}
                    required
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">Foydalanuvchi nomi (Username)</label>
                <input
                  type="text"
                  value={userUsername}
                  onChange={(e) => setUserUsername(e.target.value)}
                  required
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] font-mono outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--gold)] flex items-center justify-between">
                  <span>Parol (Yangi parol oʻrnatish)</span>
                  <KeyRound className="w-3.5 h-3.5" />
                </label>
                <input
                  type="text"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                  placeholder="Yangi parol kiriting"
                  className="w-full bg-[var(--background)] border border-[var(--gold)]/50 rounded-lg p-2.5 text-xs text-[var(--foreground)] font-mono outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">Telefon raqam</label>
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  required
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium hover:bg-[var(--secondary)] cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {savingUser ? 'Saqlanmoqda...' : 'Oʻzgarishlarni saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

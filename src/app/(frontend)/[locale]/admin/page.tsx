'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
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
  Globe,
  ImageIcon,
  UserPlus,
} from 'lucide-react'

interface PostItem {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  language?: 'both' | 'uz' | 'kaa'
  titleKaa?: string
  contentKaa?: string
  excerptKaa?: string
  coverImageUrl: string
  createdAt: string
}

interface UserItem {
  id: number
  firstName: string
  lastName: string
  username: string
  phone: string
  role?: string
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
  reply?: string
  repliedAt?: string
  status?: string
  createdAt: string
}

export default function AdminDashboardPage() {
  const t = useTranslations('admin')
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

  // Filter posts by language
  const [postFilterLang, setPostFilterLang] = useState<'all' | 'both' | 'uz' | 'kaa'>('all')

  // Feedback message
  const [actionMsg, setActionMsg] = useState('')

  // Post modal states
  const [postModalOpen, setPostModalOpen] = useState(false)
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [postTitle, setPostTitle] = useState('')
  const [postExcerpt, setPostExcerpt] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postLanguage, setPostLanguage] = useState<'both' | 'uz' | 'kaa'>('both')
  const [separateLangs, setSeparateLangs] = useState(false)
  const [postTitleKaa, setPostTitleKaa] = useState('')
  const [postExcerptKaa, setPostExcerptKaa] = useState('')
  const [postContentKaa, setPostContentKaa] = useState('')

  // Cover image mode: 'device' (kompyuterdan) yoki 'url' (internetdan)
  const [imageSourceMode, setImageSourceMode] = useState<'device' | 'url'>('url')
  const [postCoverUrl, setPostCoverUrl] = useState('')
  const [localImageFile, setLocalImageFile] = useState<File | null>(null)
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null)

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
  const [userRole, setUserRole] = useState<'admin' | 'reader'>('reader')
  const [savingUser, setSavingUser] = useState(false)

  // New Admin creation modal states
  const [newAdminModalOpen, setNewAdminModalOpen] = useState(false)
  const [newAdminFirstName, setNewAdminFirstName] = useState('')
  const [newAdminLastName, setNewAdminLastName] = useState('')
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminPhone, setNewAdminPhone] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'reader'>('admin')
  const [savingNewAdmin, setSavingNewAdmin] = useState(false)

  // Reply modal states
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [replyingInquiry, setReplyingInquiry] = useState<InquiryItem | null>(null)
  const [replyText, setReplyText] = useState('')
  const [savingReply, setSavingReply] = useState(false)

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
      if (data.user && (data.user.role === 'admin' || data.user.username === 'admin')) {
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

      if (!res.ok || (data.reader?.role !== 'admin' && data.reader?.username !== 'admin')) {
        setLoginError(data.error || t('authOnlyAdmin'))
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
    setPostLanguage('both')
    setSeparateLangs(false)
    setPostTitleKaa('')
    setPostExcerptKaa('')
    setPostContentKaa('')
    setImageSourceMode('url')
    setPostCoverUrl('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop')
    setLocalImageFile(null)
    setLocalImagePreview(null)
    setDocMsg('')
    setPostModalOpen(true)
  }

  const handleOpenEditPost = (post: PostItem) => {
    setEditingPostId(post.id)
    setPostTitle(post.title === 'Mavzusiz post' ? '' : post.title)
    setPostExcerpt(post.excerpt)
    setPostContent(post.content)
    setPostLanguage(post.language || 'both')
    setPostTitleKaa(post.titleKaa || '')
    setPostExcerptKaa(post.excerptKaa || '')
    setPostContentKaa(post.contentKaa || '')
    setSeparateLangs(Boolean(post.titleKaa || post.contentKaa))
    setImageSourceMode(post.coverImageUrl ? 'url' : 'device')
    setPostCoverUrl(post.coverImageUrl)
    setLocalImageFile(null)
    setLocalImagePreview(post.coverImageUrl || null)
    setDocMsg('')
    setPostModalOpen(true)
  }

  const handleLocalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLocalImageFile(file)
      setLocalImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDeletePost = async (id: number) => {
    if (!confirm(t('deleteConfirmPost'))) return

    try {
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id))
        showNotification(t('msgPostDeleted'))
      }
    } catch (_e) {
      alert('Maqolani oʻchirishda xatolik')
    }
  }

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault()
    const primaryContent = postLanguage === 'kaa' && postContentKaa ? postContentKaa : postContent
    if (!primaryContent.trim()) {
      alert(t('contentLabel'))
      return
    }

    setSavingPost(true)

    try {
      const formData = new FormData()
      formData.append('title', postTitle)
      formData.append('content', postContent)
      formData.append('excerpt', postExcerpt)
      formData.append('language', postLanguage)

      if (postLanguage === 'both' && separateLangs) {
        formData.append('titleKaa', postTitleKaa)
        formData.append('contentKaa', postContentKaa)
        formData.append('excerptKaa', postExcerptKaa)
      } else if (postLanguage === 'kaa') {
        formData.append('titleKaa', postTitleKaa || postTitle)
        formData.append('contentKaa', postContentKaa || postContent)
        formData.append('excerptKaa', postExcerptKaa || postExcerpt)
      }

      if (imageSourceMode === 'device' && localImageFile) {
        formData.append('imageFile', localImageFile)
      } else if (imageSourceMode === 'url' && postCoverUrl) {
        formData.append('coverImageUrl', postCoverUrl)
      }

      if (editingPostId) {
        formData.append('action', 'update')
        formData.append('id', String(editingPostId))
        const res = await fetch('/api/admin/posts', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (res.ok) {
          setPostModalOpen(false)
          showNotification(t('msgPostUpdated'))
          loadAllData()
        } else {
          alert(data.error || 'Tahrirlashda xatolik')
        }
      } else {
        const res = await fetch('/api/posts/create', {
          method: 'POST',
          body: formData,
        })
        const data = await res.json()
        if (res.ok) {
          setPostModalOpen(false)
          showNotification(t('msgPostCreated'))
          loadAllData()
        } else {
          alert(data.error || 'Post yaratishda xatolik')
        }
      }
    } catch (_e) {
      alert('Xatolik yuz berdi')
    } finally {
      setSavingPost(false)
    }
  }

  // Word/PDF upload extractor
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsingDoc(true)
    setDocMsg(t('docParsing'))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/parse-document', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok && data.text) {
        setPostContent(data.text)
        if (data.title && !postTitle) {
          setPostTitle(data.title)
        }
        setDocMsg(`✓ ${data.fileName}`)
      } else {
        setDocMsg('Faylni oʻqishda xatolik: ' + (data.error || 'Nomaʼlum format'))
      }
    } catch (_err) {
      setDocMsg('Server bilan ulanishda xatolik')
    } finally {
      setParsingDoc(false)
    }
  }

  // --- User Functions ---
  const handleOpenEditUser = (user: UserItem) => {
    setEditingUserId(user.id)
    setUserFirstName(user.firstName)
    setUserLastName(user.lastName)
    setUserUsername(user.username)
    setUserPhone(user.phone)
    setUserRole((user.role as 'admin' | 'reader') || (user.username === 'admin' ? 'admin' : 'reader'))
    setUserPassword(user.displayPassword && user.displayPassword !== '******' ? user.displayPassword : '')
    setUserModalOpen(true)
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm(t('deleteConfirmUser'))) return

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== id))
        showNotification(t('msgUserDeleted'))
      }
    } catch (_e) {
      alert('Foydalanuvchini oʻchirishda xatolik')
    }
  }

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUserId) return

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
          role: userRole,
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
                  role: userRole,
                  displayPassword: userPassword || u.displayPassword,
                }
              : u,
          ),
        )
        setUserModalOpen(false)
        showNotification(t('msgUserUpdated'))
      } else {
        alert(data.error || 'Foydalanuvchini yangilashda xatolik')
      }
    } catch (_e) {
      alert('Server bilan aloqada xatolik')
    } finally {
      setSavingUser(false)
    }
  }

  // --- New Admin Creation Functions ---
  const handleOpenCreateAdmin = () => {
    setNewAdminFirstName('')
    setNewAdminLastName('')
    setNewAdminUsername('')
    setNewAdminPhone('')
    setNewAdminPassword('')
    setNewAdminRole('admin')
    setNewAdminModalOpen(true)
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !newAdminFirstName.trim() ||
      !newAdminLastName.trim() ||
      !newAdminUsername.trim() ||
      !newAdminPhone.trim() ||
      !newAdminPassword.trim()
    ) {
      alert('Barcha maydonlarni toʻldirish majburiy!')
      return
    }

    setSavingNewAdmin(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          firstName: newAdminFirstName,
          lastName: newAdminLastName,
          username: newAdminUsername,
          phone: newAdminPhone,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setUsers((prev) => [data.user, ...prev])
        setNewAdminModalOpen(false)
        showNotification(t('msgAdminCreated'))
      } else {
        alert(data.error || 'Admin qoʻshishda xatolik')
      }
    } catch (_e) {
      alert('Server bilan aloqada xatolik')
    } finally {
      setSavingNewAdmin(false)
    }
  }

  // --- Comment Functions ---
  const handleDeleteComment = async (id: number) => {
    if (!confirm(t('deleteConfirmComment'))) return

    try {
      const res = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id))
        showNotification(t('msgCommentDeleted'))
      }
    } catch (_e) {
      alert('Izohni oʻchirishda xatolik')
    }
  }

  // --- Inquiry Functions ---
  const handleDeleteInquiry = async (id: number) => {
    if (!confirm(t('deleteConfirmInquiry'))) return

    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id }),
      })
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id))
        showNotification(t('msgInquiryDeleted'))
      }
    } catch (_e) {
      alert('Xabarni oʻchirishda xatolik')
    }
  }

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyingInquiry || !replyText.trim()) return

    setSavingReply(true)
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          id: replyingInquiry.id,
          replyText: replyText.trim(),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === replyingInquiry.id
              ? {
                  ...i,
                  reply: replyText.trim(),
                  repliedAt: new Date().toISOString(),
                  status: 'replied',
                }
              : i,
          ),
        )
        setReplyModalOpen(false)
        showNotification(t('msgReplySent'))
      } else {
        alert(data.error || 'Javob yuborishda xatolik')
      }
    } catch (_e) {
      alert('Server bilan aloqada xatolik')
    } finally {
      setSavingReply(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <p className="text-sm text-[var(--muted-foreground)]">{t('checkingAuth')}</p>
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
              {t('loginTitle')}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t('loginSubtitle')} (username: <span className="text-[var(--gold)] font-mono">admin</span>, parol: <span className="text-[var(--gold)] font-mono">admin123</span>)
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
                <span>{t('colUsername')}</span>
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span>{t('colPassword')}</span>
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="admin123"
                required
                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-sm text-[var(--foreground)] outline-none focus:border-[var(--gold)] transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 bg-[var(--gold)] text-black font-semibold text-sm rounded-xl hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>{loginLoading ? t('loading') : t('enterAdmin')}</span>
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
              {t('title')}
            </h1>
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {loadingData && (
            <span className="text-xs text-[var(--gold)] font-mono animate-pulse">
              {t('loading')}
            </span>
          )}
          <button
            type="button"
            onClick={handleOpenNewPost}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('newPost')}</span>
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
            <div className="text-[11px] text-[var(--muted-foreground)]">{t('statsPosts')}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--foreground)]">{users.length}</div>
            <div className="text-[11px] text-[var(--muted-foreground)]">{t('statsUsers')}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-500">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--foreground)]">{comments.length}</div>
            <div className="text-[11px] text-[var(--muted-foreground)]">{t('statsComments')}</div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[var(--foreground)]">{inquiries.length}</div>
            <div className="text-[11px] text-[var(--muted-foreground)]">{t('statsInquiries')}</div>
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
          <span>{t('tabPosts')} ({posts.length})</span>
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
          <span>{t('tabUsers')} ({users.length})</span>
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
          <span>{t('tabComments')} ({comments.length})</span>
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
          <span>{t('tabInquiries')} ({inquiries.length})</span>
        </button>
      </div>

      {/* Tab 1: Posts Management */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {/* Post Language Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--card)] p-3 rounded-xl border border-[var(--border)]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--gold)]" />
              <span className="text-xs font-semibold text-[var(--foreground)]">{t('languageLabel')}:</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['all', 'both', 'uz', 'kaa'] as const).map((lCode) => (
                <button
                  key={lCode}
                  type="button"
                  onClick={() => setPostFilterLang(lCode)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    postFilterLang === lCode
                      ? 'bg-[var(--gold)] text-black font-semibold'
                      : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {lCode === 'all'
                    ? t('filterAll')
                    : lCode === 'both'
                      ? t('filterBoth')
                      : lCode === 'uz'
                        ? t('filterUz')
                        : t('filterKaa')}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-[var(--border)]">
              {posts.filter((p) => {
                if (postFilterLang === 'all') return true
                if (postFilterLang === 'both') return p.language === 'both' || !p.language
                return p.language === postFilterLang
              }).length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                  {t('noComments')}
                </div>
              ) : (
                posts
                  .filter((p) => {
                    if (postFilterLang === 'all') return true
                    if (postFilterLang === 'both') return p.language === 'both' || !p.language
                    return p.language === postFilterLang
                  })
                  .map((post) => (
                  <div
                    key={post.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--secondary)]/30 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {post.coverImageUrl && (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden shrink-0 border border-[var(--border)] bg-[var(--secondary)]">
                          <Image
                            src={post.coverImageUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-sm text-[var(--foreground)]">
                            {post.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              post.language === 'uz'
                                ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                : post.language === 'kaa'
                                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                  : 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20'
                            }`}
                          >
                            {post.language === 'uz'
                              ? '🇺🇿 Oʻzbekcha'
                              : post.language === 'kaa'
                                ? '🇬🇪 Qaraqalpaqsha'
                                : '🌐 Ikkala til'}
                          </span>
                        </div>
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
                        <span>{t('edit')}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[var(--destructive)]/30 text-[var(--destructive)] hover:bg-[var(--destructive)]/10 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t('delete')}</span>
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-[var(--foreground)]">
                {t('usersTitle')}
              </h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                {t('usersSubtitle')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateAdmin}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('addAdmin')}</span>
            </button>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--secondary)]/60 text-[var(--foreground)] font-semibold border-b border-[var(--border)]">
                  <tr>
                    <th className="p-3.5">{t('colId')}</th>
                    <th className="p-3.5">{t('colName')}</th>
                    <th className="p-3.5">{t('colUsername')}</th>
                    <th className="p-3.5">{t('role')}</th>
                    <th className="p-3.5 text-[var(--gold)]">{t('colPassword')}</th>
                    <th className="p-3.5">{t('colPhone')}</th>
                    <th className="p-3.5">{t('colRegistered')}</th>
                    <th className="p-3.5 text-right">{t('colActions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-[var(--secondary)]/30 transition-colors">
                      <td className="p-3.5 font-mono text-[var(--muted-foreground)]">#{u.id}</td>
                      <td className="p-3.5 font-medium text-[var(--foreground)]">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="p-3.5 font-mono text-[var(--foreground)]">@{u.username}</td>
                      <td className="p-3.5">
                        {u.role === 'admin' || u.username === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--gold)]/20 text-[var(--gold)] text-[10px] font-bold border border-[var(--gold)]/30">
                            👑 {t('roleAdmin')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--secondary)] text-[var(--muted-foreground)] text-[10px] font-medium border border-[var(--border)]">
                            {t('roleReader')}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 font-mono text-[var(--foreground)]">@{u.username}</td>
                      <td className="p-3.5 font-mono font-bold text-[var(--gold)] bg-[var(--gold)]/5 px-2.5 py-1 rounded">
                        {u.displayPassword || '******'}
                      </td>
                      <td className="p-3.5 text-[var(--muted-foreground)] font-mono">{u.phone}</td>
                      <td className="p-3.5 text-[var(--muted-foreground)]">
                        {new Date(u.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="px-2.5 py-1 rounded bg-[var(--secondary)] hover:text-[var(--gold)] border border-[var(--border)] transition-colors cursor-pointer"
                        >
                          {t('edit')}
                        </button>
                        {u.username !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u.id)}
                            className="px-2.5 py-1 rounded text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors cursor-pointer"
                          >
                            {t('delete')}
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
            {t('tabComments')}
          </h2>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm divide-y divide-[var(--border)]">
            {comments.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                {t('noComments')}
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
                        «{comment.postTitle}»
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
                    title={t('delete')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Inquiries (Chat with Admin + Replies) */}
      {activeTab === 'inquiries' && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            {t('tabInquiries')}
          </h2>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-sm divide-y divide-[var(--border)]">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--muted-foreground)]">
                {t('noInquiries')}
              </div>
            ) : (
              inquiries.map((inq) => (
                <div key={inq.id} className="p-4 flex flex-col sm:flex-row items-start justify-between gap-4 hover:bg-[var(--secondary)]/40 transition-colors">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
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
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                        inq.status === 'replied' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                      }`}>
                        {inq.status === 'replied' ? t('repliedStatus') : t('waitingStatus')}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--foreground)] leading-relaxed whitespace-pre-wrap bg-[var(--background)] p-3 rounded-lg border border-[var(--border)]">
                      {inq.message}
                    </p>

                    {inq.reply && (
                      <div className="mt-2 p-3 rounded-lg bg-[var(--gold)]/10 border border-[var(--gold)]/30 space-y-1 text-xs">
                        <div className="text-[11px] font-bold text-[var(--gold)] flex items-center justify-between">
                          <span>{t('adminReply')}</span>
                          {inq.repliedAt && (
                            <span className="font-normal text-[10px] text-[var(--muted-foreground)]">
                              {new Date(inq.repliedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">{inq.reply}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingInquiry(inq)
                        setReplyText(inq.reply || '')
                        setReplyModalOpen(true)
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)]/10 text-xs font-medium transition-colors cursor-pointer"
                      title={t('reply')}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t('reply')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteInquiry(inq.id)}
                      className="p-1.5 rounded-lg text-[var(--destructive)] hover:bg-[var(--destructive)]/10 transition-colors cursor-pointer"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModalOpen && replyingInquiry && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-serif font-bold text-[var(--foreground)]">
                {t('reply')} — {replyingInquiry.name} ({replyingInquiry.phone})
              </h3>
              <button
                type="button"
                onClick={() => setReplyModalOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                ✕ {t('cancel')}
              </button>
            </div>

            <div className="p-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-xs text-[var(--muted-foreground)]">
              <p className="whitespace-pre-wrap">{replyingInquiry.message}</p>
            </div>

            <form onSubmit={handleSendReply} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[var(--gold)]">
                  {t('adminReply')}
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={t('replyPlaceholder')}
                  rows={4}
                  required
                  className="w-full bg-[var(--background)] border border-[var(--gold)]/40 rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium hover:bg-[var(--secondary)] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingReply}
                  className="px-5 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {savingReply ? t('saving') : t('sendReply')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Edit / Create Modal */}
      {postModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-3xl w-full p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                {editingPostId ? t('postEditTitle') : t('postCreateTitle')}
              </h3>
              <button
                type="button"
                onClick={() => setPostModalOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                ✕ {t('cancel')}
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-4">
              {/* Language Selection */}
              <div className="space-y-2 p-3.5 rounded-xl bg-[var(--secondary)]/40 border border-[var(--border)]">
                <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>{t('languageLabel')}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPostLanguage('both')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      postLanguage === 'both'
                        ? 'bg-[var(--gold)]/15 border-[var(--gold)] text-[var(--gold)] font-bold'
                        : 'border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {t('langBoth')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostLanguage('uz')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      postLanguage === 'uz'
                        ? 'bg-blue-500/15 border-blue-500 text-blue-500 font-bold'
                        : 'border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {t('langUz')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPostLanguage('kaa')}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                      postLanguage === 'kaa'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-500 font-bold'
                        : 'border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    {t('langKaa')}
                  </button>
                </div>

                {postLanguage === 'both' && (
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="separateLangsCheckbox"
                      checked={separateLangs}
                      onChange={(e) => setSeparateLangs(e.target.checked)}
                      className="rounded border-[var(--border)] text-[var(--gold)] focus:ring-[var(--gold)] cursor-pointer"
                    />
                    <label
                      htmlFor="separateLangsCheckbox"
                      className="text-xs text-[var(--muted-foreground)] cursor-pointer select-none"
                    >
                      {t('separateTranslation')}
                    </label>
                  </div>
                )}
              </div>

              {/* Cover Image Selector (Device / URL) */}
              <div className="space-y-2.5 p-3.5 rounded-xl bg-[var(--secondary)]/40 border border-[var(--border)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[var(--gold)]" />
                    <span>{t('imageSource')}</span>
                  </label>
                  <div className="flex items-center gap-1 bg-[var(--background)] p-1 rounded-lg border border-[var(--border)] self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('device')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        imageSourceMode === 'device'
                          ? 'bg-[var(--gold)] text-black font-semibold'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {t('fromDevice')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageSourceMode('url')}
                      className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        imageSourceMode === 'url'
                          ? 'bg-[var(--gold)] text-black font-semibold'
                          : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                      }`}
                    >
                      {t('fromInternet')}
                    </button>
                  </div>
                </div>

                {imageSourceMode === 'device' ? (
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLocalImageChange}
                      className="block w-full text-xs text-[var(--muted-foreground)] file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[var(--gold)] file:text-black cursor-pointer"
                    />
                    {localImageFile && (
                      <div className="flex items-center gap-2 text-xs text-[var(--gold)] font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {localImageFile.name} ({(localImageFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="url"
                      value={postCoverUrl}
                      onChange={(e) => {
                        setPostCoverUrl(e.target.value)
                        setLocalImagePreview(e.target.value)
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
                    />
                  </div>
                )}

                {(localImagePreview || postCoverUrl) && (
                  <div className="relative w-full h-36 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--background)]">
                    <Image
                      src={localImagePreview || postCoverUrl}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              {/* Word/PDF Extraction */}
              {!editingPostId && (
                <div className="p-3.5 rounded-xl bg-[var(--secondary)]/40 border border-dashed border-[var(--gold)]/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1.5">
                      <FileUp className="w-4 h-4 text-[var(--gold)]" />
                      <span>{t('docUploadLabel')}</span>
                    </label>
                    {parsingDoc && (
                      <span className="text-[10px] text-[var(--gold)] animate-pulse">
                        {t('docParsing')}
                      </span>
                    )}
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

              {/* Content Form Fields */}
              {postLanguage === 'both' && separateLangs ? (
                <div className="space-y-4">
                  {/* Uzbek section */}
                  <div className="p-3.5 rounded-xl border border-blue-500/30 bg-blue-500/5 space-y-3">
                    <div className="text-xs font-bold text-blue-500 flex items-center gap-1">
                      <span>🇺🇿 {t('filterUz')}</span>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--foreground)]">
                        {t('titleUz')}
                      </label>
                      <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="Oʻzbekcha sarlavha..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--foreground)]">
                        {t('excerptUz')}
                      </label>
                      <textarea
                        rows={2}
                        value={postExcerpt}
                        onChange={(e) => setPostExcerpt(e.target.value)}
                        placeholder="Qisqacha mazmun..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-blue-500 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-blue-500 flex items-center justify-between">
                        <span>{t('contentUz')}</span>
                        <span className="text-[10px] text-blue-500">{t('required')}</span>
                      </label>
                      <textarea
                        rows={5}
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Oʻzbekcha toʻliq matn..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--foreground)] outline-none focus:border-blue-500 leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Karakalpak section */}
                  <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-3">
                    <div className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <span>🇬🇪 {t('filterKaa')}</span>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--foreground)]">
                        {t('titleKaa')}
                      </label>
                      <input
                        type="text"
                        value={postTitleKaa}
                        onChange={(e) => setPostTitleKaa(e.target.value)}
                        placeholder="Qaraqalpaqsha sarlavha..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-[var(--foreground)]">
                        {t('excerptKaa')}
                      </label>
                      <textarea
                        rows={2}
                        value={postExcerptKaa}
                        onChange={(e) => setPostExcerptKaa(e.target.value)}
                        placeholder="Qısqasha mazmunı..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-emerald-500 resize-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-emerald-500 flex items-center justify-between">
                        <span>{t('contentKaa')}</span>
                        <span className="text-[10px] text-emerald-500">{t('required')}</span>
                      </label>
                      <textarea
                        rows={5}
                        value={postContentKaa}
                        onChange={(e) => setPostContentKaa(e.target.value)}
                        placeholder="Qaraqalpaqsha tolıq tekst..."
                        className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--foreground)] outline-none focus:border-emerald-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Title (Optional) */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)] flex items-center justify-between">
                      <span>
                        {postLanguage === 'kaa'
                          ? t('titleKaa')
                          : postLanguage === 'uz'
                            ? t('titleUz')
                            : t('postTitleLabel')}
                      </span>
                      <span className="text-[10px] text-[var(--muted-foreground)]">
                        {t('optional')}
                      </span>
                    </label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Mavzu (Sarlavha)..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                    />
                  </div>

                  {/* Excerpt */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)]">
                      {t('excerptLabel')}
                    </label>
                    <textarea
                      rows={2}
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder="..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] resize-none"
                    />
                  </div>

                  {/* Content (Required) */}
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[var(--foreground)] flex items-center justify-between">
                      <span className="text-[var(--gold)] font-semibold">
                        {postLanguage === 'kaa' ? t('contentKaa') : t('contentLabel')}
                      </span>
                      <span className="text-[10px] text-[var(--gold)]">{t('required')}</span>
                    </label>
                    <textarea
                      rows={7}
                      required
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="..."
                      className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-3 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] leading-relaxed"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setPostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium hover:bg-[var(--secondary)] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingPost}
                  className="px-5 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {savingPost ? t('saving') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Edit Modal (Password & Role & Details update) */}
      {userModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <h3 className="text-base font-serif font-bold text-[var(--foreground)]">
                {t('userEditTitle')} (#{editingUserId})
              </h3>
              <button
                type="button"
                onClick={() => setUserModalOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                ✕ {t('cancel')}
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--foreground)]">
                    {t('firstName')}
                  </label>
                  <input
                    type="text"
                    value={userFirstName}
                    onChange={(e) => setUserFirstName(e.target.value)}
                    required
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--foreground)]">
                    {t('lastName')}
                  </label>
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
                <label className="text-xs font-medium text-[var(--foreground)]">
                  {t('colUsername')}
                </label>
                <input
                  type="text"
                  value={userUsername}
                  onChange={(e) => setUserUsername(e.target.value)}
                  required
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] font-mono outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">{t('role')}</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as 'admin' | 'reader')}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                >
                  <option value="admin">👑 {t('roleAdmin')}</option>
                  <option value="reader">{t('roleReader')}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--gold)] flex items-center justify-between">
                  <span>{t('passwordLabel')}</span>
                  <KeyRound className="w-3.5 h-3.5" />
                </label>
                <input
                  type="text"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  required
                  placeholder="Yangi parol"
                  className="w-full bg-[var(--background)] border border-[var(--gold)]/50 rounded-lg p-2.5 text-xs text-[var(--foreground)] font-mono outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">
                  {t('colPhone')}
                </label>
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
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingUser}
                  className="px-5 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {savingUser ? t('saving') : t('saveChanges')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Admin Creation Modal */}
      {newAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[var(--gold)]/20 text-[var(--gold)]">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif font-bold text-[var(--foreground)]">
                  {t('adminModalTitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNewAdminModalOpen(false)}
                className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer"
              >
                ✕ {t('cancel')}
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--foreground)]">
                    {t('firstName')} *
                  </label>
                  <input
                    type="text"
                    value={newAdminFirstName}
                    onChange={(e) => setNewAdminFirstName(e.target.value)}
                    required
                    placeholder="Ism"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-[var(--foreground)]">
                    {t('lastName')} *
                  </label>
                  <input
                    type="text"
                    value={newAdminLastName}
                    onChange={(e) => setNewAdminLastName(e.target.value)}
                    required
                    placeholder="Familiya"
                    className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">
                  {t('colUsername')} (Login) *
                </label>
                <input
                  type="text"
                  value={newAdminUsername}
                  onChange={(e) => setNewAdminUsername(e.target.value)}
                  required
                  placeholder="masalan: admin2"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] font-mono outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--gold)] flex items-center justify-between">
                  <span>{t('colPassword')} *</span>
                  <KeyRound className="w-3.5 h-3.5" />
                </label>
                <input
                  type="text"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  required
                  placeholder="Parol kiriting"
                  className="w-full bg-[var(--background)] border border-[var(--gold)]/50 rounded-lg p-2.5 text-xs text-[var(--foreground)] font-mono outline-none focus:border-[var(--gold)]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">
                  {t('colPhone')} *
                </label>
                <input
                  type="text"
                  value={newAdminPhone}
                  onChange={(e) => setNewAdminPhone(e.target.value)}
                  required
                  placeholder="+998901234567"
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[var(--foreground)]">{t('role')}</label>
                <select
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'reader')}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-lg p-2.5 text-xs text-[var(--foreground)] outline-none focus:border-[var(--gold)] font-medium"
                >
                  <option value="admin">👑 {t('roleAdmin')} (Barcha huquqlar)</option>
                  <option value="reader">{t('roleReader')}</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setNewAdminModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium hover:bg-[var(--secondary)] cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingNewAdmin}
                  className="px-5 py-2 bg-[var(--gold)] text-black font-semibold text-xs rounded-xl hover:brightness-110 transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  {savingNewAdmin ? t('saving') : t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

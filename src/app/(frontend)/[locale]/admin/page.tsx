'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import {
  Users,
  FileText,
  Shield,
  KeyRound,
  Plus,
  Trash2,
  Edit3,
  Search,
  Upload,
  Globe,
  FileUp,
  LogOut,
  Sun,
  Moon,
  Check,
  AlertCircle,
  X,
  Lock,
  RefreshCw,
  UserCheck,
  Ban,
  ArrowLeft,
} from 'lucide-react'

interface AdminUser {
  id: number
  displayName: string
  username: string
  email?: string | null
  role: string
  isActive?: boolean
  createdAt?: string
}

interface PostItem {
  id: number
  title?: string | null
  slug?: string | null
  content?: string | null
  excerpt?: string | null
  coverImageUrl?: string | null
  coverImage?: { id?: number; url?: string; filename?: string } | number | null
  language?: string | null
  workflowStatus?: string | null
  _status?: string | null
  publishedAt?: string | null
  createdAt?: string
}

interface ReaderItem {
  id: number
  displayName: string
  username?: string | null
  email?: string | null
  isBanned?: boolean | null
  _verified?: boolean | null
  createdAt?: string
}

export default function CustomAdminPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (params?.locale as string) || 'uz'
  const { theme, setTheme } = useTheme()

  // Auth state
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Active section tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'admins' | 'readers'>('dashboard')

  // Stats
  const [stats, setStats] = useState({ readersCount: 0, postsCount: 0, adminsCount: 0 })

  // Lists
  const [posts, setPosts] = useState<PostItem[]>([])
  const [postsLoading, setPostsLoading] = useState(false)
  const [postSearch, setPostSearch] = useState('')

  const [staffList, setStaffList] = useState<AdminUser[]>([])
  const [readersList, setReadersList] = useState<ReaderItem[]>([])
  const [readerSearch, setReaderSearch] = useState('')

  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 4000)
  }

  // --- Post Form State ---
  const [editingPostId, setEditingPostId] = useState<number | null>(null)
  const [postTitle, setPostTitle] = useState('')
  const [postContent, setPostContent] = useState('')
  const [postExcerpt, setPostExcerpt] = useState('')
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload')
  const [postImageUrl, setPostImageUrl] = useState('')
  const [postImageId, setPostImageId] = useState<number | null>(null)
  const [postImagePreview, setPostImagePreview] = useState('')
  const [postLanguage, setPostLanguage] = useState<'both' | 'uz' | 'kaa'>('both')
  const [postStatus, setPostStatus] = useState<'published' | 'draft'>('published')
  const [savingPost, setSavingPost] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [parsingDoc, setParsingDoc] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  // --- Password Change Card State ---
  const [pwdTarget, setPwdTarget] = useState<string>('')
  const [pwdNewValue, setPwdNewValue] = useState('')
  const [updatingPwd, setUpdatingPwd] = useState(false)

  // --- New Admin Card State ---
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminUsername, setNewAdminUsername] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'editor'>('admin')
  const [savingAdmin, setSavingAdmin] = useState(false)

  // --- Reader Edit Modal State ---
  const [editingReader, setEditingReader] = useState<ReaderItem | null>(null)
  const [editReaderName, setEditReaderName] = useState('')
  const [editReaderEmail, setEditReaderEmail] = useState('')
  const [editReaderPassword, setEditReaderPassword] = useState('')
  const [editReaderBanned, setEditReaderBanned] = useState(false)
  const [savingReader, setSavingReader] = useState(false)

  // 1. Check current admin session
  const checkAuth = useCallback(async () => {
    try {
      setAuthLoading(true)
      const res = await fetch('/api/admin/auth')
      const data = await res.json()
      if (data.user) {
        setCurrentUser(data.user)
      } else {
        setCurrentUser(null)
      }
    } catch {
      setCurrentUser(null)
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // 2. Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // ignore
    }
  }, [])

  // 3. Fetch posts
  const fetchPosts = useCallback(async (q = '') => {
    try {
      setPostsLoading(true)
      const url = q ? `/api/admin/posts?q=${encodeURIComponent(q)}` : '/api/admin/posts'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setPosts(data.docs || [])
      }
    } catch {
      // ignore
    } finally {
      setPostsLoading(false)
    }
  }, [])

  // 4. Fetch staff
  const fetchStaff = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/staff')
      if (res.ok) {
        const data = await res.json()
        setStaffList(data || [])
      }
    } catch {
      // ignore
    }
  }, [])

  // 5. Fetch readers
  const fetchReaders = useCallback(async (q = '') => {
    try {
      const url = q ? `/api/admin/readers?q=${encodeURIComponent(q)}` : '/api/admin/readers'
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setReadersList(data.docs || [])
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (currentUser) {
      fetchStats()
      fetchPosts()
      fetchStaff()
      fetchReaders()
    }
  }, [currentUser, fetchStats, fetchPosts, fetchStaff, fetchReaders])

  // Search debounces
  useEffect(() => {
    if (!currentUser) return
    const timer = setTimeout(() => {
      fetchPosts(postSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [postSearch, currentUser, fetchPosts])

  useEffect(() => {
    if (!currentUser) return
    const timer = setTimeout(() => {
      fetchReaders(readerSearch)
    }, 300)
    return () => clearTimeout(timer)
  }, [readerSearch, currentUser, fetchReaders])

  // Handlers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoggingIn(true)
    setLoginError('')

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setCurrentUser(data.user)
        fetchStats()
        fetchPosts()
        fetchStaff()
        fetchReaders()
      } else {
        setLoginError(data.error || 'Kirishda xatolik yuz berdi')
      }
    } catch {
      setLoginError('Server bilan aloqa uzildi')
    } finally {
      setLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      setCurrentUser(null)
      showToast('Tizimdan chiqildi')
    } catch {
      // ignore
    }
  }

  // Rasm yuklash (Kompyuterdan tanlash yoki Drag & Drop)
  const uploadImageFile = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Faqat rasm fayli yuklanishi kerak (PNG, JPG, WebP)', 'error')
      return
    }

    setUploadingImage(true)

    // 1. Darhol ko'rsatish uchun Base64 Data URL yaratish
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      if (dataUrl) {
        setPostImagePreview(dataUrl)
      }
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('altText', postTitle || file.name)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.url) {
        setPostImageId(data.id || null)
        setPostImageUrl(data.url)
        setPostImagePreview(data.url)
        showToast('Rasm muvaffaqiyatli yuklandi!')
      } else {
        // Server faylni saqlay olmasa ham (masalan, read-only muhit),
        // brauzerdagi data URL coverImageUrl sifatida saqlanadi
        const fallbackReader = new FileReader()
        fallbackReader.onload = (ev) => {
          const dataUrl = ev.target?.result as string
          if (dataUrl) {
            setPostImageUrl(dataUrl)
            setPostImagePreview(dataUrl)
            setPostImageId(null)
            showToast('Rasm tayyorlandi!')
          }
        }
        fallbackReader.readAsDataURL(file)
      }
    } catch {
      const fallbackReader = new FileReader()
      fallbackReader.onload = (ev) => {
        const dataUrl = ev.target?.result as string
        if (dataUrl) {
          setPostImageUrl(dataUrl)
          setPostImagePreview(dataUrl)
          setPostImageId(null)
          showToast('Rasm yuklandi!')
        }
      }
      fallbackReader.readAsDataURL(file)
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) uploadImageFile(file)
  }

  // Word / PDF / TXT fayldan matn import qilish
  const handleDocumentImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsingDoc(true)
    try {
      // .txt faylni brauzerda to'g'ridan-to'g'ri o'qish
      if (file.name.toLowerCase().endsWith('.txt')) {
        const text = await file.text()
        if (text) {
          setPostContent(text)
          if (!postTitle) {
            const firstLine = text.split('\n')[0]?.slice(0, 100) || file.name.replace(/\.[^/.]+$/, '')
            setPostTitle(firstLine)
          }
          showToast('Matn muvaffaqiyatli import qilindi!')
          return
        }
      }

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/parse-document', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.text) {
        setPostContent(data.text)
        if (!postTitle) {
          const firstLine = data.text.split('\n')[0]?.slice(0, 100) || file.name.replace(/\.[^/.]+$/, '')
          setPostTitle(firstLine)
        }
        showToast('Word fayli matni muvaffaqiyatli import qilindi!')
      } else {
        showToast(data.error || 'Faylni oʻqishda xatolik yuz berdi', 'error')
      }
    } catch {
      showToast('Faylni import qilishda xatolik yuz berdi', 'error')
    } finally {
      setParsingDoc(false)
      if (docInputRef.current) docInputRef.current.value = ''
    }
  }

  // Postni saqlash (Yangi yoki tahrirlash)
  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!postTitle.trim()) {
      showToast('Post mavzusini kiriting', 'error')
      return
    }

    setSavingPost(true)
    try {
      const payloadData = {
        title: postTitle,
        content: postContent,
        excerpt: postExcerpt,
        coverImageUrl: postImageUrl || (imageMode === 'url' ? postImageUrl : ''),
        coverImageId: postImageId || null,
        language: postLanguage,
        status: postStatus,
      }

      const url = editingPostId ? `/api/admin/posts/${editingPostId}` : '/api/admin/posts'
      const method = editingPostId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadData),
      })
      const data = await res.json()

      if (res.ok) {
        showToast(editingPostId ? 'Post muvaffaqiyatli yangilandi!' : 'Yangi post chop etildi!')
        resetPostForm()
        fetchPosts()
        fetchStats()
      } else {
        showToast(data.error || 'Postni saqlashda xatolik', 'error')
      }
    } catch {
      showToast('Saqlashda xatolik yuz berdi', 'error')
    } finally {
      setSavingPost(false)
    }
  }

  const resetPostForm = () => {
    setEditingPostId(null)
    setPostTitle('')
    setPostContent('')
    setPostExcerpt('')
    setPostImageUrl('')
    setPostImageId(null)
    setPostImagePreview('')
    setPostLanguage('both')
    setPostStatus('published')
  }

  const handleEditPost = (post: PostItem) => {
    setEditingPostId(post.id)
    setPostTitle(post.title || '')
    setPostContent(post.content || '')
    setPostExcerpt(post.excerpt || '')
    const coverUrl =
      typeof post.coverImage === 'object' && post.coverImage?.url
        ? post.coverImage.url
        : post.coverImageUrl || ''
    setPostImageUrl(coverUrl)
    setPostImagePreview(coverUrl)
    setPostImageId(typeof post.coverImage === 'number' ? post.coverImage : post.coverImage?.id || null)
    setImageMode(coverUrl ? 'url' : 'upload')
    setPostLanguage((post.language as 'both' | 'uz' | 'kaa') || 'both')
    setPostStatus(post.workflowStatus === 'published' ? 'published' : 'draft')
    window.scrollTo({ top: 380, behavior: 'smooth' })
  }

  const handleDeletePost = async (id: number) => {
    if (!window.confirm('Haqiqatan ham bu postni oʻchirmoqchimisiz?')) return
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Post muvaffaqiyatli oʻchirildi')
        fetchPosts()
        fetchStats()
        if (editingPostId === id) resetPostForm()
      } else {
        showToast('Oʻchirishda xatolik yuz berdi', 'error')
      }
    } catch {
      showToast('Oʻchirishda xatolik', 'error')
    }
  }

  // Parol yangilash
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwdTarget || !pwdNewValue.trim()) {
      showToast('Foydalanuvchi va yangi parolni kiriting', 'error')
      return
    }

    setUpdatingPwd(true)
    try {
      const [type, rawId] = pwdTarget.split(':')
      const targetId = parseInt(rawId, 10)

      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id: targetId, newPassword: pwdNewValue.trim() }),
      })
      const data = await res.json()

      if (res.ok) {
        showToast('Parol muvaffaqiyatli yangilandi!')
        setPwdNewValue('')
        setPwdTarget('')
      } else {
        showToast(data.error || 'Parolni yangilashda xatolik', 'error')
      }
    } catch {
      showToast('Xatolik yuz berdi', 'error')
    } finally {
      setUpdatingPwd(false)
    }
  }

  // Yangi admin qo'shish
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminName.trim() || !newAdminUsername.trim() || !newAdminPassword.trim()) {
      showToast('Barcha maydonlarni toʻldiring', 'error')
      return
    }

    setSavingAdmin(true)
    try {
      const res = await fetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: newAdminName,
          username: newAdminUsername,
          email: newAdminEmail || undefined,
          password: newAdminPassword,
          role: newAdminRole,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        showToast('Yangi admin muvaffaqiyatli qoʻshildi!')
        setNewAdminName('')
        setNewAdminUsername('')
        setNewAdminEmail('')
        setNewAdminPassword('')
        fetchStaff()
        fetchStats()
      } else {
        showToast(data.error || 'Admin qoʻshishda xatolik', 'error')
      }
    } catch {
      showToast('Admin qoʻshishda xatolik', 'error')
    } finally {
      setSavingAdmin(false)
    }
  }

  const handleDeleteStaff = async (id: number) => {
    if (id === currentUser?.id) {
      showToast('Oʻz hisobingizni oʻchira olmaysiz!', 'error')
      return
    }
    if (!window.confirm('Bu adminni oʻchirmoqchimisiz?')) return

    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Admin oʻchirildi')
        fetchStaff()
        fetchStats()
      } else {
        showToast('Oʻchirishda xatolik', 'error')
      }
    } catch {
      showToast('Oʻchirishda xatolik', 'error')
    }
  }

  // Reader edit modal
  const handleOpenReaderModal = (reader: ReaderItem) => {
    setEditingReader(reader)
    setEditReaderName(reader.displayName || '')
    setEditReaderEmail(reader.email || '')
    setEditReaderPassword('')
    setEditReaderBanned(reader.isBanned || false)
  }

  const handleSaveReader = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingReader) return

    setSavingReader(true)
    try {
      const res = await fetch(`/api/admin/readers/${editingReader.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: editReaderName,
          email: editReaderEmail,
          password: editReaderPassword.trim() || undefined,
          isBanned: editReaderBanned,
        }),
      })
      const data = await res.json()

      if (res.ok) {
        showToast('Foydalanuvchi maʼlumotlari yangilandi!')
        setEditingReader(null)
        fetchReaders(readerSearch)
      } else {
        showToast(data.error || 'Yangilashda xatolik', 'error')
      }
    } catch {
      showToast('Yangilashda xatolik', 'error')
    } finally {
      setSavingReader(false)
    }
  }

  const handleDeleteReader = async (id: number) => {
    if (!window.confirm('Foydalanuvchini saytdan butunlay oʻchirmoqchimisiz?')) return

    try {
      const res = await fetch(`/api/admin/readers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Foydalanuvchi oʻchirildi')
        fetchReaders(readerSearch)
        fetchStats()
      } else {
        showToast('Oʻchirishda xatolik', 'error')
      }
    } catch {
      showToast('Oʻchirishda xatolik', 'error')
    }
  }

  // --- RENDER ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs uppercase tracking-widest text-muted font-mono">Boshqaruv paneli yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  // Agar admin tizimga kirmagan bo'lsa: Kirish oynasi
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-bg text-fg flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-offset-sm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-primary text-primary-fg flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold font-serif text-fg">HISINF.UZ</h1>
            <p className="text-xs uppercase tracking-widest text-muted font-mono">Boshqaruv Paneli</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-p-brick/10 border border-p-brick/30 text-p-brick text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted">Login yoki Email</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-4 py-3 bg-bg border border-border focus:border-primary rounded-xl text-sm text-fg outline-none transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted">Parol</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-bg border border-border focus:border-primary rounded-xl text-sm text-fg outline-none transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-primary text-primary-fg font-semibold text-sm rounded-xl transition-all shadow-btn hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Kirish</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <a
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Asosiy web saytga qaytish</span>
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Selected target username for the password card
  const selectedPwdItem =
    pwdTarget.startsWith('staff:')
      ? staffList.find((s) => s.id === parseInt(pwdTarget.replace('staff:', ''), 10))
      : readersList.find((r) => r.id === parseInt(pwdTarget.replace('reader:', ''), 10))

  return (
    <div className="min-h-screen bg-bg text-fg font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-teal text-white'
                : 'bg-p-brick text-white'
            }`}
          >
            {toastMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-card border-b border-border sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary text-primary-fg flex items-center justify-center shadow-md">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold font-serif leading-none tracking-tight text-fg">
                HISINF.UZ
              </div>
              <div className="text-[11px] text-muted font-mono tracking-wider mt-1">
                Boshqaruv Paneli
              </div>
            </div>
          </div>

          {/* Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 bg-surface-2 p-1.5 rounded-full border border-border">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-card text-primary font-bold shadow-xs border border-border'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Asosiy</span>
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'posts'
                  ? 'bg-card text-primary font-bold shadow-xs border border-border'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Maqolalar</span>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admins'
                  ? 'bg-card text-primary font-bold shadow-xs border border-border'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Adminlar</span>
            </button>
            <button
              onClick={() => setActiveTab('readers')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'readers'
                  ? 'bg-card text-primary font-bold shadow-xs border border-border'
                  : 'text-muted hover:text-fg'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Foydalanuvchilar</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Asosiy saytga qaytish tugmasi */}
            <a
              href={`/${locale}`}
              className="px-3.5 py-1.5 rounded-full border border-border bg-surface-2 hover:bg-card text-fg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Asosiy web saytga oʻtish"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline">Asosiy web saytga</span>
            </a>

            {/* Lang switch */}
            <div className="flex bg-surface-2 rounded-full p-1 border border-border text-[11px] font-mono">
              <button
                onClick={() => router.push(`/uz/admin`)}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                  locale === 'uz' ? 'bg-primary text-primary-fg font-bold' : 'text-muted hover:text-fg'
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => router.push(`/kaa/admin`)}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                  locale === 'kaa' ? 'bg-primary text-primary-fg font-bold' : 'text-muted hover:text-fg'
                }`}
              >
                KAA
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:text-fg hover:bg-surface-2 cursor-pointer transition-colors"
              title="Tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-p-ochre" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin badge */}
            <div className="hidden sm:flex items-center gap-2 bg-p-ochre/15 border border-p-ochre/30 text-p-ochre px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-p-ochre animate-pulse" />
              <span>{currentUser.displayName}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-p-brick hover:bg-p-brick/10 cursor-pointer transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* TOP ROW: 3 STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Foydalanuvchilar */}
          <div className="bg-card border border-border hover:border-teal rounded-2xl p-6 shadow-offset-sm flex items-center gap-5 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-teal/15 text-teal flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                Dizimnen ótken adamlar
              </div>
              <div className="text-3xl font-extrabold text-fg font-serif mt-1">
                {stats.readersCount}
              </div>
            </div>
          </div>

          {/* Card 2: Barcha maqolalar */}
          <div className="bg-card border border-border hover:border-primary rounded-2xl p-6 shadow-offset-sm flex items-center gap-5 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                Barlıq maqalalar (Postlar)
              </div>
              <div className="text-3xl font-extrabold text-fg font-serif mt-1">
                {stats.postsCount}
              </div>
            </div>
          </div>

          {/* Card 3: Adminlar */}
          <div className="bg-card border border-border hover:border-p-ochre rounded-2xl p-6 shadow-offset-sm flex items-center gap-5 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-p-ochre/15 text-p-ochre flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-muted font-mono">
                Barlıq adminler
              </div>
              <div className="text-3xl font-extrabold text-fg font-serif mt-1">
                {stats.adminsCount}
              </div>
            </div>
          </div>
        </div>

        {/* 2X2 DASHBOARD GRID */}
        {(activeTab === 'dashboard' || activeTab === 'admins' || activeTab === 'readers') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* KARTA 1: FOYDALANUVCHI & ADMIN PAROLLARINI O'ZGARTIRISH */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-offset-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-xl bg-p-brick/15 text-p-brick flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-fg">
                    Foydalanıwshı & Admin Parolların Ózgertiw
                  </h3>
                  <p className="text-[11px] text-muted">
                    Eski parol kórsetilmeydi, bıraq jańa parol ornata alasız.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">
                    Adamdı tańlań:
                  </label>
                  <select
                    value={pwdTarget}
                    onChange={(e) => setPwdTarget(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none cursor-pointer"
                  >
                    <option value="">— Tanlang —</option>
                    <optgroup label="Adminlar (Xodimlar)">
                      {staffList.map((s) => (
                        <option key={`staff:${s.id}`} value={`staff:${s.id}`}>
                          {s.displayName} (@{s.username}) - {s.role}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Sayt foydalanuvchilari (Readers)">
                      {readersList.map((r) => (
                        <option key={`reader:${r.id}`} value={`reader:${r.id}`}>
                          {r.displayName} ({r.email || r.username})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted">
                      Login (Username):
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedPwdItem?.username || selectedPwdItem?.email || ''}
                      placeholder="Login..."
                      className="w-full px-3.5 py-2.5 bg-surface-2 border border-border rounded-xl text-xs text-muted font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted">
                      Parol jaratıw:
                    </label>
                    <input
                      type="text"
                      value={pwdNewValue}
                      onChange={(e) => setPwdNewValue(e.target.value)}
                      required
                      placeholder="Jańa parol..."
                      className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg font-mono outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingPwd}
                  className="w-full py-3 bg-primary text-primary-fg font-semibold text-xs rounded-xl shadow-btn transition-all cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                >
                  {updatingPwd ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Jańalaw (Yangilash)</span>
                </button>
              </form>
            </div>

            {/* KARTA 2: YANGI ADMIN QO'SHISH */}
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-offset-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border">
                <div className="w-8 h-8 rounded-xl bg-teal/15 text-teal flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-fg">
                    Admin / Xodim Qoʻshish
                  </h3>
                  <p className="text-[11px] text-muted">
                    Saytni boshqarish uchun yangi admin yoki muharrir yaratish.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted">Ism-familiya *</label>
                    <input
                      type="text"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      required
                      placeholder="Dildora Alimbetova"
                      className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted">Rol</label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'editor')}
                      className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none cursor-pointer"
                    >
                      <option value="admin">Asosiy Admin</option>
                      <option value="editor">Muharrir (Editor)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted">Login (username) *</label>
                    <input
                      type="text"
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      required
                      placeholder="admin_dildora"
                      className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted">Parol *</label>
                    <input
                      type="text"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg font-mono outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingAdmin}
                  className="w-full py-3 bg-teal text-white font-semibold text-xs rounded-xl shadow-btn transition-all cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                >
                  {savingAdmin ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Kabinet ashıw (Admin qoʻshish)</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* SECTION: POST (MAQOLA) YARATISH VA TAHRIRLASH */}
        {(activeTab === 'dashboard' || activeTab === 'posts') && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* KARTA 3: YANGI POST QO'SHISH */}
            <div className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-offset-sm space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-serif text-fg">
                      {editingPostId ? 'Maqolani Tahrirlash' : 'Jańa Maqola (Post) Qosıw'}
                    </h3>
                    <p className="text-[11px] text-muted">
                      Rasm yuklang yoki URL kiriting, matnni Wordʼdan import qiling yoki yozing.
                    </p>
                  </div>
                </div>

                {editingPostId && (
                  <button
                    onClick={resetPostForm}
                    className="px-3 py-1 bg-surface-2 hover:bg-card border border-border text-fg rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Bekor qilish
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePost} className="space-y-4">
                {/* 1. Post Mavzusi */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-fg">
                    Post mavzusi (Sarlavha) *
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    required
                    placeholder="Masalan: Amir Temurning harbiy yurishlari va davlatchilik siyosati"
                    className="w-full px-4 py-3 bg-bg border border-border focus:border-primary rounded-xl text-sm font-medium text-fg outline-none transition-colors"
                  />
                </div>

                {/* 2. Rasm qo'shish (Drag & Drop + Kompyuterdan + Internet URL) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-fg">
                      Muqova rasmi:
                    </label>
                    {/* Toggle: Upload vs URL */}
                    <div className="flex bg-surface-2 border border-border rounded-lg p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2.5 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                          imageMode === 'upload'
                            ? 'bg-card text-primary font-bold shadow-xs'
                            : 'text-muted hover:text-fg'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Kompyuterdan / Tashlash</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2.5 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                          imageMode === 'url'
                            ? 'bg-card text-primary font-bold shadow-xs'
                            : 'text-muted hover:text-fg'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Internet URL</span>
                      </button>
                    </div>
                  </div>

                  {imageMode === 'upload' ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsDragging(true)
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsDragging(false)
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setIsDragging(false)
                          const file = e.dataTransfer.files?.[0]
                          if (file) uploadImageFile(file)
                        }}
                        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                          isDragging
                            ? 'border-primary bg-primary/10 scale-[1.01]'
                            : 'border-border hover:border-primary bg-bg'
                        }`}
                      >
                        {uploadingImage ? (
                          <div className="flex items-center justify-center gap-2 text-xs text-primary font-medium py-3">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Rasm yuklanmoqda...</span>
                          </div>
                        ) : postImagePreview ? (
                          <div className="flex items-center justify-between gap-3 p-2 bg-card rounded-lg border border-border">
                            <div className="flex items-center gap-3">
                              <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-border shrink-0">
                                <Image src={postImagePreview} alt="Preview" fill className="object-cover" unoptimized />
                              </div>
                              <div className="text-left">
                                <div className="text-xs text-teal font-semibold">✓ Rasm yuklandi</div>
                                <div className="text-[11px] text-muted">Boshqa rasm tashlash yoki tanlash mumkin</div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                setPostImagePreview('')
                                setPostImageUrl('')
                                setPostImageId(null)
                              }}
                              className="p-1.5 rounded-lg text-muted hover:text-p-brick hover:bg-surface-2 transition-colors"
                              title="Rasmni olib tashlash"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-1.5 text-muted py-2">
                            <Upload className="w-8 h-8 mx-auto text-primary/70" />
                            <div className="text-xs font-semibold text-fg">
                              Rasmni bu yerga sudrab tashlang (Drag & Drop)
                            </div>
                            <div className="text-[11px] text-muted">
                              yoki kompyuterdan tanlash uchun bosing (PNG, JPG, WebP)
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="url"
                        value={postImageUrl}
                        onChange={(e) => {
                          setPostImageUrl(e.target.value)
                          setPostImagePreview(e.target.value)
                        }}
                        placeholder="https://example.com/rasm.jpg"
                        className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none font-mono"
                      />
                      {postImagePreview && (
                        <div className="flex items-center gap-2">
                          <div className="relative w-12 h-10 rounded-md overflow-hidden border border-border shrink-0">
                            <Image src={postImagePreview} alt="Preview" fill className="object-cover" unoptimized />
                          </div>
                          <span className="text-xs text-teal font-medium">✓ Rasm havolasi kiritildi</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Cheklovsiz Post Matni & Word Import */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-fg">
                      Post matni (Chegarasiz, xohlagancha matn yozing):
                    </label>

                    {/* Word / Fayl import tugmasi */}
                    <div>
                      <input
                        type="file"
                        ref={docInputRef}
                        accept=".docx,.pdf,.txt,.doc"
                        onChange={handleDocumentImport}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => docInputRef.current?.click()}
                        disabled={parsingDoc}
                        className="px-3.5 py-1.5 bg-surface-2 hover:bg-card text-fg border border-border rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                      >
                        {parsingDoc ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" /> : <FileUp className="w-3.5 h-3.5 text-primary" />}
                        <span>📄 Word (.docx) / Fayldan matn import qilish</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Maqola matnini bu yerga yozing yoki Word faylingizdan import qiling..."
                    className="w-full p-4 bg-bg border border-border focus:border-primary rounded-2xl text-sm leading-relaxed text-fg outline-none resize-y font-serif"
                  />
                  <div className="text-right text-[11px] text-muted font-mono">
                    {postContent.trim() ? `${postContent.trim().split(/\s+/).length} soʻz` : '0 soʻz'}
                  </div>
                </div>

                {/* 4. Til va Holat tanlash */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted">Til</label>
                    <select
                      value={postLanguage}
                      onChange={(e) => setPostLanguage(e.target.value as 'both' | 'uz' | 'kaa')}
                      className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none cursor-pointer"
                    >
                      <option value="both">Ikkala til uchun (Uzbek & Karakalpak)</option>
                      <option value="uz">Faqat Oʻzbekcha</option>
                      <option value="kaa">Faqat Qaraqalpaqsha</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted">Holat</label>
                    <select
                      value={postStatus}
                      onChange={(e) => setPostStatus(e.target.value as 'published' | 'draft')}
                      className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none cursor-pointer"
                    >
                      <option value="published">Chop etish (Darhol saytda koʻrinadi)</option>
                      <option value="draft">Qoralama (Hozircha saytda koʻrinmaydi)</option>
                    </select>
                  </div>
                </div>

                {/* 5. Qisqa tavsif (Anons) */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted">
                    Qisqa anons (Ixtiyoriy, qisqacha mazmun)
                  </label>
                  <input
                    type="text"
                    value={postExcerpt}
                    onChange={(e) => setPostExcerpt(e.target.value)}
                    placeholder="Bosh sahifada koʻrinadigan 1-2 jumlalik qisqa anons..."
                    className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none"
                  />
                </div>

                {/* Saqlash tugmasi */}
                <button
                  type="submit"
                  disabled={savingPost}
                  className="w-full py-3.5 bg-primary text-primary-fg font-semibold text-xs rounded-xl shadow-btn transition-all cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 mt-4"
                >
                  {savingPost ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingPostId ? 'Postni Yangilash' : 'Postni Chop Etish (Saytga Joylash)'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* KARTA 4: MAVJUD POSTLAR RO'YXATI (Table) */}
            <div className="lg:col-span-5 bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-offset-sm flex flex-col space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-teal/15 text-teal flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold font-serif text-fg">
                    Maqolalarni Basqarıw
                  </h3>
                </div>
                <span className="text-xs font-mono text-muted">Jami: {posts.length} ta</span>
              </div>

              {/* Qidiruv */}
              <div className="relative">
                <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Maqolalarni qidirish..."
                  className="w-full pl-9 pr-4 py-2 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none"
                />
              </div>

              {/* Ro'yxat */}
              <div className="flex-1 overflow-y-auto max-h-[560px] divide-y divide-border pr-1">
                {postsLoading ? (
                  <div className="p-8 text-center text-xs text-muted font-mono">Yuklanmoqda...</div>
                ) : posts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted font-mono">Hozircha maqolalar yoʻq</div>
                ) : (
                  posts.map((post) => {
                    const thumbUrl =
                      typeof post.coverImage === 'object' && post.coverImage?.url
                        ? post.coverImage.url
                        : post.coverImageUrl || '/favicon.svg'

                    return (
                      <div key={post.id} className="py-3 flex items-center justify-between gap-3 group hover:bg-surface-2/60 p-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-surface-2 shrink-0 border border-border">
                            <Image src={thumbUrl} alt="" fill className="object-cover" unoptimized />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-fg truncate max-w-[220px]" title={post.title || ''}>
                              {post.title || 'Nomsiz maqola'}
                            </div>
                            <div className="text-[10px] text-muted flex items-center gap-2 mt-0.5">
                              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Qoralama'}</span>
                              <span className={`px-1.5 py-0.2 rounded-full text-[9px] uppercase font-mono ${
                                post._status === 'published' ? 'bg-teal/15 text-teal font-bold' : 'bg-p-ochre/15 text-p-ochre font-bold'
                              }`}>
                                {post._status || 'draft'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-1.5 text-primary hover:bg-primary/10 rounded-lg cursor-pointer transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 text-p-brick hover:bg-p-brick/10 rounded-lg cursor-pointer transition-colors"
                            title="Oʻchirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* SECTION: FOYDALANUVCHILAR RO'YXATI VA TAHRIRLASH */}
        {(activeTab === 'dashboard' || activeTab === 'readers') && (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-offset-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal/15 text-teal flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-fg">
                    Saytdagi Foydalanuvchilar (Readers)
                  </h3>
                  <p className="text-[11px] text-muted">
                    Roʻyxatdan oʻtgan barcha foydalanuvchilarni koʻrish va tahrirlash.
                  </p>
                </div>
              </div>

              {/* Qidiruv */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={readerSearch}
                  onChange={(e) => setReaderSearch(e.target.value)}
                  placeholder="Foydalanuvchi qidirish..."
                  className="w-full pl-9 pr-3 py-1.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none"
                />
              </div>
            </div>

            {/* Readers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-fg">
                <thead className="bg-surface-2 text-muted uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Ism-familiya</th>
                    <th className="px-4 py-3">Email / Login</th>
                    <th className="px-4 py-3">Holat</th>
                    <th className="px-4 py-3">Roʻyxatdan oʻtgan</th>
                    <th className="px-4 py-3 text-right rounded-r-xl">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {readersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted font-mono">
                        Foydalanuvchilar topilmadi
                      </td>
                    </tr>
                  ) : (
                    readersList.map((r) => (
                      <tr key={r.id} className="hover:bg-surface-2/50 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-fg">
                          {r.displayName || 'Nomsiz'}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-muted">
                          {r.email || r.username || '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          {r.isBanned ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-p-brick/15 text-p-brick font-semibold flex items-center gap-1 w-max">
                              <Ban className="w-3 h-3" /> Bloklangan
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-teal/15 text-teal font-semibold flex items-center gap-1 w-max">
                              <UserCheck className="w-3 h-3" /> Faol
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-muted">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1">
                          <button
                            onClick={() => handleOpenReaderModal(r)}
                            className="px-2.5 py-1 text-primary hover:bg-primary/10 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDeleteReader(r.id)}
                            className="p-1 text-p-brick hover:bg-p-brick/10 rounded-lg cursor-pointer"
                            title="Oʻchirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION: ADMINLAR RO'YXATI */}
        {(activeTab === 'dashboard' || activeTab === 'admins') && (
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-offset-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-p-ochre/15 text-p-ochre flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif text-fg">
                    Adminlar va Muharrirlar Roʻyxati
                  </h3>
                  <p className="text-[11px] text-muted">
                    Boshqaruv huquqiga ega barcha xodimlar.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-muted">Jami: {staffList.length} ta</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-fg">
                <thead className="bg-surface-2 text-muted uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Ism-familiya</th>
                    <th className="px-4 py-3">Login</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Rol</th>
                    <th className="px-4 py-3 text-right rounded-r-xl">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-surface-2/50 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-fg">
                        {staff.displayName}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-muted">
                        @{staff.username}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-muted">
                        {staff.email || '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-p-ochre/15 text-p-ochre">
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {staff.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="p-1 text-p-brick hover:bg-p-brick/10 rounded-lg cursor-pointer"
                            title="Oʻchirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* READER EDIT MODAL */}
      {editingReader && (
        <div className="fixed inset-0 z-50 bg-line/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-5 shadow-offset">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-base font-bold font-serif text-fg">
                Foydalanuvchini Tahrirlash
              </h3>
              <button
                onClick={() => setEditingReader(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-fg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReader} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Ism-familiya</label>
                <input
                  type="text"
                  value={editReaderName}
                  onChange={(e) => setEditReaderName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">Email</label>
                <input
                  type="email"
                  value={editReaderEmail}
                  onChange={(e) => setEditReaderEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg font-mono outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted">
                  Yangi parol (faqat oʻzgartirmoqchi boʻlsangiz)
                </label>
                <input
                  type="text"
                  value={editReaderPassword}
                  onChange={(e) => setEditReaderPassword(e.target.value)}
                  placeholder="Yangi parol..."
                  className="w-full px-3.5 py-2.5 bg-bg border border-border focus:border-primary rounded-xl text-xs text-fg font-mono outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="banCheck"
                  checked={editReaderBanned}
                  onChange={(e) => setEditReaderBanned(e.target.checked)}
                  className="rounded border-border text-p-brick focus:ring-p-brick w-4 h-4 cursor-pointer"
                />
                <label htmlFor="banCheck" className="text-xs font-medium text-fg cursor-pointer">
                  Ushbu foydalanuvchini bloklash (Ban)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingReader(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-muted hover:text-fg hover:bg-surface-2 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={savingReader}
                  className="px-5 py-2 bg-primary text-primary-fg font-semibold text-xs rounded-xl shadow-btn hover:opacity-90 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingReader ? 'Saqlanmoqda...' : 'Saqlash'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

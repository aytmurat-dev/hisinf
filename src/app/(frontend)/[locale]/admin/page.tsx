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
  const [parsingDoc, setParsingDoc] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

  // --- Password Change Card State (Top-Left card in screenshot) ---
  const [pwdTarget, setPwdTarget] = useState<string>('') // e.g. "reader:1" or "staff:2"
  const [pwdNewValue, setPwdNewValue] = useState('')
  const [updatingPwd, setUpdatingPwd] = useState(false)

  // --- New Admin Card State (Top-Right card in screenshot) ---
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
      fetchPosts(postSearch)
      fetchStaff()
      fetchReaders(readerSearch)
    }
  }, [currentUser, fetchStats, fetchPosts, fetchStaff, fetchReaders, postSearch, readerSearch])

  // --- Handlers ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoggingIn(true)
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setCurrentUser(data.user)
        showToast('Tizimga muvaffaqiyatli kirdingiz!')
      } else {
        setLoginError(data.error || 'Login yoki parol xato')
      }
    } catch {
      setLoginError('Tarmoq xatosi yuz berdi')
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

  // Laptopdan rasm yuklash
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('altText', postTitle || file.name)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.id) {
        setPostImageId(data.id)
        setPostImageUrl(data.url)
        setPostImagePreview(data.url)
        showToast('Rasm muvaffaqiyatli yuklandi!')
      } else {
        showToast(data.error || 'Rasm yuklashda xatolik', 'error')
      }
    } catch {
      showToast('Rasm yuklashda xatolik yuz berdi', 'error')
    } finally {
      setUploadingImage(false)
    }
  }

  // Word / PDF / TXT fayldan matn import qilish
  const handleDocumentImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParsingDoc(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/parse-document', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (res.ok && data.text) {
        // Matnni qo'shish yoki almashtirish
        setPostContent(data.text)
        if (!postTitle) {
          const firstLine = data.text.split('\n')[0]?.slice(0, 100) || file.name.replace(/\.[^/.]+$/, '')
          setPostTitle(firstLine)
        }
        showToast('Fayl matni muvaffaqiyatli import qilindi!')
      } else {
        showToast(data.error || 'Faylni oʻqishda xatolik', 'error')
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
        coverImageUrl: imageMode === 'url' ? postImageUrl : postImageUrl,
        coverImageId: imageMode === 'upload' ? postImageId : null,
        language: postLanguage,
        status: postStatus,
      }

      let res
      if (editingPostId) {
        res = await fetch(`/api/admin/posts/${editingPostId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadData),
        })
      } else {
        res = await fetch('/api/admin/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payloadData),
        })
      }

      const data = await res.json()
      if (res.ok) {
        showToast(editingPostId ? 'Post muvaffaqiyatli yangilandi!' : 'Post muvaffaqiyatli qoʻshildi!')
        resetPostForm()
        fetchPosts(postSearch)
        fetchStats()
      } else {
        showToast(data.error || 'Xatolik yuz berdi', 'error')
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
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEditPost = (post: PostItem) => {
    setEditingPostId(post.id)
    setPostTitle(post.title || '')
    setPostContent(post.content || '')
    setPostExcerpt(post.excerpt || '')
    const imgUrl =
      typeof post.coverImage === 'object' && post.coverImage?.url
        ? post.coverImage.url
        : post.coverImageUrl || ''
    setPostImageUrl(imgUrl)
    setPostImagePreview(imgUrl)
    if (typeof post.coverImage === 'object' && post.coverImage?.id) {
      setPostImageId(post.coverImage.id)
    } else if (typeof post.coverImage === 'number') {
      setPostImageId(post.coverImage)
    } else {
      setPostImageId(null)
    }
    setPostLanguage((post.language as 'both' | 'uz' | 'kaa') || 'both')
    setPostStatus((post._status as 'published' | 'draft') || 'published')
    setActiveTab('posts')
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const handleDeletePost = async (id: number) => {
    if (!confirm('Ushbu postni oʻchirishga ishonchingiz komilmi?')) return
    try {
      const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Post oʻchirildi')
        fetchPosts(postSearch)
        fetchStats()
      } else {
        showToast('Oʻchirishda xatolik', 'error')
      }
    } catch {
      showToast('Oʻchirishda xatolik yuz berdi', 'error')
    }
  }

  // Parol o'zgartirish (Top-left card)
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwdTarget || !pwdNewValue.trim()) {
      showToast('Shaxsni tanlang va yangi parol kiriting', 'error')
      return
    }

    const [type, idStr] = pwdTarget.split(':')
    setUpdatingPwd(true)
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id: parseInt(idStr, 10), newPassword: pwdNewValue }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Parol muvaffaqiyatli yangilandi!')
        setPwdNewValue('')
      } else {
        showToast(data.error || 'Parolni yangilashda xatolik', 'error')
      }
    } catch {
      showToast('Parolni yangilashda xatolik yuz berdi', 'error')
    } finally {
      setUpdatingPwd(false)
    }
  }

  // Yangi Admin yaratish (Top-right card)
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminName.trim() || !newAdminUsername.trim() || !newAdminPassword.trim()) {
      showToast('Ism, login va parolni toʻldiring', 'error')
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
          email: newAdminEmail,
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
      showToast('Admin qoʻshishda xatolik yuz berdi', 'error')
    } finally {
      setSavingAdmin(false)
    }
  }

  const handleDeleteStaff = async (id: number) => {
    if (!confirm('Ushbu adminni oʻchirishga ishonchingiz komilmi?')) return
    try {
      const res = await fetch(`/api/admin/staff/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        showToast('Admin oʻchirildi')
        fetchStaff()
        fetchStats()
      } else {
        showToast(data.error || 'Xatolik yuz berdi', 'error')
      }
    } catch {
      showToast('Oʻchirishda xatolik yuz berdi', 'error')
    }
  }

  // Reader (Foydalanuvchi) tahrirlash
  const handleOpenReaderModal = (reader: ReaderItem) => {
    setEditingReader(reader)
    setEditReaderName(reader.displayName || '')
    setEditReaderEmail(reader.email || '')
    setEditReaderPassword('')
    setEditReaderBanned(Boolean(reader.isBanned))
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
          password: editReaderPassword || undefined,
          isBanned: editReaderBanned,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('Foydalanuvchi maʼlumotlari yangilandi!')
        setEditingReader(null)
        fetchReaders(readerSearch)
      } else {
        showToast(data.error || 'Xatolik yuz berdi', 'error')
      }
    } catch {
      showToast('Saqlashda xatolik yuz berdi', 'error')
    } finally {
      setSavingReader(false)
    }
  }

  const handleDeleteReader = async (id: number) => {
    if (!confirm('Ushbu foydalanuvchini oʻchirishga ishonchingiz komilmi?')) return
    try {
      const res = await fetch(`/api/admin/readers/${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Foydalanuvchi oʻchirildi')
        fetchReaders(readerSearch)
        fetchStats()
      } else {
        showToast('Xatolik yuz berdi', 'error')
      }
    } catch {
      showToast('Oʻchirishda xatolik yuz berdi', 'error')
    }
  }

  // --- Agar yuklanayotgan bo'lsa ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
          <span>Yuklanmoqda...</span>
        </div>
      </div>
    )
  }

  // --- Agar admin kirmagan bo'lsa: LOGIN EKRAN ---
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-2">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-serif">HISINF.UZ</h1>
            <p className="text-xs uppercase tracking-widest text-slate-400 font-mono">Boshqaruv Paneli</p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Login yoki Email</label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
                placeholder="admin"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Parol</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white outline-none focus:border-emerald-600 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
            <a href={`/${locale}`} className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              ← Asosiy saytga qaytish
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
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl shadow-xl text-white text-xs font-medium ${
              toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
            }`}
          >
            {toastMessage.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* TOP HEADER (Aynan rasmdagidek) */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-bold font-serif leading-none tracking-tight text-slate-900 dark:text-white">
                HISINF.UZ
              </div>
              <div className="text-[11px] text-slate-400 font-mono tracking-wider mt-1">
                Boshqaruv Paneli
              </div>
            </div>
          </div>

          {/* Navigation Pills (Aynan rasmdagi kabi tablar) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Asosiy</span>
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'posts'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Maqolalar</span>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'admins'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Adminlar</span>
            </button>
            <button
              onClick={() => setActiveTab('readers')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'readers'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Foydalanuvchilar</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Lang switch */}
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700 text-[11px] font-mono">
              <button
                onClick={() => router.push(`/uz/admin`)}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                  locale === 'uz' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'
                }`}
              >
                UZ
              </button>
              <button
                onClick={() => router.push(`/kaa/admin`)}
                className={`px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                  locale === 'kaa' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-500'
                }`}
              >
                KAA
              </button>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
              title="Tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Admin badge */}
            <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>{currentUser.displayName}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700 flex items-center justify-center text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* TOP ROW: 3 STAT CARDS (Aynan rasmdagidek) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Ro'yxatdan o'tgan odamlar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Dizimnen ótken adamlar
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-serif mt-1">
                {stats.readersCount}
              </div>
            </div>
          </div>

          {/* Card 2: Barcha maqolalar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Barlıq maqalalar (Postlar)
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-serif mt-1">
                {stats.postsCount}
              </div>
            </div>
          </div>

          {/* Card 3: Adminlar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Barlıq adminler
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-serif mt-1">
                {stats.adminsCount}
              </div>
            </div>
          </div>
        </div>

        {/* 2X2 DASHBOARD GRID (Aynan rasmdagi 4 ta asosiy karta) */}
        {(activeTab === 'dashboard' || activeTab === 'admins' || activeTab === 'readers') && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* KARTA 1: FOYDALANUVCHI & ADMIN PAROLLARINI O'ZGARTIRISH (Aynan rasmdagidek) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Foydalanıwshı & Admin Parolların Ózgertiw
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Eski parol kórsetilmeydi, bıraq jańa parol ornata alasız.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Adamdı tańlań:
                  </label>
                  <select
                    value={pwdTarget}
                    onChange={(e) => setPwdTarget(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-rose-600 cursor-pointer"
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
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Login (Username):
                    </label>
                    <input
                      type="text"
                      disabled
                      value={selectedPwdItem?.username || selectedPwdItem?.email || ''}
                      placeholder="Login..."
                      className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      Parol jaratıw:
                    </label>
                    <input
                      type="text"
                      value={pwdNewValue}
                      onChange={(e) => setPwdNewValue(e.target.value)}
                      required
                      placeholder="Jańa parol..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-rose-300 dark:border-rose-900 rounded-xl text-xs text-slate-800 dark:text-white font-mono outline-none focus:border-rose-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingPwd}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updatingPwd ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Jańalaw (Yangilash)</span>
                </button>
              </form>
            </div>

            {/* KARTA 2: YANGI ADMIN QO'SHISH (Aynan rasmdagi "Vrachqa Jeke Kabinet" kabi) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Admin / Xodim Qoʻshish
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Saytni boshqarish uchun yangi admin yoki muharrir yaratish.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateAdmin} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Ism-familiya *</label>
                    <input
                      type="text"
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      required
                      placeholder="Dildora Alimbetova"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Rol</label>
                    <select
                      value={newAdminRole}
                      onChange={(e) => setNewAdminRole(e.target.value as 'admin' | 'editor')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-emerald-600 cursor-pointer"
                    >
                      <option value="admin">Asosiy Admin</option>
                      <option value="editor">Muharrir (Editor)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Login (username) *</label>
                    <input
                      type="text"
                      value={newAdminUsername}
                      onChange={(e) => setNewAdminUsername(e.target.value)}
                      required
                      placeholder="admin_dildora"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white font-mono outline-none focus:border-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Parol *</label>
                    <input
                      type="text"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-emerald-300 dark:border-emerald-900 rounded-xl text-xs text-slate-800 dark:text-white font-mono outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={savingAdmin}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
            {/* KARTA 3: YANGI POST QO'SHISH (Bottom-left in screenshot) */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {editingPostId ? 'Maqolani Tahrirlash' : 'Jańa Maqola (Post) Qosıw'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Rasm yuklang yoki URL kiriting, matnni Wordʼdan import qiling yoki yozing.
                    </p>
                  </div>
                </div>

                {editingPostId && (
                  <button
                    onClick={resetPostForm}
                    className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePost} className="space-y-4">
                {/* 1. Post Mavzusi */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                    <span>Post mavzusi (Sarlavha) *</span>
                    <span className="text-[11px] text-slate-400 font-mono">{postTitle.length} belgi</span>
                  </label>
                  <input
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    required
                    placeholder="Masalan: Qoraqalpogʻiston xonligi tarixi..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-white outline-none focus:border-blue-600"
                  />
                </div>

                {/* 2. Rasm tanlash: Laptopdan yuklash YOKI Internetdan URL */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Muqova rasmi:
                    </label>
                    {/* Toggle: Upload vs URL */}
                    <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-0.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setImageMode('upload')}
                        className={`px-2.5 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                          imageMode === 'upload' ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        <span>Kompyuterdan</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode('url')}
                        className={`px-2.5 py-1 rounded-md cursor-pointer transition-all flex items-center gap-1 ${
                          imageMode === 'url' ? 'bg-white dark:bg-slate-900 text-blue-600 font-bold shadow-xs' : 'text-slate-600'
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
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-white dark:bg-slate-900"
                      >
                        {uploadingImage ? (
                          <div className="flex items-center justify-center gap-2 text-xs text-blue-600 font-medium">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Rasm yuklanmoqda...</span>
                          </div>
                        ) : postImagePreview ? (
                          <div className="flex items-center justify-center gap-3">
                            <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200">
                              <Image src={postImagePreview} alt="Preview" fill className="object-cover" />
                            </div>
                            <span className="text-xs text-emerald-600 font-medium">✓ Rasm tanlangan (Oʻzgartirish uchun bosing)</span>
                          </div>
                        ) : (
                          <div className="space-y-1 text-slate-500">
                            <Upload className="w-6 h-6 mx-auto text-slate-400" />
                            <div className="text-xs font-medium">Kompyuteringizdan rasm tanlash uchun bosing</div>
                            <div className="text-[10px] text-slate-400">PNG, JPG, WebP formatlar</div>
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
                        className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 font-mono"
                      />
                      {postImagePreview && (
                        <div className="flex items-center gap-2">
                          <div className="relative w-12 h-10 rounded-md overflow-hidden border border-slate-200">
                            <Image src={postImagePreview} alt="Preview" fill className="object-cover" unoptimized />
                          </div>
                          <span className="text-xs text-slate-400">Rasm havolasi kiritildi</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Post Matni (Chegarasiz va Word Import bilan) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Post matni (Chegarasiz, xohlagancha matn yozing):
                    </label>

                    {/* Word / PDF / TXT import tugmasi */}
                    <div>
                      <input
                        type="file"
                        ref={docInputRef}
                        accept=".docx,.pdf,.txt"
                        onChange={handleDocumentImport}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => docInputRef.current?.click()}
                        disabled={parsingDoc}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {parsingDoc ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileUp className="w-3.5 h-3.5" />}
                        <span>📄 Word / Fayldan matn import qilish</span>
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Maqola matnini bu yerga yozing yoki Word faylingizdan import qiling..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm leading-relaxed text-slate-800 dark:text-white outline-none focus:border-blue-600 resize-y font-serif"
                  />
                  <div className="text-right text-[11px] text-slate-400 font-mono">
                    {postContent.trim() ? `${postContent.trim().split(/\s+/).length} soʻz` : '0 soʻz'}
                  </div>
                </div>

                {/* 4. Til va Holat tanlash */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Til</label>
                    <select
                      value={postLanguage}
                      onChange={(e) => setPostLanguage(e.target.value as 'both' | 'uz' | 'kaa')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="both">Ikkala til uchun (Uzbek & Karakalpak)</option>
                      <option value="uz">Faqat Oʻzbekcha</option>
                      <option value="kaa">Faqat Qaraqalpaqsha</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Holat</label>
                    <select
                      value={postStatus}
                      onChange={(e) => setPostStatus(e.target.value as 'published' | 'draft')}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600 cursor-pointer"
                    >
                      <option value="published">Darhol chop etish (Published)</option>
                      <option value="draft">Qoralama (Draft)</option>
                    </select>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={savingPost}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {savingPost ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saqlanmoqda...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingPostId ? 'Oʻzgarishlarni Saqlash' : 'Maqolani Chop Etish / Qoʻshish'}</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* KARTA 4: MAQOLALARNI BOSHQARISH JADVALI (Bottom-right in screenshot) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Maqolalarni Basqarıw
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400">Jami: {posts.length} ta</span>
              </div>

              {/* Qidiruv */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  placeholder="Maqolalarni qidirish..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-purple-600"
                />
              </div>

              {/* Ro'yxat */}
              <div className="flex-1 overflow-y-auto max-h-[560px] divide-y divide-slate-100 dark:divide-slate-800 pr-1">
                {postsLoading ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-mono">Yuklanmoqda...</div>
                ) : posts.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-mono">Hozircha maqolalar yoʻq</div>
                ) : (
                  posts.map((post) => {
                    const thumbUrl =
                      typeof post.coverImage === 'object' && post.coverImage?.url
                        ? post.coverImage.url
                        : post.coverImageUrl || '/favicon.svg'

                    return (
                      <div key={post.id} className="py-3 flex items-center justify-between gap-3 group hover:bg-slate-50 dark:hover:bg-slate-800/40 p-2 rounded-xl transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                            <Image src={thumbUrl} alt="" fill className="object-cover" unoptimized />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate max-w-[220px]" title={post.title || ''}>
                              {post.title || 'Nomsiz maqola'}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Qoralama'}</span>
                              <span className={`px-1.5 py-0.2 rounded-full text-[9px] uppercase font-mono ${
                                post._status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
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
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg cursor-pointer transition-colors"
                            title="Tahrirlash"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Saytdagi Foydalanuvchilar (Readers)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Roʻyxatdan oʻtgan barcha foydalanuvchilarni koʻrish va tahrirlash.
                  </p>
                </div>
              </div>

              {/* Qidiruv */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={readerSearch}
                  onChange={(e) => setReaderSearch(e.target.value)}
                  placeholder="Foydalanuvchi qidirish..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Readers Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Ism-familiya</th>
                    <th className="px-4 py-3">Email / Login</th>
                    <th className="px-4 py-3">Holat</th>
                    <th className="px-4 py-3">Roʻyxatdan oʻtgan</th>
                    <th className="px-4 py-3 text-right rounded-r-xl">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {readersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-mono">
                        Foydalanuvchilar topilmadi
                      </td>
                    </tr>
                  ) : (
                    readersList.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                          {r.displayName || 'Nomsiz'}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">
                          {r.email || r.username || '—'}
                        </td>
                        <td className="px-4 py-3.5">
                          {r.isBanned ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-100 text-rose-700 font-semibold flex items-center gap-1 w-max">
                              <Ban className="w-3 h-3" /> Bloklangan
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1 w-max">
                              <UserCheck className="w-3 h-3" /> Faol
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-400">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1">
                          <button
                            onClick={() => handleOpenReaderModal(r)}
                            className="px-2.5 py-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Tahrirlash
                          </button>
                          <button
                            onClick={() => handleDeleteReader(r.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
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
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Adminlar va Muharrirlar Roʻyxati
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Boshqaruv huquqiga ega barcha xodimlar.
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Jami: {staffList.length} ta</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Ism-familiya</th>
                    <th className="px-4 py-3">Login</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Rol</th>
                    <th className="px-4 py-3 text-right rounded-r-xl">Harakatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-white">
                        {staff.displayName}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-600 dark:text-slate-400">
                        @{staff.username}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-400">
                        {staff.email || '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-mono font-bold bg-amber-100 text-amber-800">
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        {staff.id !== currentUser.id && (
                          <button
                            onClick={() => handleDeleteStaff(staff.id)}
                            className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Foydalanuvchini Tahrirlash
              </h3>
              <button
                onClick={() => setEditingReader(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReader} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Ism-familiya</label>
                <input
                  type="text"
                  value={editReaderName}
                  onChange={(e) => setEditReaderName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">Email</label>
                <input
                  type="email"
                  value={editReaderEmail}
                  onChange={(e) => setEditReaderEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white font-mono outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Yangi parol (faqat oʻzgartirmoqchi boʻlsangiz)
                </label>
                <input
                  type="text"
                  value={editReaderPassword}
                  onChange={(e) => setEditReaderPassword(e.target.value)}
                  placeholder="Yangi parol..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white font-mono outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="banCheck"
                  checked={editReaderBanned}
                  onChange={(e) => setEditReaderBanned(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
                />
                <label htmlFor="banCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Ushbu foydalanuvchini bloklash (Ban)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingReader(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={savingReader}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
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

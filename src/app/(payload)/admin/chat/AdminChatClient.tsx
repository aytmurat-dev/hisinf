'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import styles from './chat.module.css'

interface StaffUser {
  id: number
  name: string
  username?: string
  role: 'admin' | 'editor' | 'author'
  avatar?: unknown
}

interface Conversation {
  id: number
  name?: string
  isGroup?: boolean
  participants: (StaffUser | number)[]
  lastMessage?: string
  lastMessageAt?: string
  updatedAt?: string
}

interface Message {
  id: number
  conversation: number | { id: number }
  sender: StaffUser | number
  text: string
  createdAt: string
}

export function AdminChatClient() {
  const [currentUser, setCurrentUser] = useState<StaffUser | null>(null)
  const [admins, setAdmins] = useState<StaffUser[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConv, setActiveConv] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [activeTab, setActiveTab] = useState<'conversations' | 'admins'>('conversations')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  // Group modal
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [groupName, setGroupName] = useState('')
  const [selectedGroupAdmins, setSelectedGroupAdmins] = useState<number[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  // 1. Initial load
  const loadChatData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/chat')
      if (res.ok) {
        const data = await res.json()
        setCurrentUser(data.currentUser)
        setAdmins(data.admins || [])
        setConversations(data.conversations || [])
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadChatData()
  }, [loadChatData])

  // 2. Load messages for active conversation
  const loadMessages = useCallback(async (convId: number) => {
    try {
      const res = await fetch(`/api/admin/chat/messages?conversationId=${convId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    if (activeConv) {
      loadMessages(activeConv.id)
    } else {
      setMessages([])
    }
  }, [activeConv, loadMessages])

  useEffect(() => {
    scrollToBottom('auto')
  }, [messages])

  // 3. Polling for real-time feel
  useEffect(() => {
    if (!activeConv) return

    const timer = setInterval(() => {
      loadMessages(activeConv.id)
    }, 3000)

    return () => clearInterval(timer)
  }, [activeConv, loadMessages])

  // Polling conversations list
  useEffect(() => {
    const listTimer = setInterval(() => {
      fetch('/api/admin/chat')
        .then((r) => r.json())
        .then((data) => {
          if (data.conversations) setConversations(data.conversations)
        })
        .catch(() => {})
    }, 6000)

    return () => clearInterval(listTimer)
  }, [])

  // 4. Start 1-on-1 direct chat with an admin
  const handleStartDirectChat = async (targetAdminId: number) => {
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isGroup: false,
          participantIds: [targetAdminId],
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setActiveConv(data.conversation)
        setActiveTab('conversations')
        loadChatData()
      }
    } catch {
      // ignore
    }
  }

  // 5. Create group chat
  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedGroupAdmins.length === 0) return
    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isGroup: true,
          name: groupName.trim(),
          participantIds: selectedGroupAdmins,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setActiveConv(data.conversation)
        setShowGroupModal(false)
        setGroupName('')
        setSelectedGroupAdmins([])
        setActiveTab('conversations')
        loadChatData()
      }
    } catch {
      // ignore
    }
  }

  // 6. Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!activeConv || !inputText.trim() || isSending) return

    const textToSend = inputText.trim()
    setInputText('')
    setIsSending(true)

    try {
      const res = await fetch('/api/admin/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeConv.id,
          text: textToSend,
        }),
      })
      if (res.ok) {
        const data = await res.json()
        setMessages((prev) => [...prev, data.message])
        scrollToBottom('smooth')
      }
    } catch {
      // fallback
    } finally {
      setIsSending(false)
    }
  }

  // 7. Delete message
  const handleDeleteMessage = async (messageId: number) => {
    if (!window.confirm('Ushbu xabarni oʻchirmoqchimisiz?')) return
    try {
      const res = await fetch(`/api/admin/chat/messages?messageId=${messageId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId))
      } else {
        const data = await res.json()
        alert(data.error || 'Xabarni oʻchirishda xatolik')
      }
    } catch {
      // ignore
    }
  }

  // Helper: get display title for conversation
  const getConversationTitle = (c: Conversation) => {
    if (c.name) return c.name
    if (!c.isGroup && currentUser) {
      const other = c.participants.find((p) => {
        const id = typeof p === 'object' ? p.id : p
        return id !== currentUser.id
      })
      if (other && typeof other === 'object') {
        return other.name || other.username || `Admin #${other.id}`
      }
    }
    return `Suhbat #${c.id}`
  }

  // Filtered lists
  const filteredConversations = conversations.filter((c) => {
    const title = getConversationTitle(c).toLowerCase()
    return title.includes(search.toLowerCase())
  })

  const otherAdmins = admins.filter((a) => a.id !== currentUser?.id)
  const filteredAdmins = otherAdmins.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.username && a.username.toLowerCase().includes(search.toLowerCase())),
  )

  const emojis = ['👍', '🤝', '✍️', '✅', '💡', '🎉', '📚']

  return (
    <div className={styles.chatContainer}>
      {/* 1. Top bar with navigation buttons */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <Link href="/admin" className={styles.backBtn}>
            ← Boshqaruv paneli
          </Link>
          <div className={styles.titleArea}>
            <span style={{ fontSize: '20px' }}>💬</span>
            <h1 className={styles.title}>Adminlar Chati</h1>
          </div>
        </div>

        <div className={styles.topBarRight}>
          <Link href="/" target="_blank" className={styles.siteBtn}>
            🌐 Asosiy saytga oʻtish
          </Link>

          {currentUser && (
            <div className={styles.currentUserBadge}>
              <span className={styles.avatar} style={{ width: 24, height: 24, fontSize: 11 }}>
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
              <span style={{ fontWeight: 600 }}>{currentUser.name}</span>
              <span className={styles.userRolePill}>
                {currentUser.role === 'admin'
                  ? 'Bosh admin'
                  : currentUser.role === 'editor'
                    ? 'Muharrir'
                    : 'Muallif'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* 2. Main 2-column layout */}
      <div className={styles.mainLayout}>
        {/* Left Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarHeaderTop}>
              <h2 className={styles.sidebarTitle}>Muloqot xonasi</h2>
              <button
                type="button"
                className={styles.createGroupBtn}
                onClick={() => setShowGroupModal(true)}
              >
                + Guruh ochish
              </button>
            </div>
            <input
              type="text"
              placeholder="Qidirish (ism yoki suhbat)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.sidebarTabs}>
            <button
              type="button"
              className={`${styles.sidebarTab} ${activeTab === 'conversations' ? styles.sidebarTabActive : ''}`}
              onClick={() => setActiveTab('conversations')}
            >
              Suhbatlar ({conversations.length})
            </button>
            <button
              type="button"
              className={`${styles.sidebarTab} ${activeTab === 'admins' ? styles.sidebarTabActive : ''}`}
              onClick={() => setActiveTab('admins')}
            >
              Barcha adminlar ({otherAdmins.length})
            </button>
          </div>

          <div className={styles.sidebarList}>
            {loading && (
              <p style={{ padding: '12px', fontSize: '13px', color: 'var(--muted)' }}>
                Yuklanmoqda...
              </p>
            )}

            {/* TAB 1: Conversations */}
            {activeTab === 'conversations' && (
              <>
                {filteredConversations.map((c) => {
                  const title = getConversationTitle(c)
                  const isActive = activeConv?.id === c.id
                  return (
                    <div
                      key={c.id}
                      className={`${styles.conversationItem} ${isActive ? styles.conversationItemActive : ''}`}
                      onClick={() => setActiveConv(c)}
                    >
                      <div
                        className={`${styles.avatar} ${c.isGroup ? styles.avatarGroup : ''}`}
                      >
                        {c.isGroup ? '👥' : title.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.itemInfo}>
                        <div className={styles.itemHeader}>
                          <span className={styles.itemName}>{title}</span>
                          {c.lastMessageAt && (
                            <span className={styles.itemTime}>
                              {new Date(c.lastMessageAt).toLocaleTimeString('uz-UZ', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        <div className={styles.itemSnippet}>
                          {c.lastMessage || 'Xabarlar yoʻq'}
                        </div>
                      </div>
                    </div>
                  )
                })}
                {!loading && filteredConversations.length === 0 && (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--muted)' }}>
                    <p style={{ fontSize: '13px', marginBottom: '8px' }}>Hozircha suhbatlar yoʻq</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('admins')}
                      className={styles.createGroupBtn}
                    >
                      Adminlar roʻyxatidan tanlang
                    </button>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: All Admins */}
            {activeTab === 'admins' && (
              <>
                {filteredAdmins.map((adm) => (
                  <div
                    key={adm.id}
                    className={styles.adminCard}
                    onClick={() => handleStartDirectChat(adm.id)}
                  >
                    <div className={styles.adminCardLeft}>
                      <div className={styles.avatar}>{adm.name.charAt(0).toUpperCase()}</div>
                      <div className={styles.adminDetails}>
                        <span className={styles.adminName}>{adm.name}</span>
                        <span className={styles.adminUsername}>
                          @{adm.username || 'admin'} ·{' '}
                          {adm.role === 'admin'
                            ? 'Bosh admin'
                            : adm.role === 'editor'
                              ? 'Muharrir'
                              : 'Muallif'}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--primary)' }}>Yozish →</span>
                  </div>
                ))}
                {!loading && filteredAdmins.length === 0 && (
                  <p style={{ padding: '16px', fontSize: '13px', color: 'var(--muted)' }}>
                    Hech qanday admin topilmadi.
                  </p>
                )}
              </>
            )}
          </div>
        </aside>

        {/* Right Chat Area */}
        <main className={styles.chatArea}>
          {!activeConv ? (
            <div className={styles.emptyArea}>
              <div className={styles.emptyIcon}>💬</div>
              <h2 className={styles.emptyTitle}>Adminlar Chatiga xush kelibsiz!</h2>
              <p className={styles.emptyDesc}>
                Chap tomondagi roʻyxatdan biror adminni tanlang yoki <b>&quot;+ Guruh ochish&quot;</b>{' '}
                tugmasi orqali bir nechta admin bilan birgalikda muhokama xonasi tashkil qiling.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className={styles.chatHeader}>
                <div className={styles.chatHeaderLeft}>
                  <div
                    className={`${styles.avatar} ${activeConv.isGroup ? styles.avatarGroup : ''}`}
                  >
                    {activeConv.isGroup ? '👥' : getConversationTitle(activeConv).charAt(0)}
                  </div>
                  <div>
                    <h2 className={styles.chatHeaderTitle}>{getConversationTitle(activeConv)}</h2>
                    <span className={styles.chatHeaderSub}>
                      {activeConv.isGroup ? 'Guruh suhbati' : 'Yakka suhbat'} · Adminlar doimo
                      faol
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages container */}
              <div className={styles.messagesContainer}>
                {messages.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--muted)', margin: 'auto' }}>
                    <p style={{ fontSize: '14px' }}>Ushbu suhbatda hali xabarlar yoʻq.</p>
                    <p style={{ fontSize: '12px' }}>Salom deb birinchi xabarni yuboring!</p>
                  </div>
                )}

                {messages.map((m) => {
                  const senderObj = typeof m.sender === 'object' ? m.sender : null
                  const senderId = senderObj ? senderObj.id : (m.sender as number)
                  const isMine = senderId === currentUser?.id
                  const senderName = senderObj
                    ? senderObj.name || senderObj.username || 'Admin'
                    : 'Admin'

                  return (
                    <div
                      key={m.id}
                      className={`${styles.messageRow} ${isMine ? styles.messageRowMine : styles.messageRowOther}`}
                    >
                      {!isMine && (
                        <div className={styles.msgAvatar}>
                          {senderName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div
                        className={`${styles.messageBubble} ${isMine ? styles.bubbleMine : styles.bubbleOther}`}
                      >
                        {!isMine && activeConv.isGroup && (
                          <span className={styles.senderName}>{senderName}</span>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            marginTop: '4px',
                          }}
                        >
                          <span className={styles.messageTime}>
                            {new Date(m.createdAt).toLocaleTimeString('uz-UZ', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {(isMine || currentUser?.role === 'admin') && (
                            <button
                              type="button"
                              onClick={() => handleDeleteMessage(m.id)}
                              title="Xabarni oʻchirish"
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0 2px',
                                fontSize: '11px',
                                opacity: 0.65,
                                color: isMine ? '#fff8ee' : 'var(--hf-primary, #8c2f1b)',
                              }}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={styles.inputArea}>
                <div className={styles.emojiBar}>
                  <span style={{ fontSize: '11px', color: 'var(--muted)', marginRight: '4px' }}>
                    Tezkor:
                  </span>
                  {emojis.map((em) => (
                    <button
                      key={em}
                      type="button"
                      className={styles.emojiBtn}
                      onClick={() => setInputText((prev) => prev + em)}
                    >
                      {em}
                    </button>
                  ))}
                </div>

                <form className={styles.inputForm} onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Xabar yozing (Enter bosing)..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className={styles.messageInput}
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className={styles.sendBtn}
                  >
                    Yuborish 🚀
                  </button>
                </form>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className={styles.modalOverlay} onClick={() => setShowGroupModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Yangi guruh suhbati ochish</h3>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                Guruh nomi:
              </label>
              <input
                type="text"
                placeholder="Masalan: Tahririyat rejasi..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className={styles.modalInput}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                Guruhga qoʻshiladigan adminlar:
              </label>
              <div className={styles.adminCheckList}>
                {otherAdmins.map((adm) => {
                  const isChecked = selectedGroupAdmins.includes(adm.id)
                  return (
                    <label key={adm.id} className={styles.adminCheckItem}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          if (isChecked) {
                            setSelectedGroupAdmins((prev) => prev.filter((id) => id !== adm.id))
                          } else {
                            setSelectedGroupAdmins((prev) => [...prev, adm.id])
                          }
                        }}
                      />
                      <span>
                        <b>{adm.name}</b> (@{adm.username || 'admin'})
                      </span>
                    </label>
                  )
                })}
              </div>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowGroupModal(false)}
              >
                Bekor qilish
              </button>
              <button
                type="button"
                disabled={!groupName.trim() || selectedGroupAdmins.length === 0}
                className={styles.createBtn}
                onClick={handleCreateGroup}
              >
                Guruhni yaratish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

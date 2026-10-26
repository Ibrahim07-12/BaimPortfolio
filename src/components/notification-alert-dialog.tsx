"use client"

import { BellRing, Check, Clock, MessageCircle, X } from "lucide-react"
import { useEffect, useState } from "react"

interface Notification {
    id: string
    sender: {
        name: string
        initials: string
    }
    message: string
    time: string
    read: boolean
}

function initialsFor(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "CR"
}

export function Component() {
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        if (typeof window === "undefined") return []
        try {
            return JSON.parse(localStorage.getItem("portfolio-chat-notifications") ?? "[]") as Notification[]
        } catch {
            return []
        }
    })
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const readStored = () => {
            try {
                return JSON.parse(localStorage.getItem("portfolio-chat-notifications") ?? "[]") as Notification[]
            } catch {
                return []
            }
        }
        const save = (next: Notification[]) => {
            setNotifications(next)
            localStorage.setItem("portfolio-chat-notifications", JSON.stringify(next))
        }
        const handleChatMessage = (event: Event) => {
            const detail = (event as CustomEvent<{ id?: string; createdAt?: string; sender?: string; message?: string }>).detail
            const sender = detail?.sender?.trim() || "Chat Room"
            const notification: Notification = {
                id: detail?.id ?? `chat-${Date.now()}`,
                sender: { name: sender, initials: initialsFor(sender) },
                message: detail?.message?.trim() || "Ada pesan baru di Chat Room.",
                time: detail?.createdAt ? new Date(detail.createdAt).toLocaleString("id-ID") : "Baru saja",
                read: false,
            }

            const current = readStored()
            save([notification, ...current.filter((item) => item.id !== notification.id)])
            setIsOpen(true)
        }
        const handleChatSnapshot = (event: Event) => {
            const snapshot = (event as CustomEvent<Array<{ id: string; createdAt: string; sender: string; message: string }>>).detail
            const currentById = new Map(readStored().map((item) => [item.id, item]))
            const next = snapshot.map((item) => {
                const existing = currentById.get(item.id)
                return existing ?? {
                    id: item.id,
                    sender: { name: item.sender, initials: initialsFor(item.sender) },
                    message: item.message,
                    time: new Date(item.createdAt).toLocaleString("id-ID"),
                    read: false,
                }
            })
            const hasNew = next.some((item) => !currentById.has(item.id))
            save(next)
            if (hasNew) setIsOpen(true)
        }
        const handleChatOpened = () => {
            save([])
            setIsOpen(false)
        }

        window.addEventListener("portfolio:chat-message", handleChatMessage)
        window.addEventListener("portfolio:chat-snapshot", handleChatSnapshot)
        window.addEventListener("portfolio:open-chat", handleChatOpened)
        return () => {
            window.removeEventListener("portfolio:chat-message", handleChatMessage)
            window.removeEventListener("portfolio:chat-snapshot", handleChatSnapshot)
            window.removeEventListener("portfolio:open-chat", handleChatOpened)
        }
    }, [])

    const unreadCount = notifications.filter((notification) => !notification.read).length

    const markAsRead = (id: string) => {
        setNotifications((current) => {
            const next = current.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification,
            )
            localStorage.setItem("portfolio-chat-notifications", JSON.stringify(next))
            return next
        })
    }

    const markAllAsRead = () => {
        setNotifications([])
        localStorage.removeItem("portfolio-chat-notifications")
        setIsOpen(false)
    }

    return (
        <div className="chat-notification">
            {isOpen && (
                <section
                    className="chat-notification-panel"
                    role="dialog"
                    aria-label="Chat notifications"
                >
                    <header className="chat-notification-header">
                        <div className="chat-notification-title">
                            <BellRing aria-hidden="true" />
                            <h2>Notifications</h2>
                        </div>
                        <button
                            type="button"
                            className="chat-notification-close"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close notifications"
                        >
                            <X aria-hidden="true" />
                        </button>
                    </header>

                    <div className="chat-notification-list">
                        {notifications.length === 0 ? (
                            <p className="chat-notification-empty">Belum ada pesan baru dari Chat Room.</p>
                        ) : (
                            notifications.map((notification) => (
                                <button
                                    key={notification.id}
                                    type="button"
                                    className={`chat-notification-item${notification.read ? " is-read" : ""}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <span className="chat-notification-avatar">
                                        {notification.sender.initials}
                                    </span>
                                    <span className="chat-notification-copy">
                                        <strong>{notification.sender.name}</strong>
                                        <span>{notification.message}</span>
                                        <small>
                                            <Clock aria-hidden="true" />
                                            {notification.time}
                                        </small>
                                    </span>
                                    {!notification.read && <span className="chat-notification-unread" aria-label="Unread" />}
                                </button>
                            ))
                        )}
                    </div>

                    <footer className="chat-notification-footer">
                        <div className="chat-notification-actions">
                            <button type="button" onClick={markAllAsRead} disabled={unreadCount === 0}>
                                    <Check aria-hidden="true" />
                                    Mark all as read
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false)
                                    window.dispatchEvent(new Event("portfolio:open-chat"))
                                }}
                            >
                                <MessageCircle aria-hidden="true" />
                                Open Chat Room
                            </button>
                        </div>
                    </footer>
                </section>
            )}

            <button
                type="button"
                className="chat-notification-toggle"
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? "Close chat notifications" : "Open chat notifications"}
                aria-expanded={isOpen}
            >
                <BellRing aria-hidden="true" />
                {unreadCount > 0 && <span className="chat-notification-count">{unreadCount}</span>}
            </button>
        </div>
    )
}

export default Component

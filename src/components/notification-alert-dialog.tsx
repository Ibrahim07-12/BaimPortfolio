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
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        const handleChatMessage = (event: Event) => {
            const detail = (event as CustomEvent<{ sender?: string; message?: string }>).detail
            const sender = detail?.sender?.trim() || "Chat Room"
            const notification: Notification = {
                id: `chat-${Date.now()}`,
                sender: { name: sender, initials: initialsFor(sender) },
                message: detail?.message?.trim() || "Ada pesan baru di Chat Room.",
                time: "Baru saja",
                read: false,
            }

            setNotifications((current) => [notification, ...current])
            setIsOpen(true)
        }

        window.addEventListener("portfolio:chat-message", handleChatMessage)
        return () => window.removeEventListener("portfolio:chat-message", handleChatMessage)
    }, [])

    const unreadCount = notifications.filter((notification) => !notification.read).length

    const markAsRead = (id: string) => {
        setNotifications((current) =>
            current.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification,
            ),
        )
    }

    const markAllAsRead = () => {
        setNotifications((current) => current.map((notification) => ({ ...notification, read: true })))
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

import React from 'react';
import { MessageSquare, Plus, Trash2, X } from 'lucide-react';

const Sidebar = ({
    sessions,
    activeSessionId,
    onSelectChat,
    onNewChat,
    onDeleteChat,
    onClearAllChats,
    isOpen,
    onClose
}) => {

    const handleClearAll = () => {
        if (window.confirm("Are you sure you want to delete ALL chats? This cannot be undone.")) {
            onClearAllChats();
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <button className="new-chat-btn" onClick={() => { onNewChat(); onClose(); }}>
                        <Plus size={16} />
                        <span>New Chat</span>
                    </button>
                    <button className="close-sidebar-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="sessions-list">
                    <div className="list-label">History</div>
                    {sessions.length === 0 && (
                        <div style={{ padding: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            No chats yet.
                        </div>
                    )}
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                            onClick={() => { onSelectChat(session.id); onClose(); }}
                        >
                            <MessageSquare size={16} className="session-icon" />
                            <span className="session-title">{session.title || 'New Chat'}</span>
                            <button
                                className="delete-chat-btn"
                                onClick={(e) => onDeleteChat(session.id, e)}
                                title="Delete Chat"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {sessions.length > 0 && (
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(226, 232, 240, 0.6)' }}>
                        <button
                            className="delete-all-btn"
                            onClick={handleClearAll}
                        >
                            <Trash2 size={16} />
                            <span>Delete All Chats</span>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
};

export default Sidebar;

import React, { useEffect, useRef, useState } from 'react';
import { useChatSession } from './hooks/useChatSession';
import MessageBubble from './components/MessageBubble';
import InputArea from './components/InputArea';
import Sidebar from './components/Sidebar';
import { Menu, MessageSquarePlus, Sparkles } from 'lucide-react';
import './App.css';

function App() {
  const {
    sessions,
    activeSessionId,
    messages,
    receiving,
    sendMessage,
    cancelRequest,
    createNewChat,
    deleteChat,
    clearAllChats,
    selectChat
  } = useChatSession();

  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, receiving]);

  return (
    <div className="app-container">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectChat={selectChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        onClearAllChats={clearAllChats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="main-content">
        <header className="chat-header">
          <div className="chat-title">
            <button className="menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="status-dot"></div>
            <span>Mana AI</span>
          </div>
        </header>

        <main className="chat-container">
          {!activeSessionId ? (
            <div className="welcome-container">
              <div className="welcome-content">
                <div className="welcome-icon-wrapper">
                  <img src="/logo.png" alt="Mana AI Logo" className="welcome-logo" />
                </div>
                <h2 className="welcome-title">Welcome to Mana AI</h2>
                <p className="welcome-text">
                  Your intelligent assistant for coding, creativity, and conversation. Start a new chat to begin.
                </p>
                <button className="start-chat-btn" onClick={createNewChat}>
                  <MessageSquarePlus size={20} />
                  <span>Start New Chat</span>
                </button>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <p>Start a new conversation with Mana AI</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          <div ref={messagesEndRef} />
        </main>

        {/* Only show input area if there is an active session */}
        {activeSessionId && (
          <InputArea
            onSend={sendMessage}
            onCancel={cancelRequest}
            receiving={receiving}
          />
        )}
      </div>
    </div>
  );
}

export default App;

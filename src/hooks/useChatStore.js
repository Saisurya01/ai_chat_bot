import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'mana_ai_sessions';

export const useChatStore = () => {
    const [sessions, setSessions] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to load sessions", e);
            return [];
        }
    });

    const [activeSessionId, setActiveSessionId] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];
        return parsed.length > 0 ? parsed[0].id : null;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }, [sessions]);

    const createNewChat = useCallback(() => {
        const newSession = {
            id: crypto.randomUUID(),
            title: 'New Chat',
            messages: [],
            timestamp: Date.now(),
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        return newSession.id;
    }, []);

    const deleteChat = useCallback((id, e) => {
        if (e) e.stopPropagation();
        setSessions(prev => {
            const newSessions = prev.filter(s => s.id !== id);
            if (id === activeSessionId) {
                setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
            }
            return newSessions;
        });
    }, [activeSessionId]);

    const clearAllChats = useCallback(() => {
        setSessions([]);
        setActiveSessionId(null);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const selectChat = useCallback((id) => {
        setActiveSessionId(id);
    }, []);

    const updateSessionMessages = useCallback((sessionId, newMessages) => {
        setSessions(prev => prev.map(session => {
            if (session.id === sessionId) {
                return { ...session, messages: newMessages };
            }
            return session;
        }));
    }, []);

    const setSessionTitle = useCallback((sessionId, title) => {
        setSessions(prev => prev.map(session => {
            if (session.id === sessionId) {
                return { ...session, title };
            }
            return session;
        }));
    }, []);

    const activeSession = sessions.find(s => s.id === activeSessionId) || null;

    return {
        sessions,
        activeSessionId,
        activeSession,
        createNewChat,
        deleteChat,
        clearAllChats,
        selectChat,
        updateSessionMessages,
        setSessionTitle
    };
};

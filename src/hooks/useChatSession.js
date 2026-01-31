import { useState, useEffect, useRef, useCallback } from 'react';
import { useChatStore } from './useChatStore';
import { generateChatTitle } from '../services/chatService';

export const useChatSession = () => {
    const {
        sessions,
        activeSessionId,
        activeSession,
        createNewChat,
        deleteChat,
        clearAllChats,
        selectChat,
        updateSessionMessages,
        setSessionTitle
    } = useChatStore();

    const [receiving, setReceiving] = useState(false);
    const websocket = useRef(null);
    const activeSessionIdRef = useRef(activeSessionId);
    const messagesRef = useRef([]);

    useEffect(() => {
        activeSessionIdRef.current = activeSessionId;
        messagesRef.current = activeSession ? activeSession.messages : [];
    }, [activeSessionId, activeSession]);

    const systemPrompt = "You are Mana AI, a helpful, intelligent, and friendly assistant.";

    const connectWebSocket = useCallback((message, initChat = false) => {
        setReceiving(true);
        const url = "wss://backend.buildpicoapps.com/api/chatbot/chat";
        websocket.current = new WebSocket(url);

        const currentMessages = messagesRef.current;
        const updatedMessages = [...currentMessages, { text: '', sender: 'bot', id: Date.now() }];

        updateSessionMessages(activeSessionIdRef.current, updatedMessages);
        messagesRef.current = updatedMessages;

        websocket.current.onopen = () => {
            websocket.current.send(JSON.stringify({
                chatId: activeSessionIdRef.current,
                appId: "apply-official",
                systemPrompt: systemPrompt,
                message: initChat ? "A short welcome message from Mana AI" : message,
            }));
        };

        websocket.current.onmessage = (event) => {
            const currentMsgs = messagesRef.current;
            const newMessages = [...currentMsgs];
            const lastMessageIndex = newMessages.length - 1;

            if (lastMessageIndex >= 0) {
                const lastMessage = { ...newMessages[lastMessageIndex] };
                if (lastMessage.sender === 'bot') {
                    lastMessage.text += event.data;
                    newMessages[lastMessageIndex] = lastMessage;

                    updateSessionMessages(activeSessionIdRef.current, newMessages);
                    messagesRef.current = newMessages;
                }
            }
        };

        websocket.current.onclose = () => {
            setReceiving(false);
        };

        websocket.current.onerror = (error) => {
            console.error("WebSocket error:", error);
            setReceiving(false);
        };

    }, [updateSessionMessages, systemPrompt]);

    const sendMessage = (text) => {
        if (!text.trim() || !activeSessionId) return;

        const currentMsgs = activeSession?.messages || [];
        const isFirstUserMessage = currentMsgs.filter(m => m.sender === 'user').length === 0;

        const newMsg = { text, sender: 'user', id: Date.now() };
        const updatedMessages = [...currentMsgs, newMsg];

        updateSessionMessages(activeSessionId, updatedMessages);
        messagesRef.current = updatedMessages;

        connectWebSocket(text, false);

        if (isFirstUserMessage) {
            setTimeout(() => {
                generateChatTitle(text)
                    .then(title => {
                        if (activeSessionIdRef.current === activeSessionId) {
                            setSessionTitle(activeSessionId, title);
                        }
                    })
                    .catch(err => console.error("Failed to generate title", err));
            }, 500);
        }
    };

    const cancelRequest = () => {
        if (websocket.current) {
            websocket.current.close(1000);
            setReceiving(false);
        }
    };

    useEffect(() => {
        if (websocket.current && receiving) {
            websocket.current.close(1000);
            setReceiving(false);
        }
    }, [activeSessionId]);

    return {
        sessions,
        activeSessionId,
        messages: activeSession?.messages || [],
        receiving,
        sendMessage,
        cancelRequest,
        createNewChat,
        deleteChat,
        clearAllChats,
        selectChat
    };
};

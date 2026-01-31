import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot } from 'lucide-react';

const MessageBubble = ({ message }) => {
    const isUser = message.sender === 'user';

    return (
        <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
            <div className="message-content">
                {!isUser && (
                    <div className="avatar assistant">
                        <Bot size={18} color="#6366f1" />
                    </div>
                )}
                <div className="message-text">
                    {isUser ? (
                        <p>{message.text}</p>
                    ) : (
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;

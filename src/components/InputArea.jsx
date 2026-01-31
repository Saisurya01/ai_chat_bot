import React, { useState, useRef } from 'react';
import { Send, Square } from 'lucide-react';

const InputArea = ({ onSend, onCancel, receiving }) => {
    const [input, setInput] = useState('');
    const textareaRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (receiving) {
            onCancel();
        } else if (input.trim()) {
            onSend(input);
            setInput('');
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleChange = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className="input-area">
            <form className="input-form" onSubmit={handleSubmit}>
                <textarea
                    ref={textareaRef}
                    className="chat-input"
                    placeholder={receiving ? "Waiting for response..." : "Type a message..."}
                    rows={1}
                    value={input}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    disabled={receiving}
                />
                <button
                    type="submit"
                    className="send-btn"
                    disabled={!input.trim() && !receiving}
                    title={receiving ? "Cancel" : "Send"}
                >
                    {receiving ? <Square size={16} fill="currentColor" /> : <Send size={18} />}
                </button>
            </form>
        </div>
    );
};

export default InputArea;

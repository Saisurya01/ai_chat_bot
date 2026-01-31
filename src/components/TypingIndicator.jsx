import React from 'react';

const TypingIndicator = () => {
    return (
        <div className="message-wrapper assistant">
            <div className="message-content">
                <div className="avatar assistant" style={{ backgroundColor: '#10a37f' }}>
                    {/* Simple dot or icon */}
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }}></div>
                </div>
                <div className="message-text">
                    <div className="typing-indicator">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;

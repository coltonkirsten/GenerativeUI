import React, { useState } from 'react';

const ChatWindow = ({ onSend, onModify }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const handleGenerate = async () => {
        if (input.trim() === '') return;
        const userMessage = { sender: 'user', text: `Create: ${input}` };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        onSend(input, setMessages);
    };

    const handleModify = async () => {
        if (input.trim() === '') return;
        const userMessage = { sender: 'user', text: `Modify: ${input}` };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        onModify(input, setMessages);
    };

    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <strong>{msg.sender === 'user' ? 'You' : 'LLM'}:</strong>
                        <p>{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="input-area">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows={3}
                    placeholder="Type your prompt..."
                />
                <div className="button-group">
                    <button onClick={handleGenerate} className="generate-button">Create</button>
                    <button onClick={handleModify} className="modify-button">Modify</button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow; 
import React, { useEffect, useState, useRef } from 'react';
import makeCompletion from './utils/makeCompletion';
import ChatWindow from './components/ChatWindow';
import './App.css';

const App = () => {
    const [htmlContent, setHtmlContent] = useState(``);
    const containerRef = useRef(null);
    const dividerRef = useRef(null);
    const [leftWidth, setLeftWidth] = useState(66); // Percentage

    const handleGenerateHtml = async (prompt, setMessages) => {
        try {
            setMessages(prev => [...prev, { sender: 'llm', text: '...' }]);
            const response = await makeCompletion(prompt);
            let processedResponse = response;
            if (response.startsWith("```html") && response.endsWith("```")) {
                processedResponse = response.slice(6, -3).trim();
            }
            setHtmlContent(processedResponse);
            setMessages(prev => {
                const updated = [...prev];
                updated.pop(); // Remove '...'
                return [...updated, { sender: 'llm', text: processedResponse }];
            });
        } catch (error) {
            console.error("Failed to get completion:", error);
            setMessages(prev => {
                const updated = [...prev];
                updated.pop(); // Remove '...'
                return [...updated, { sender: 'llm', text: 'Error generating HTML.' }];
            });
        }
    };

    useEffect(() => {
        const handleMouseDown = (e) => {
            e.preventDefault();
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        };

        const handleMouseMove = (e) => {
            if (!containerRef.current) return;
            const containerOffsetLeft = containerRef.current.getBoundingClientRect().left;
            const pointerRelativeXpos = e.clientX - containerOffsetLeft;
            const containerWidth = containerRef.current.getBoundingClientRect().width;
            let newLeftWidth = (pointerRelativeXpos / containerWidth) * 100;
            if (newLeftWidth < 20) newLeftWidth = 20;
            if (newLeftWidth > 80) newLeftWidth = 80;
            setLeftWidth(newLeftWidth);
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        const divider = dividerRef.current;
        if (divider) {
            divider.addEventListener('mousedown', handleMouseDown);
        }

        return () => {
            if (divider) {
                divider.removeEventListener('mousedown', handleMouseDown);
            }
        };
    }, []);

    return (
        <div className="container" ref={containerRef}>
            <div className="pane left-pane" style={{ width: `${leftWidth}%` }}>
                <iframe
                    srcDoc={htmlContent}
                    title="Dynamic Content"
                    className="iframe-content"
                ></iframe>
            </div>
            <div className="divider" ref={dividerRef}></div>
            <div className="pane right-pane">
                <ChatWindow onSend={handleGenerateHtml} />
            </div>
        </div>
    );
};

export default App;
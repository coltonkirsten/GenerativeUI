import React, { useEffect, useState } from 'react';
import makeCompletion from './utils/makeCompletion';

const App = () => {
    const [log, setLog] = useState([]);            
    const [htmlContent, setHtmlContent] = useState(``);
    const [prompt, setPrompt] = useState(''); 

    // Handler for generating HTML using the user prompt
    const handleGenerateHtml = async () => {
        try {
            let response = await makeCompletion(prompt);
            if (response.startsWith("```html") && response.endsWith("```")) {
                response = response.slice(6, -3).trim();
            }
            setHtmlContent(response);
            setLog((prevLog) => [
                ...prevLog.slice(-2),
                {
                    eventType: 'custom-html-generation',
                    elementId: 'html-prompt-button',
                    content: `Generated HTML from prompt: "${prompt}"`,
                    timestamp: new Date().toISOString(),
                },
            ]);
        } catch (error) {
            console.error("Failed to get completion:", error);
        }
    };

    useEffect(() => {
        const handleMessage = (event) => {
            const { type, id, style, value } = event.data;
            if (type) {
                setLog((prevLog) => [
                    ...prevLog.slice(-2),
                    {
                        eventType: type,
                        elementId: id,
                        style: style || null,
                        content: value || null,
                        timestamp: new Date().toISOString(),
                    },
                ]);
            }
        };

        window.addEventListener('message', handleMessage);

        const iframe = document.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', () => {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.addEventListener('click', (e) => {
                    const target = e.target;
                    setLog((prevLog) => [
                        ...prevLog.slice(-2),
                        {
                            eventType: 'click',
                            elementId: target.id || 'unknown',
                            content: `Clicked element: ${target.tagName}`,
                            timestamp: new Date().toISOString(),
                        },
                    ]);
                });
            });
        }

        return () => {
            window.removeEventListener('message', handleMessage);
            if (iframe) {
                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                iframeDocument.removeEventListener('click', handleMessage);
            }
        };
    }, []);


    return (
        <div style={{ textAlign: 'left', marginRight: '100px', width: '100%'}}>
        {/* Prompt input for generating HTML */}
        <div style={{ marginBottom: '20px' }}>
            <label>
                <strong>Enter a prompt for HTML:</strong>
            </label>
            <br />
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                cols={50}
                style={{ 
                    marginTop: '5px',
                    marginBottom: '10px',
                    resize: 'vertical'
                }}
            />
            <br />
            <button
                onClick={handleGenerateHtml}
                style={{
                    padding: '10px 20px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    backgroundColor: 'lightgreen',
                    border: 'none',
                    borderRadius: '4px'
                }}
            >
                Generate HTML
            </button>
        </div>

        <h2>Interaction Logs (Most Recent 3):</h2>
        <ul>
            {log.map((entry, index) => (
                <li key={index}>
                    <strong>Event:</strong> {entry.eventType},
                    <strong> Element ID:</strong> {entry.elementId},
                    {entry.style && <span> <strong>Style:</strong> {entry.style},</span>}
                    {entry.content && <span> <strong>Content:</strong> {entry.content}</span>}
                    <br />
                    <small><strong>Time:</strong> {entry.timestamp}</small>
                </li>
            ))}
        </ul>

        <iframe
            srcDoc={htmlContent}
            title="Dynamic Content"
            style={{ 
                width: '800px', 
                height: '500px', 
                border: '1px solid black', 
                display: 'block' 
            }}
        ></iframe>
    </div>
    );
};

export default App;
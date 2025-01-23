import React, { useEffect, useState, useRef } from 'react';
import { makeInterface, modifyInterface } from './utils/makeCompletion';
import SavedInterfacesModal from './components/SavedInterfacesModal';
import ChatWindow from './components/ChatWindow';
import './App.css';

const App = () => {
    const [htmlContent, setHtmlContent] = useState(``);
    const containerRef = useRef(null);
    const [currentInterface, setCurrentInterface] = useState(``);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleGenerateHtml = async (prompt, setMessages) => {
        try {
            setMessages(prev => [...prev, { sender: 'llm', text: '...' }]);
            const response = await makeInterface(prompt);
            let processedResponse = response;
            if (response.startsWith("```html") && response.endsWith("```")) {
                processedResponse = response.slice(7, -3).trim();
            }
            setHtmlContent(processedResponse);
            setCurrentInterface(processedResponse);
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

    const handleModifyInterface = async (instruction, setMessages) => {
        try {
            setMessages(prev => [...prev, { sender: 'llm', text: '...' }]);
            const response = await modifyInterface(instruction, currentInterface);
            let processedResponse = response;
            if (response.startsWith("```html") && response.endsWith("```")) {
                processedResponse = response.slice(7, -3).trim();
            }
            setHtmlContent(processedResponse);
            setCurrentInterface(processedResponse);
            setMessages(prev => {
                const updated = [...prev];
                updated.pop(); // Remove '...'
                return [...updated, { sender: 'llm', text: processedResponse }];
            });
        } catch (error) {
            console.error("Failed to modify interface:", error);
            setMessages(prev => {
                const updated = [...prev];
                updated.pop(); // Remove '...'
                return [...updated, { sender: 'llm', text: 'Error modifying HTML.' }];
            });
        }
    };

    const handleSave = () => {
        const name = prompt("Enter a name for the interface:");
        if (name) {
            const savedInterfaces = JSON.parse(localStorage.getItem('savedInterfaces') || '[]');
            savedInterfaces.push({ name, content: currentInterface });
            localStorage.setItem('savedInterfaces', JSON.stringify(savedInterfaces));
            alert('Interface saved!');
        }
    };

    const handleShowSavedInterfaces = () => {
        setIsModalOpen(true);
    };

    const handleLoadInterface = (content) => {
        setHtmlContent(content);
        setCurrentInterface(content);
    };

    useEffect(() => {
        // Removed event listener setup and cleanup for the divider
    }, []);

    return (
      <div>
        <div className="container" ref={containerRef}>
          <SavedInterfacesModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onLoadInterface={handleLoadInterface}
          />
            <div className="pane left-pane" style={{ width: '66%'}}>
                <iframe
                    srcDoc={htmlContent}
                    title="Dynamic Content"
                    className="iframe-content"
                ></iframe>
            </div>
            <div className="pane right-pane">
                <ChatWindow onSend={handleGenerateHtml} onModify={handleModifyInterface} />
            </div>
            {isModalOpen && (
                <SavedInterfacesModal onClose={() => setIsModalOpen(false)} onLoad={handleLoadInterface} />
            )}
        </div>
        <div className="bottom-buttons">
          <div>
            <button onClick={handleSave} className="save-button">Save</button>
            <button onClick={handleShowSavedInterfaces} className="saved-interfaces-button">Saved Interfaces</button>
          </div>
        </div>
      </div>
    );
};

export default App;
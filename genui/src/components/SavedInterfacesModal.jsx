import React, { useState } from 'react';

const SavedInterfacesModal = ({ isOpen, onClose, onLoadInterface }) => {
    const [savedInterfaces, setSavedInterfaces] = useState(() => {
        const saved = localStorage.getItem('savedInterfaces');
        return saved ? JSON.parse(saved) : [];
    });

    const handleDelete = (interfaceName) => {
        const updatedInterfaces = savedInterfaces.filter(i => i.name !== interfaceName);
        setSavedInterfaces(updatedInterfaces);
        localStorage.setItem('savedInterfaces', JSON.stringify(updatedInterfaces));
    };

    const handleLoad = (interfaceName) => {
        const selectedInterface = savedInterfaces.find(i => i.name === interfaceName);
        if (selectedInterface) {
            onLoadInterface(selectedInterface.content);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Saved Interfaces</h2>
                <ul>
                    {savedInterfaces.map((item, index) => (
                        <li key={index}>
                            {item.name}
                            <button onClick={() => handleLoad(item.name)}>Load</button>
                            <button onClick={() => handleDelete(item.name)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default SavedInterfacesModal; 
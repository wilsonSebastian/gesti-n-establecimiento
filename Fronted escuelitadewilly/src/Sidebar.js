import React from 'react';



function Sidebar({ user }) {
    return (
        <div className="sidebar">
            <h2>{user.name}</h2>
            
            <button 
                className="logout-btn" 
                onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                }}
            >
                Cerrar Sesión
            </button>
        </div>
    );
}

export default Sidebar;

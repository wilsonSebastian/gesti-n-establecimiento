import React from 'react';
import Sidebar from './Sidebar';

function Dashboard({ user }) {
    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <Sidebar user={user} />
            <div className="content">
                <h1>Bienvenido, {user.name}</h1>
            </div>
        </div>
    );
}

export default Dashboard;

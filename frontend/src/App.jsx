// File: frontend/src/App.jsx

import '/src/App.css';
import Welcome from '/src/components/welcome/Welcome.jsx';
import Header from '/src/components/header.jsx';
import Sidebar from '/src/components/Sidebar.jsx';
import { Outlet } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext.jsx';
import { useState } from 'react';

function App() {
    const { user, loading } = useAuth();
    // State to manage sidebar visibility on mobile
    const [navClick, setNavClick] = useState(false);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            {user ? (
                 <div className="bg-gray-50 min-h-screen">
                    <Header setNavClick={setNavClick} navClick={navClick} />
                    <Sidebar setNavClick={setNavClick} navClick={navClick} />
                    {/* Main content area with a left margin on desktop to accommodate the sidebar */}
                    <main className="md:ml-60 pt-16">
                        <Outlet />
                    </main>
                </div>
            ) : (
                <Welcome />
            )}
        </>
    );
}

export default App;
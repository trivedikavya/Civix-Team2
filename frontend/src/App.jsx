import { useState } from 'react';
import './App.css';
import Welcome from './components/welcome/Welcome';
import Header from './components/header.jsx';
import Sidebar from './components/Sidebar.jsx';
import { Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
    const { user, loading } = useAuth();
    const [navClick, setNavClick] = useState(false);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <>
            {user ? (
                <>
                    <Header navClick={navClick} setNavClick={setNavClick} />
                    <Sidebar navClick={navClick} setNavClick={setNavClick} />
                    <main className="md:ml-64"> {/* Add margin to avoid overlap with sidebar */}
                        <Outlet />
                    </main>
                </>
            ) : (
                <Welcome />
            )}
        </>
    );
}

export default App;
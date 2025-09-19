import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Home from './components/Home.jsx';
import Petitions from './components/petitions/Petitions.jsx';
import CreatePetition from './components/petitions/CreatePetition.jsx'; // Import new component
import Officials from './components/officials/Officials.jsx'; // Import new component
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
// DUE To MAIN JSX controll , We are Not changing Path , we are Redirecting it 
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '/', element: <Home /> },
            { path: 'petitions', element: <Petitions /> },
            { path: 'petitions/create', element: <CreatePetition /> }, // Add create route
            { path: 'officials', element: <Officials /> }, // Add officials route
        ],
    },
]);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
        </AuthProvider>
    </StrictMode>
);
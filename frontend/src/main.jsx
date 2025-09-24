// File: frontend/src/main.jsx

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '/src/index.css';
import App from '/src/App.jsx';
import Home from '/src/components/Home.jsx';
import Petitions from '/src/components/petitions/Petitions.jsx';
import Polls from '/src/components/polls/Polls.jsx'; // Import the new Polls component
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '/src/context/AuthContext.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            { path: '', element: <Home /> },
            { path: 'petitions', element: <Petitions /> },
            { path: 'polls', element: <Polls /> }, // Add the new route for Polls
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
// src/router.tsx
import { createBrowserRouter } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import ManageProfile from "./pages/ManageProfile.tsx";
import ViewAllTransactions from "./pages/ViewAllTransactions.tsx";
import ProfileSettings from "./pages/ProfileSettings.tsx";
import AIStudio from "./pages/AIStudio.tsx";
import FullChatInterface from "./pages/FullChatInterface.tsx";
// import other pages ...

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />,
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/signup',
        element: <Signup />,
    },
    {
        path: '/app/dashboard',
        element: <Dashboard />
    },
    {
        path: '/app/permissions',
        element: <ManageProfile />
    },
    {
        path: '/app/transactions',
        element: <ViewAllTransactions />
    },
    {
        path: '/app/profile',
        element: <ProfileSettings />
    },
    {
        path: '/app/ai-studio',
        element: <AIStudio />
    },
    {
        path: '/app/chat',
        element: <FullChatInterface />
    }

    // other routes...
]);

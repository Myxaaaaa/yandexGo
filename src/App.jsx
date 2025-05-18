import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <AppProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute>
                                        <AdminPanel />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/dashboard"
                                element={
                                    <PrivateRoute>
                                        <UserDashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route path="/" element={<Navigate to="/login" replace />} />
                        </Routes>
                    </Router>
                </AppProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 
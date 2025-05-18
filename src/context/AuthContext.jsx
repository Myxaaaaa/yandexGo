import React, { createContext, useContext, useReducer, useEffect } from 'react';

const initialState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
};

const AuthContext = createContext();

function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                currentUser: action.payload,
            };
        case 'LOGOUT':
            return {
                ...state,
                currentUser: null,
            };
        default:
            return state;
    }
}

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        if (state.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [state.currentUser]);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 
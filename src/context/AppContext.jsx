import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const PARKINGS = [
    { id: 1, name: 'Гум', yandexCount: 0, sunRentCount: 0, scooterNumbers: [], yandexTarget: 60, sunRentTarget: 40 },
    { id: 2, name: 'Вефа', yandexCount: 0, sunRentCount: 0, scooterNumbers: [], yandexTarget: 60, sunRentTarget: 40 },
    { id: 3, name: 'Бета', yandexCount: 0, sunRentCount: 0, scooterNumbers: [], yandexTarget: 60, sunRentTarget: 40 },
    { id: 4, name: 'Южка', yandexCount: 0, sunRentCount: 0, scooterNumbers: [], yandexTarget: 80, sunRentTarget: 60 },
    { id: 5, name: 'Мед академия', yandexCount: 0, sunRentCount: 0, scooterNumbers: [], yandexTarget: 60, sunRentTarget: 40 },
    { id: 6, name: 'Политех', yandexCount: 0, sunRentCount: 0, scooterNumbers: [], yandexTarget: 60, sunRentTarget: 40 },
];

// Загрузка данных из localStorage при инициализации
const loadFromLocalStorage = () => {
    try {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const shifts = JSON.parse(localStorage.getItem('shifts')) || [];
        const penalties = JSON.parse(localStorage.getItem('penalties')) || [];
        const scooters = JSON.parse(localStorage.getItem('scooters')) || [];
        const parkings = JSON.parse(localStorage.getItem('parkings')) || PARKINGS;
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        const replacementRequests = JSON.parse(localStorage.getItem('replacementRequests')) || [];

        return {
            currentUser,
            users: users.length > 0 ? users : [
                {
                    id: 1,
                    login: 'admin',
                    password: 'admin123123',
                    role: 'admin',
                    name: 'Администратор',
                    phone: '',
                    email: '',
                    shifts: [],
                    penalties: [],
                },
            ],
            parkings,
            scooters,
            shifts,
            penalties,
            replacementRequests,
        };
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return {
            currentUser: null,
            users: [
                {
                    id: 1,
                    login: 'admin',
                    password: 'admin123123',
                    role: 'admin',
                    name: 'Администратор',
                    phone: '',
                    email: '',
                    shifts: [],
                    penalties: [],
                },
            ],
            parkings: PARKINGS,
            scooters: [],
            shifts: [],
            penalties: [],
            replacementRequests: [],
        };
    }
};

const initialState = loadFromLocalStorage();

const appReducer = (state, action) => {
    let newState;

    switch (action.type) {
        case 'SET_CURRENT_USER':
            localStorage.setItem('currentUser', JSON.stringify(action.payload));
            return {
                ...state,
                currentUser: action.payload,
            };
        case 'ADD_USER':
            const newUsers = [...state.users, action.payload];
            localStorage.setItem('users', JSON.stringify(newUsers));
            return {
                ...state,
                users: newUsers,
            };
        case 'UPDATE_USER':
            const updatedUsers = state.users.map(user =>
                user.id === action.payload.id ? { ...user, ...action.payload } : user
            );
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            return {
                ...state,
                users: updatedUsers,
            };
        case 'DELETE_USER':
            const filteredUsers = state.users.filter(user => user.id !== action.payload);
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            return {
                ...state,
                users: filteredUsers,
            };
        case 'UPDATE_PARKING':
            const updatedParkings = state.parkings.map(parking =>
                parking.id === action.payload.id ? { ...parking, ...action.payload } : parking
            );
            localStorage.setItem('parkings', JSON.stringify(updatedParkings));
            return {
                ...state,
                parkings: updatedParkings,
            };
        case 'ADD_SHIFT':
            const newShift = action.payload;
            const updatedUsersWithShift = state.users.map(user => {
                if (user.id === newShift.userId) {
                    return {
                        ...user,
                        shifts: [...user.shifts, newShift]
                    };
                }
                return user;
            });
            localStorage.setItem('users', JSON.stringify(updatedUsersWithShift));
            return {
                ...state,
                users: updatedUsersWithShift,
                shifts: [...state.shifts, newShift]
            };
        case 'UPDATE_SHIFT':
            const updatedShift = action.payload;
            const usersWithUpdatedShift = state.users.map(user => {
                if (user.id === updatedShift.userId) {
                    return {
                        ...user,
                        shifts: user.shifts.map(shift =>
                            shift.id === updatedShift.id ? updatedShift : shift
                        )
                    };
                }
                return user;
            });
            localStorage.setItem('users', JSON.stringify(usersWithUpdatedShift));
            return {
                ...state,
                users: usersWithUpdatedShift,
                shifts: state.shifts.map(shift =>
                    shift.id === updatedShift.id ? updatedShift : shift
                )
            };
        case 'ADD_PENALTY':
            const newPenalties = [...state.penalties, action.payload];
            localStorage.setItem('penalties', JSON.stringify(newPenalties));
            return {
                ...state,
                penalties: newPenalties,
            };
        case 'REMOVE_PENALTY':
            const filteredPenalties = state.penalties.filter(penalty => penalty.id !== action.payload);
            localStorage.setItem('penalties', JSON.stringify(filteredPenalties));
            return {
                ...state,
                penalties: filteredPenalties,
            };
        case 'ADD_SCOOTER':
            const newScooters = [...state.scooters, action.payload];
            localStorage.setItem('scooters', JSON.stringify(newScooters));
            return {
                ...state,
                scooters: newScooters,
            };
        case 'UPDATE_SCOOTER':
            const updatedScooters = state.scooters.map(scooter =>
                scooter.id === action.payload.id ? { ...scooter, ...action.payload } : scooter
            );
            localStorage.setItem('scooters', JSON.stringify(updatedScooters));
            return {
                ...state,
                scooters: updatedScooters,
            };
        case 'REMOVE_SCOOTER':
            const filteredScooters = state.scooters.filter(scooter => scooter.id !== action.payload);
            localStorage.setItem('scooters', JSON.stringify(filteredScooters));
            return {
                ...state,
                scooters: filteredScooters,
            };
        case 'RESET_SHIFTS':
            localStorage.setItem('shifts', JSON.stringify([]));
            return {
                ...state,
                shifts: [],
            };
        case 'UPDATE_REPLACEMENT_REQUEST':
            const updatedRequests = state.replacementRequests.map(request => 
                request.id === action.payload.id 
                    ? { ...request, ...action.payload }
                    : request
            );
            localStorage.setItem('replacementRequests', JSON.stringify(updatedRequests));
            return {
                ...state,
                replacementRequests: updatedRequests
            };
        case 'ADD_REPLACEMENT_REQUEST':
            const newRequests = [...(state.replacementRequests || []), action.payload];
            localStorage.setItem('replacementRequests', JSON.stringify(newRequests));
            return {
                ...state,
                replacementRequests: newRequests
            };
        default:
            return state;
    }
};

export const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        localStorage.setItem('users', JSON.stringify(state.users));
    }, [state.users]);

    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
    }, [state.currentUser]);

    useEffect(() => {
        localStorage.setItem('parkings', JSON.stringify(state.parkings));
    }, [state.parkings]);

    useEffect(() => {
        localStorage.setItem('shifts', JSON.stringify(state.shifts));
    }, [state.shifts]);

    useEffect(() => {
        localStorage.setItem('penalties', JSON.stringify(state.penalties));
    }, [state.penalties]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}; 
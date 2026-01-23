import { createContext, useState, useEffect } from 'react';
import { apiEndpoints } from '../lib/api';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(atob(localStorage.getItem('authTokens').split('.')[1])) : null);
    let [loading, setLoading] = useState(true);

    const loginUser = async (username, password) => {
        const response = await fetch(apiEndpoints.token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': username, 'password': password })
        });
        const data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            // Decode SimpleJWT token payload
            const userPayload = JSON.parse(atob(data.access.split('.')[1]));
            setUser(userPayload);

            localStorage.setItem('authTokens', JSON.stringify(data));
            return true;
        } else {
            console.error("Login failed", data);
            return false;
        }
    }

    const registerUser = async (username, email, password) => {
        const response = await fetch(apiEndpoints.register, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'username': username, 'email': email, 'password': password })
        });

        if (response.status === 201) {
            // Automatically login after register
            await loginUser(username, password);
            return true;
        } else {
            const data = await response.json();
            console.error("Register failed", data);
            // Return the error message if possible
            return data;
        }
    }

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    }

    let contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        registerUser: registerUser,
        logoutUser: logoutUser
    }

    useEffect(() => {
        if (authTokens) {
            try {
                setUser(JSON.parse(atob(authTokens.access.split('.')[1])));
            } catch (error) {
                console.error("Failed to decode token:", error);
                setAuthTokens(null);
                setUser(null);
                localStorage.removeItem('authTokens');
            }
        }
        setLoading(false);
    }, [authTokens])


    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    )
}

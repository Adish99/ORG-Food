import { createContext, useContext, useState } from "react";

// Creating AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("orgToken")
    );

    const [user, setUser] = useState(null);

    const isLoggedIn = !!token;

    const userAuthToken = `Bearer ${token}`;

    // Store Token
    const storeTokenInLs = (serverToken) => {

        localStorage.setItem(
            "orgToken",
            serverToken
        );

        setToken(serverToken);

    };

    // Store User
    const storeUser = (userData) => {

        setUser(userData);

    };

    // Logout
    const userLogout = () => {

        setToken("");

        setUser(null);

        localStorage.removeItem("orgToken");

    };

    return (

        <AuthContext.Provider
            value={{

                token,

                user,

                storeUser,

                storeTokenInLs,

                isLoggedIn,

                userLogout,

                userAuthToken

            }}
        >

            {children}

        </AuthContext.Provider>

    );

};

// Custom Hook

export const UseAuth = () => {

    const authContextValue = useContext(AuthContext);

    if (!authContextValue) {

        throw new Error(
            "No auth context value!"
        );

    }

    return authContextValue;

};
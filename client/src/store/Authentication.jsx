import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

// Creating AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(
        localStorage.getItem("orgToken")
    );

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const isLoggedIn = !!token;

    const userAuthToken = token
        ? `Bearer ${token}`
        : "";

    // ==========================
    // Store Token
    // ==========================

    const storeTokenInLs = (serverToken) => {

        localStorage.setItem(
            "orgToken",
            serverToken
        );

        setToken(serverToken);

    };

    // ==========================
    // Store User
    // ==========================

    const storeUser = (userData) => {

        setUser(userData);

    };
    // ==========================
// Update Logged In User
// ==========================

const updateUser = (updatedData) => {

    setUser((prevUser) => ({

        ...prevUser,

        ...updatedData

    }));

};

    // ==========================
    // Logout
    // ==========================

    const userLogout = () => {

        localStorage.removeItem("orgToken");

        setToken("");

        setUser(null);

    };

    // ==========================
    // Get Logged In User
    // ==========================

    const getUser = async () => {

        if (!token) {

            setLoading(false);

            return;

        }

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/users`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.ok) {

                const data = await res.json();
                console.log("GET USER RESPONSE:", data);

                setUser(data);

            } else {

                userLogout();

            }

        } catch (error) {

            console.log(error);

            userLogout();

        } finally {

            setLoading(false);

        }

    };

    // ==========================
    // Run on App Start
    // ==========================

    useEffect(() => {

        getUser();

    }, [token]);

    return (

        <AuthContext.Provider
          value={{

    token,

    user,

    loading,

    isLoggedIn,

    userAuthToken,

    storeTokenInLs,

    storeUser,

    updateUser,

    userLogout

}}
        >

            {children}

        </AuthContext.Provider>

    );

};

// ==========================
// Custom Hook
// ==========================

export const UseAuth = () => {

    const authContextValue = useContext(AuthContext);

    if (!authContextValue) {

        throw new Error(
            "No auth context value!"
        );

    }

    return authContextValue;

};
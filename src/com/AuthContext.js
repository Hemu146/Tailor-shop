import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost/backend/me.php", { withCredentials: true })
            .then(response => {
                if (response.data.success) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            })
            .catch(error => {
                console.error("Session check failed:", error);
                setUser(null);
            });
    }, []);
    
    
    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        axios.get("http://localhost/backend/logout.php", { withCredentials: true });
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

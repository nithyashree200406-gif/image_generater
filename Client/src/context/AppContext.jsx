import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [credit, setCredit] = useState(false);

    const navigate = useNavigate();

    // ✅ FIXED: fallback added
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://imagegenerator-s2dn.onrender.com";

    // ✅ DEBUG (remove later if you want)
    console.log("Backend URL:", backendUrl);

    // 🔹 Load credits
    const loadCreditsData = async () => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/credits`,
                {},
                { headers: { token } }
            );

            if (data.success) {
                setCredit(data.credits);
                setUser(data.user);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // 🔹 Generate Image
    const generateImage = async (prompt) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/image/generate-image`,
                { prompt },
                { headers: { token } }
            );

            if (data.success) {
                loadCreditsData();
                return data.resultImage;
            } else {
                toast.error(data.message);
                loadCreditsData();

                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    // 🔹 Logout
    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    };

    // 🔹 Auto load credits when token exists
    useEffect(() => {
        if (token) {
            loadCreditsData();
        }
    }, [token]);

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        loadCreditsData,
        logout,
        credit,
        generateImage
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
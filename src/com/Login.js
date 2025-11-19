import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        // ✅ Agar password reset ho gaya hai to success alert dikhao
        if (sessionStorage.getItem("reset_done") === "true") {
            Swal.fire({
                icon: 'success',
                title: 'Password Reset Successful',
                text: 'Please login with your new password.',
            });
            sessionStorage.removeItem("reset_done"); // ✅ Remove after showing alert
        }
    }, []);

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost/backend/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include", // ✅ Session maintain karne ke liye
            });

            const data = await response.json();
            Swal.fire({
                icon: data.success ? 'success' : 'error', // Use success or error icon based on the response
                title: data.success ? 'Login Successful' : 'Login Failed',
                text: data.message,
            });

            if (data.success) {
                sessionStorage.setItem("user_email", email); // ✅ Store email
                window.location.href = "/home"; // ✅ Redirect to dashboard
            }
        } catch (error) {
            console.error("Error logging in:", error);
            Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text: 'Unable to login. Please try again.',
            });
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;

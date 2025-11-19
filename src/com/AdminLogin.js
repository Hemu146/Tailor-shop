import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost/backend/admin_login.php", { email, password });
            
            if (response.data.success) {
                sessionStorage.setItem("token", response.data.token); // ✅ Token Store
                Swal.fire({
                    title: "Success",
                    text: "Login successful!",
                    icon: "success",
                    confirmButtonText: "OK",
                });
                navigate("/show_tailor"); // ✅ Navigate using useNavigate
            } else {
                Swal.fire({
                    title: "Error",
                    text: response.data.message,
                    icon: "error",
                    confirmButtonText: "OK",
                });
                setError(response.data.message); // ✅ Show error message
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Login failed. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
            setError("Login failed. Please try again.");
        }
    };

    return (
        <div className="userbackgroudImg">
            <div className="form-style font-style">
                <h2> Login</h2>
                {error && <p style={{ color: "red" }}>{error}</p>} {/* ✅ Error Message */}
                <label className="form-label">Email :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control mb-3"/>
                <label className="form-label">Password :</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control mb-2"/>
                <p><a href="/aforgot-password" style={{ color: "blue", textDecoration: "underline" }}>Forgot Password?</a></p>
                <button onClick={handleLogin} className="mt-1 btn btn-primary">Login</button>
            </div>
        </div>
    );
};
   
export default AdminLogin;

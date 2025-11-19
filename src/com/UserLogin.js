import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import Header from "./Header";
import Swal from 'sweetalert2';


const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
          const response = await axios.post(
            "http://localhost/backend/login.php",
            { email, password },
            { withCredentials: true }
          );
      
          console.log("API Response:", response.data);
      
          if (response.data.success) {
            login(response.data.user);
            console.log("User stored in AuthContext:", response.data.user);
            Swal.fire({
              title: 'Login Successful!',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            }).then(() => {
              navigate("/home");
            });
          } else {
            Swal.fire({
              title: 'Login Failed',
              text: response.data.message,
              icon: 'error',
            });
          }
        } catch (error) {
          console.error("Login error:", error);
          Swal.fire({
            title: 'Error',
            text: 'Login failed. Please try again.',
            icon: 'error',
          });
        }
      };
      

    return (
        <div>
            <Header/>
        <div className="userbackgroudImg">
            <div className="form-style font-style">
                <h2>User Login</h2>
                <label className="form-label">Email :</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control mb-3" />
                <label className="form-label">Password :</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control mb-2" />
                <p><a href="/forgot-password" style={{ color: "blue", textDecoration: "underline" }}>Forgot Password?</a></p>
                <button onClick={handleLogin} className="mt-1 btn btn-primary">Login</button>
            </div>
        </div>
        </div>
    );
};

export default UserLogin;

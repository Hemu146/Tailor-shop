import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import Header from "./Header";
import Swal from 'sweetalert2';


const TLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = (e) => {
    e.preventDefault();
  
    fetch("http://localhost/backend/tlogin.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        if (data.success) {
          localStorage.setItem("tailor_id", data.tailor_id);
          Swal.fire({
            title: 'Login Successful!',
            text: 'Welcome to your dashboard.',
            icon: 'success',
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            navigate(`/tailordashboard/${data.tailor_id}`);
          });
        } else {
          Swal.fire({
            title: 'Login Failed!',
            text: data.message,
            icon: 'error',
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };
  

  return (
    <div>
      <Header />
      <div className="backgroudImg">
        <div className="font-style form-style">
          <h2>Tailor Login</h2>
          <form onSubmit={handleLogin}>
            <label className="form-label">Email :</label>
            <input
              type="email"
              className="form-control mb-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="form-label">Password :</label>
            <input
              type="password"
              className="form-control mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p>
              <Link to="/tforgot-password">Forgot Password?</Link>
            </p>
            <button type="submit" className="mt-1 btn btn-primary">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TLogin;

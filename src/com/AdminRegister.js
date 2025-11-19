import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminRegister = () => {
    // ✅ State variables define karo
    const [username, setusername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost/backend/adminregister.php",
                {
                    username: username, // ✅ 'name' ki jagah 'username' use karo
                    email: email,
                    password: password,
                },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" },
                }
            );

            console.log(response.data);
            Swal.fire({
                title: "Success",
                text: response.data.message,
                icon: "success",
                confirmButtonText: "OK",
            });
        } catch (error) {
            console.error("Registration error:", error);
            Swal.fire({
                title: "Error",
                text: "Registration failed. Please try again.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className="userbackgroudImg">
            <div className="form-style font-style">
                <h2>Registration</h2>
                <form onSubmit={handleSubmit}>
                    <label className="form-label">Name :</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                        className="form-control mb-3"
                    />
                    <label className="form-label">Email :</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control mb-3"
                    />
                    <label className="form-label">Password :</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control mb-3"
                    />
                    <p>
                        <a
                            href="/adminlogin"
                            style={{ color: "blue", textDecoration: "underline" }}
                        >
                            login
                        </a>
                    </p>
                    <button type="submit" className="mt-1 btn btn-primary">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminRegister;

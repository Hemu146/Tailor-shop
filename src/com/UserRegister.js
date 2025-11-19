import React, { useState } from "react";
import axios from "axios";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


const UserRegister = () => {
    // ✅ State variables
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // ✅ New fields
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
      
        if (password !== confirmPassword) {
          Swal.fire({
            title: 'Error',
            text: 'Passwords do not match!',
            icon: 'warning',
          });
          return;
        }
      
        try {
          const response = await axios.post(
            "http://localhost/backend/userregister.php",
            {
              name: username,
              email: email,
              password: password,
              gender: gender,
              address: address,
              city: city,
              phone_number: phoneNumber,
            },
            {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            }
          );
      
          if (response.data.message === "Registration successful!") {
            Swal.fire({
              title: 'Success!',
              text: response.data.message,
              icon: 'success',
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              navigate("/");
            });
          } else {
            Swal.fire({
              title: 'Registration Failed',
              text: response.data.message,
              icon: 'error',
            });
          }
      
          console.log(response.data);
        } catch (error) {
          console.error("Registration error:", error);
          Swal.fire({
            title: 'Error',
            text: 'Registration failed. Please try again.',
            icon: 'error',
          });
        }
      };
      

    return (
        <div>
            <Header />
            <div className="userbackgroudImg">
                <div className="form-style font-style">
                    <h2>User Registration</h2>
                    <form onSubmit={handleSubmit}>
                        <label className="form-label">Name :</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control mb-3"
                            required
                        />

                        <label className="form-label">Email :</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control mb-3"
                            required
                        />

                        <label className="form-label">Password :</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control mb-3"
                            required
                        />

                        <label className="form-label">Confirm Password :</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="form-control mb-3"
                            required
                        />

                        <label className="form-label">Gender :</label>
                        <select
                            className="form-control mb-3"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>

                        <label className="form-label">Address :</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="form-control mb-3"
                            required
                        />

                        <label className="form-label">City :</label>
                        <select
                            className="form-control mb-3"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                        >
                            <option value="">Select City</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Bangalore">Bangalore</option>
                            <option value="Hyderabad">Hyderabad</option>
                            <option value="Ahmedabad">Ahmedabad</option>
                            <option value="Chennai">Chennai</option>
                            <option value="Kolkata">Kolkata</option>
                            <option value="Surat">Surat</option>
                            <option value="Pune">Pune</option>
                            <option value="Jaipur">Jaipur</option>
                            <option value="Lucknow">Lucknow</option>
                            <option value="Kanpur">Kanpur</option>
                            <option value="Nagpur">Nagpur</option>
                            <option value="Indore">Indore</option>
                            <option value="Bhopal">Bhopal</option>
                            <option value="Patna">Patna</option>
                  
                            <option value="Faridabad">Faridabad</option>
                            <option value="Other">Other</option>
                        </select>

                        <label className="form-label">Phone Number :</label>
                        <input
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="form-control mb-3"
                            required
                        />

                        <button type="submit" className="mt-1 btn btn-primary">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UserRegister;

import React, { useState } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const TRegister = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [storeName, setStoreName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/tregister.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          store_name: storeName,
          password,
          gender,
          address,
          city,
          phone_number: phoneNumber
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        setMessage(data.message);
        setName("");
        setEmail("");
        setStoreName("");
        setPassword("");
        setConfirmPassword("");
        setGender("");
        setAddress("");
        setCity("");
        setPhoneNumber("");

        login(data.user);
        navigate("/subpage");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const cities = [
    "Ahmedabad", "Bengaluru", "Bhopal", "Chandigarh", "Chennai", "Coimbatore",
    "Delhi", "Faridabad", "Ghaziabad", "Goa", "Gurgaon", "Hyderabad", "Indore",
    "Jaipur", "Jodhpur", "Kanpur", "Kochi", "Kolkata", "Lucknow", "Ludhiana",
    "Mumbai", "Nagpur", "Nashik", "Noida", "Patna", "Pune", "Rajkot", "Ranchi",
    "Surat", "Thane", "Udaipur", "Vadodara", "Varanasi", "Vijayawada", "Visakhapatnam"
  ];

  return (
    <div>
      <Header />
      <div className="backgroudImg">
        <div className="font-style form-style">
          <h2>Tailor Registration</h2>

          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}

          <form onSubmit={handleRegister}>
            <label className="form-label">Name :</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-control mb-3" />

            <label className="form-label">Email :</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control mb-3" />

            <label className="form-label">Store name :</label>
            <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} required className="form-control mb-3" />

            <label className="form-label">Password :</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control mb-3" />

            <label className="form-label">Confirm password :</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="form-control mb-3" />

            <label className="form-label">Gender :</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className="form-control mb-3" required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label className="form-label">Address :</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control mb-3" required />

            <label className="form-label">City :</label>
            <select value={city} onChange={(e) => setCity(e.target.value)} className="form-control mb-3" required>
              <option value="">Select City</option>
              {cities.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>

            <label className="form-label">Phone Number :</label>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="form-control mb-3" required />

            <button type="submit" className="mt-2 btn btn-primary">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TRegister;

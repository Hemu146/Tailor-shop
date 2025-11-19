import React, { useState } from "react";

const TSendOTP = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/backend/tforgotpassword.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (data.success) {
        localStorage.setItem("tailorEmail", email);
        window.location.href = "/verify-otp"; // OTP verify page par redirect
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div>
      <h2>Tailor Forgot Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSendOTP}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="mt-1 btn btn-primary">Send OTP</button>
      </form>
    </div>
  );
};

export default TSendOTP;

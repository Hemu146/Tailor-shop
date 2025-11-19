import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const AdminForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP

  // 🔹 OTP Send Function
  const handleSendOtp = async () => {
    try {
      const response = await fetch("http://localhost/backend/admin_send_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      Swal.fire({
        title: data.success ? "Success" : "Error", // Title based on success
        text: data.message, // Message from response
        icon: data.success ? "success" : "error", // Success or error icon
        confirmButtonText: "OK", // Button text
      });

      if (data.success) setStep(2); // ✅ OTP sent successfully
    } catch (error) {
      console.error("Error sending OTP:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to send OTP. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // 🔹 OTP Verify Function
  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost/backend/admin_verify_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpInput }),
        credentials: "include", // ✅ Session maintain karne ke liye
      });

      const data = await response.json();
      Swal.fire({
        title: data.success ? "Success" : "Error", // Title based on success
        text: data.message, // Message from response
        icon: data.success ? "success" : "error", // Success or error icon
        confirmButtonText: "OK", // Button text
      });

      if (data.success) {
        sessionStorage.setItem("reset_email", email); // ✅ Email store karo sessionStorage me
        window.location.href = "/areset-password"; // ✅ Redirect to Reset Password page
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to verify OTP. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="userbackgroudImg">
      <div className="form-style font-style">
        {step === 1 ? (
          <>
            <h2>Forgot Password</h2>
            <input 
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-2"
            />
            <button onClick={handleSendOtp} className="mt-1 btn btn-primary">Send OTP</button>
          </>
        ) : (
          <>
            <h2>Verify OTP</h2>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="form-control mb-2"
            />
            <button onClick={handleVerifyOtp} className="mt-1 btn btn-primary">Verify OTP</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminForgotPassword;

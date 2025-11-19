import React, { useState } from "react";
import Swal from "sweetalert2";

const TForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP

  // 🔹 OTP Send Function
  const handleSendOtp = async () => {
    try {
      const response = await fetch("http://localhost/backend/send_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      // SweetAlert2 for OTP send result
      Swal.fire({
        title: data.success ? 'Success' : 'Error',
        text: data.message,
        icon: data.success ? 'success' : 'error',
        confirmButtonText: 'OK',
      });

      if (data.success) setStep(2); // ✅ OTP sent successfully
    } catch (error) {
      console.error("Error sending OTP:", error);
      
      // Show error if there's a problem with the request
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong, please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  // 🔹 OTP Verify Function
  const handleVerifyOtp = async () => {
    try {
      const response = await fetch("http://localhost/backend/verify_otp.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpInput }),
        credentials: "include", // ✅ Session maintain karne ke liye
      });

      const data = await response.json();
      
      // SweetAlert2 for OTP verify result
      Swal.fire({
        title: data.success ? 'Success' : 'Error',
        text: data.message,
        icon: data.success ? 'success' : 'error',
        confirmButtonText: 'OK',
      });

      if (data.success) {
        sessionStorage.setItem("reset_email", email); // ✅ Email store karo sessionStorage me
        window.location.href = "/tresetpassword"; // ✅ Redirect to Reset Password page
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      // Show error if there's a problem with the request
      Swal.fire({
        title: 'Error',
        text: 'Something went wrong, please try again later.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <div className="backgroudImg">
      <div className="font-style form-style">
        {step === 1 ? (
          <>
            <h2>Forgot Password</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control mb-3"
            />
            <button onClick={handleSendOtp} className="mt-1 btn btn-primary">
              Send OTP
            </button>
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
            <button className="mt-1 btn btn-primary" onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TForgotPassword;

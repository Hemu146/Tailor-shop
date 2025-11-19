import React, { useState, useEffect } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_email");
    if (!storedEmail) {
      Swal.fire({
        icon: "error",
        title: "Session Expired",
        text: "Please request OTP again.",
      });
      window.location.href = "/forgot-password";
    } else {
      setEmail(storedEmail);
    }
  }, []);

  // 🔹 Reset Password Function
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match!",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/reset_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword }),
        credentials: "include", // ✅ Maintain session
      });

      const data = await response.json();
      Swal.fire({
        icon: data.success ? "success" : "error",
        title: data.success ? "Password Reset Successful" : "Error",
        text: data.message,
      });

      if (data.success) {
        sessionStorage.removeItem("reset_email"); // ✅ Remove stored email after reset
        sessionStorage.setItem("reset_done", "true");
        window.location.href = "/userlogin"; // ✅ Redirect to login
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="userbackgroudImg">
      <div className="form-style font-style">
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="form-control mb-3"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="form-control mb-3"
        />
        <button onClick={handleResetPassword} className="mt-1 btn btn-primary">
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;

import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const TResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("reset_email");
    if (!storedEmail) {
      Swal.fire({
        title: "Session expired",
        text: "Please request OTP again.",
        icon: "error",
        confirmButtonText: "OK",
      });
      window.location.href = "/tlogin";
    } else {
      setEmail(storedEmail);
    }
  }, []);

  // 🔹 Reset Password Function
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire({
        title: "Error",
        text: "Passwords do not match!",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/tresetpassword.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_password: newPassword, confirm_password: confirmPassword }),
        credentials: "include", // ✅ Maintain session
      });

      const data = await response.json();
      Swal.fire({
        title: data.success ? "Success" : "Error",
        text: data.message,
        icon: data.success ? "success" : "error",
        confirmButtonText: "OK",
      });

      if (data.success) {
        sessionStorage.removeItem("reset_email"); // ✅ Remove stored email after reset
        sessionStorage.setItem("reset_done", "true");
        window.location.href = "/tlogin"; // ✅ Redirect to login
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Swal.fire({
        title: "Error",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="backgroudImg">
      <div className="font-style form-style">
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
        <button onClick={handleResetPassword} className="mt-2 btn btn-primary">
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default TResetPassword;

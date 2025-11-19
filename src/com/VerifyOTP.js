import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // ✅ Get email from sessionStorage
  const email = sessionStorage.getItem("email");

  const handleVerifyOtp = async () => {
    if (!email) {
      Swal.fire({
        title: "Session Expired",
        text: "Session expired. Please request OTP again.",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/tforgot-password"); // Redirect to OTP request page
      });
      return;
    }

    try {
      const response = await fetch("http://localhost/backend/verify_otp.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "OTP verified successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          // ✅ Store email for ResetPassword page
          sessionStorage.setItem("resetEmail", email);
          navigate("/reset-password"); // Redirect to reset password page
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Invalid OTP. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error:", error);
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
        <h2>Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="form-control mb-3"
        />
        <button onClick={handleVerifyOtp} className="mt-2 btn btn-primary">
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default VerifyOTP;

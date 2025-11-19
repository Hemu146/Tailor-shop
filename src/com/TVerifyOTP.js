import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const TVerifyOTP = () => {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;  // ✅ Get email from state

    const handleVerifyOTP = async () => {
        try {
            const response = await fetch("http://localhost/backend/verify_otp.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),  // ✅ Send email and OTP
            });

            const data = await response.json();
            console.log("Parsed Data:", data);

            if (data.success) {
                Swal.fire({
                    title: "Success",
                    text: data.message,
                    icon: "success",
                    confirmButtonText: "OK",
                }).then(() => {
                    navigate("/tresetpassword", { state: { email } });  // ✅ Redirect to Reset Password Page
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: data.message,
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                title: "Error",
                text: "Something went wrong!",
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
                <button onClick={handleVerifyOTP} className="mt-2 btn btn-primary">
                    Verify OTP
                </button>
            </div>
        </div>
    );
};

export default TVerifyOTP;

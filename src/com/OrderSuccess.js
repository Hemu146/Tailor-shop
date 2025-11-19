import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  const handleViewTracking = () => {
    localStorage.setItem("order_id", orderId);
    navigate("/trackorder");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0f7fa, #fff)",
      }}
    >
      <div
        className="card text-center p-5 shadow-lg"
        style={{
          maxWidth: "550px",
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "#ffffff",
          border: "none",
        }}
      >
        <div className="mb-4">
          <FaCheckCircle size={80} className="text-success mb-3 animate-bounce" />
          <h2 className="fw-bold text-success">Payment Successful</h2>
          <p className="text-secondary">Your order has been placed successfully!</p>
        </div>

        <div className="bg-light p-3 rounded mb-4">
          <h6 className="text-muted mb-1">Order ID</h6>
          <h5 className="fw-semibold text-dark">{orderId}</h5>
        </div>

        <div className="mb-3">
          <h6 className="text-muted">Track Your Order</h6>
          <button
            onClick={handleViewTracking}
            className="btn btn-outline-dark w-100 mt-2"
          >
            🔍 View Detailed Tracking
          </button>
        </div>

        <button
          onClick={() => window.location.href = "/"}
          className="btn btn-success w-100 mt-3"
        >
          🛍️ Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;

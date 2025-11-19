import React, { useState } from "react";
import axios from "axios";

const OrderTracking = () => {
  const [orderId, setOrderId] = useState("");
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    if (!orderId.trim()) {
      setError("Please enter a valid Order ID.");
      return;
    }

    setLoading(true);
    setError("");
    setTrackingInfo(null);

    try {
      const response = await axios.get(
        `http://localhost/backend/get_orders.php?track_order=true&order_id=${orderId}`
      );

      console.log("API Response:", response.data); // Debugging

      if (!response.data || response.data.success === false) {
        setError("Order not found.");
      } else {
        setTrackingInfo(response.data);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Error fetching order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-bold mb-4">Track Your Order</h2>
      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={trackOrder}
        className={`w-full p-2 rounded ${loading ? "bg-gray-400" : "bg-blue-500 text-white"}`}
        disabled={loading || !orderId.trim()}
      >
        {loading ? "Tracking..." : "Track Order"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {trackingInfo && (
        <div className="mt-4 p-4 border rounded bg-gray-100">
          <p><strong>Order ID:</strong> {trackingInfo.order_id}</p>
          <p><strong>Status:</strong> {trackingInfo.status}</p>
          <p><strong>Estimated Delivery:</strong> {trackingInfo.estimated_delivery}</p>
          <p><strong>Tracking ID:</strong> {trackingInfo.tracking_id}</p>
          <p><strong>Courier:</strong> {trackingInfo.courier_partner}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;

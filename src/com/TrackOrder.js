import React, { useEffect, useState } from "react";
import TrackingStatus from "./TrackingStatus";

const TrackOrder = () => {
  const [trackingInfo, setTrackingInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const orderId = localStorage.getItem("order_id");

  useEffect(() => {
    if (!orderId) return;

    fetch(`http://localhost/backend/get_tracking_status.php?order_id=${orderId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setTrackingInfo(data.tracking.history);
        } else {
          setTrackingInfo([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching tracking data:", error);
        setTrackingInfo([]);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    const dummyData = [
      {
        status: "Processing",
        message: "Your order is being prepared",
        date: "2025-04-06 23:38:24"
      },
      {
        status: "Dispatched",
        message: "Your order has been shipped from warehouse",
        date: "2025-04-07 10:15:00"
      },
      {
        status: "Out for Delivery",
        message: "Delivery agent is on the way",
        date: "2025-04-08 14:30:00"
      },
      {
        status: "Delivered",
        message: "Your order has been delivered",
        date: "2025-04-09 09:20:00"
      }
    ];
  
    setTimeout(() => {
      setTrackingInfo(dummyData);
      setLoading(false);
    }, 1000);

  }, [orderId]);

  return (
    <div style={{ backgroundColor: "#f0f2f5", minHeight: "100vh", padding: "50px 20px" }}>
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "#fff",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
          📦 Track Your Order
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", fontSize: "16px", color: "#888" }}>
            Loading tracking information...
          </p>
        ) : trackingInfo.length > 0 ? (
          <TrackingStatus trackingInfo={trackingInfo} />
        ) : (
          <p style={{ textAlign: "center", fontSize: "16px", color: "#999" }}>
            No tracking information available.
          </p>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;

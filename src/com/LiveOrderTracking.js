import React, { useEffect, useState } from "react";
import TrackingStatus from "./TrackingStatus";

const LiveOrderTracking = ({ orderId }) => {
    const [trackingInfo, setTrackingInfo] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) return;

        fetch(`http://localhost/backend/get_tracking_status.php?order_id=${orderId}`)
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                if (data.status === "success") {
                    const formatted = data.tracking.history.map((item) => ({
                        status: item.status,
                        message: item.message || item.status, // ✅ FIXED
                        date: item.date
                    }));
                    setTrackingInfo(formatted);
                } else {
                    setError(data.message || "Unable to fetch tracking.");
                }
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
                setError("Something went wrong.");
            });
    }, [orderId]);

    return (
        <div>
            {loading ? (
                <p>Loading tracking info...</p>
            ) : error ? (
                <p style={{ color: "red", textAlign: "center" }}>{error}</p>
            ) : (
                <TrackingStatus trackingInfo={trackingInfo} />
            )}
        </div>
    );
};

export default LiveOrderTracking;

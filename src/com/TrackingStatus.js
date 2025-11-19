import React from "react";
import {
  CheckCircle,
  Clock,
  Truck,
  PackageCheck,
} from "lucide-react";

const getIcon = (status) => {
  switch (status) {
    case "Processing":
      return <PackageCheck size={18} color="#2196f3" />;
    case "Dispatched":
      return <Truck size={18} color="#03a9f4" />;
    case "Out for Delivery":
      return <Clock size={18} color="#ff9800" />;
    case "Delivered":
      return <CheckCircle size={18} color="#4caf50" />;
    default:
      return <PackageCheck size={18} color="#999" />;
  }
};



const getColor = (status) => {
  switch (status) {
    case "Processing":
      return "#2196f3";
    case "Dispatched":
      return "#03a9f4";
    case "Out for Delivery":
      return "#ff9800";
    case "Delivered":
      return "#4caf50";
    default:
      return "#ccc";
  }
};

const TrackingStatus = ({ trackingInfo }) => {
  return (
    <div style={{ paddingLeft: "20px", borderLeft: "3px solid #e0e0e0", position: "relative" }}>
      {trackingInfo.map((step, index) => {
        const isLast = index === trackingInfo.length - 1;

        return (
          <div
            key={index}
            style={{
              marginBottom: isLast ? "0" : "30px",
              position: "relative",
              paddingLeft: "30px",
            }}
          >
            {/* Icon */}
            <div
              style={{
                position: "absolute",
                left: "-13px",
                top: "5px",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                border: `3px solid ${getColor(step.status)}`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {getIcon(step.status)}
            </div>

            {/* Content */}
            <h4 style={{ margin: 0, color: getColor(step.status), fontSize: "16px" }}>
              {step.status}
            </h4>
            <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}>{step.message}</p>
            <small style={{ color: "#888" }}>{step.date}</small>
          </div>
        );
      })}
    </div>
  );
};

export default TrackingStatus;

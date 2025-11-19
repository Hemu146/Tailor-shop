import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";

const TailorDashboard = () => {
  const navigate = useNavigate();
  const [tailorId, setTailorId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("tailor_id");
    console.log("Tailor ID from localStorage:", id); // Debugging ke liye
    if (!id) {
      navigate("/tlogin"); // Agar login nahi hai to TLogin page pe bhej do
    } else {
      setTailorId(id);
    }
  }, [navigate]);

  return (
    <div>
      <h2>Tailor Dashboard</h2>
      {tailorId ? <CustomerTable tailorId={tailorId} /> : <p>Loading...</p>}
    </div>
  );
};

export default TailorDashboard;

import React, { useState } from "react";
import Swal from "sweetalert2";
import main from "./map.jpg"; // Make sure this image is in your src folder

const AddMeasurementsForm = ({ customerId, onMeasurementsAdded }) => {
  const [measurements, setMeasurements] = useState({
    full_length: "",
    shoulder: "",
    sleeve: "",
    sleeve_bottom: "",
    arm_hall: "",
    bicep: "",
    upper_chest: "",
    chest: "",
    upper_waist: "",
    waist: "",
    hip: "",
    pant_length: "",
    thighs: "",
    knee: "",
    bottom: "",
    pant_waist: "",
    type: "",
    description: "",
    date: "",
  });

  const handleChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("🔵 Sending data:", { customer_id: customerId, ...measurements });

    const sanitizedMeasurements = Object.fromEntries(
      Object.entries(measurements).map(([key, value]) => {
        if (value === "" || value === null) return [key, null];
        const cleanedValue = value.replace(/u$/, '');
        if (!isNaN(cleanedValue)) return [key, parseFloat(cleanedValue)];
        return [key, cleanedValue];
      })
    );

    try {
      const response = await fetch("http://localhost/backend/add_measurement.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: customerId, ...sanitizedMeasurements }),
      });

      const text = await response.text();
      console.log("🟡 Raw Response:", text);

      try {
        const data = JSON.parse(text);
        console.log("🟢 Parsed JSON Response:", data);

        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Measurements Added",
            text: "✅ Measurements added successfully!",
          });
          onMeasurementsAdded();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "❌ Failed to add measurements.",
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "warning",
          title: "Invalid Response",
          text: "⚠ Server response is not valid JSON. Please check backend logs.",
        });
      }

    } catch (error) {
      console.error("🔴 Fetch Error:", error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "⚠ Something went wrong. Please check your backend.",
      });
    }
  };

  const measurementFields = [
    { key: "full_length", label: "FULL LENGTH" },
    { key: "shoulder", label: "SHOULDER" },
    { key: "sleeve", label: "SLEEVE" },
    { key: "sleeve_bottom", label: "SLEEVE BOTTOM" },
    { key: "arm_hall", label: "ARM HALL" },
    { key: "bicep", label: "BICEP" },
    { key: "upper_chest", label: "UPPER CHEST" },
    { key: "chest", label: "CHEST" },
    { key: "upper_waist", label: "UPPER WAIST" },
    { key: "waist", label: "WAIST" },
    { key: "hip", label: "HIP" },
    { key: "pant_length", label: "PANT LENGTH" },
    { key: "thighs", label: "THIGHS" },
    { key: "knee", label: "KNEE" },
    { key: "bottom", label: "BOTTOM" },
    { key: "pant_waist", label: "PANT WAIST" },
    { key: "type", label: "TYPE", type: "text" },
    { key: "description", label: "DESCRIPTION", type: "text" },
    { key: "date", label: "DATE", type: "date" },
  ];

  return (
    <div style={{ display: "flex", fontSize: "12px" }}>
      <img src={main} alt="Measurement Guide" style={{ width: "400px", height: "600px" }} />
      <form onSubmit={handleSubmit}>
        <table className="table-bordered ml-5 text-center table-striped table-dark pt-5" style={{ width: "300px" }}>
          <tbody>
            <tr>
              <td colSpan="3" style={{ fontWeight: "bold" }}>TOP</td>
            </tr>
            {measurementFields.map((item, index) => (
              <React.Fragment key={item.key}>
                {index === 10 && (
                  <tr>
                    <td colSpan="3" style={{ fontWeight: "bold" }}>LOWER</td>
                  </tr>
                )}
                <tr>
                  <td>{index + 1}.</td>
                  <td>
                    <label htmlFor={item.key}>{item.label}</label>
                  </td>
                  <td>
                    <input
                      style={{ width: "200px" }}
                      id={item.key}
                      type={item.type || "number"}
                      name={item.key}
                      value={measurements[item.key] || ""}
                      onChange={handleChange}
                      placeholder={item.label}
                    />
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button
          type="submit"
          className="btn btn-primary mt-1 text-white"
          style={{ marginLeft: "48px", width: "300px" }}
        >
          Add Measurement
        </button>
      </form>
    </div>
  );
};

export default AddMeasurementsForm;

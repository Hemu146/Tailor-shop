import React, { useState } from "react";
import choli from "./lll.jpg";
import Swal from "sweetalert2";

const AddCholiMeasurementForm = ({ customerId, onMeasurementsAdded }) => {
  const topFields = [
    "top_length", "shoulder", "sleeves_length", "sleeves_bottom", "arm_hall",
    "bicep", "upper_chest", "chest", "upper_waist", "top_waist", "dart_point",
    "front_neck", "back_neck"
  ];

  const lowerFields = [
    "lower_waist", "lower_length", "hip", "description", "type", "date"
  ];

  const [measurements, setMeasurements] = useState(
    Object.fromEntries([...topFields, ...lowerFields].map((field) => [field, ""]))
  );

  const handleChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetch("http://localhost/backend/add_choli_measurement.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_id: customerId, ...measurements }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🟡 Response Data:", data);
        if (data.success) {
          Swal.fire({
            icon: "success",
            title: "Success!",
            text: "Measurements added successfully!",
          });
          setMeasurements(Object.fromEntries([...topFields, ...lowerFields].map((field) => [field, ""])));
          if (typeof onMeasurementsAdded === "function") onMeasurementsAdded();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: data.message || "Something went wrong!",
          });
        }
      })
      .catch((error) => {
        console.error("🔴 Fetch Error:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Network error occurred!",
        });
      });
  };

  return (
    <div className="d-flex">
      <img src={choli} alt="Choli" style={{ height: "600px", width: "400px" }} />
      <div>
        <form onSubmit={handleSubmit}>
          <table className="table-bordered ml-5 text-center table-striped table-dark" style={{ fontSize: "13px", width: "300px" }}>
            <tbody>
              <tr>
                <td colSpan="2" className="text-center font-weight-bold">TOP</td>
              </tr>
              {topFields.map((key, index) => (
                <tr key={key}>
                  <td style={{ width: "60px" }}>
                    <label htmlFor={key}>{`${index + 1}. ${key.replace(/_/g, " ").toUpperCase()}`}</label>
                  </td>
                  <td>
                    <input
                      style={{ width: "200px" }}
                      id={key}
                      type={key === "date" ? "date" : key === "description" ? "text" : "number"}
                      name={key}
                      value={measurements[key]}
                      onChange={handleChange}
                      placeholder={key.replace(/_/g, " ").toUpperCase()}
                    />
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan="2" className="text-center font-weight-bold">LOWER</td>
              </tr>
              {lowerFields.map((key, index) => (
                <tr key={key}>
                  <td style={{ width: "60px" }}>
                    <label htmlFor={key}>{`${index + 14}. ${key.replace(/_/g, " ").toUpperCase()}`}</label>
                  </td>
                  <td>
                    <input
                      style={{ width: "200px" }}
                      id={key}
                      type={key === "date" ? "date" : key === "description" || key === "type" ? "text" : "number"}
                      name={key}
                      value={measurements[key]}
                      onChange={handleChange}
                      placeholder={key.replace(/_/g, " ").toUpperCase()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="submit" className="btn btn-primary mt-1 text-white" style={{ marginLeft: "48px", width: "300px" }}>
            Add Measurements
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCholiMeasurementForm;

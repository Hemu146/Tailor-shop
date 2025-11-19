import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EditCholi = ({ measurement, onUpdate, onCancel }) => {
  const [editedMeasurement, setEditedMeasurement] = useState({});

  useEffect(() => {
    if (measurement) {
      setEditedMeasurement(measurement);
    }
  }, [measurement]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMeasurement((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost/backend/edit_choli_measurement.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedMeasurement),
      });

      const data = await response.json();

      if (data.success) {
        // Success: Show SweetAlert
        Swal.fire({
          title: "Success!",
          text: "Measurement updated successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          onUpdate(editedMeasurement);
        });
      } else {
        // Error: Show SweetAlert
        Swal.fire({
          title: "Error!",
          text: "Failed to update measurement.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error updating measurement:", error);
      // Show SweetAlert for any network or server errors
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div>
      <h3>Edit Choli Measurements</h3>
      <form onSubmit={handleSubmit}>
        <table className="table-bordered ml-5 text-center table-striped table-dark" style={{ fontSize: "13px" }}>
          <tbody>
            {Object.keys(editedMeasurement).map((key) => (
              key !== "id" && key !== "customer_id" ? (
                <tr key={key}>
                  <td style={{ width: "60px" }}>
                    <label htmlFor={key}>{key.replace("_", " ").toUpperCase()}</label>
                  </td>
                  <td>
                    <input
                      style={{ width: "300px" }}
                      id={key}
                      type={typeof editedMeasurement[key] === "number" ? "number" : "text"}
                      name={key}
                      value={editedMeasurement[key] || ""}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
        <div className="text-center mt-2" style={{ marginRight: "75%" }}>
          <button type="submit" className="btn btn-primary btn-sm mr-2 text-white">Update</button>
          <button type="button" className="btn btn-danger btn-sm text-white" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditCholi;

import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";  // Import SweetAlert2
import EditMeasurementsForm from "./EditMeasurementsForm";

const CustomerMeasurements = () => {
  const [measurements, setMeasurements] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [editingMeasurement, setEditingMeasurement] = useState(null);

  useEffect(() => {
    if (!searchValue) return;
    let url = `http://localhost/backend/get_customer_measurements.php?${searchType}=${encodeURIComponent(searchValue)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMeasurements(data.measurements);
        } else {
          setMeasurements([]);
        }
      })
      .catch((error) => console.error("Error fetching measurements:", error));
  }, [searchValue, searchType]);

  const handleUpdate = (updatedMeasurement) => {
    fetch("http://localhost/backend/update_measurement.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMeasurement),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMeasurements((prev) =>
            prev.map((m) => (m.id === updatedMeasurement.id ? updatedMeasurement : m))
          );
          setEditingMeasurement(null);
          Swal.fire({
            icon: 'success',
            title: 'Measurement updated successfully!',
            showConfirmButton: false,
            timer: 1500
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Failed to update measurement',
            text: data.message || 'Please try again.',
          });
        }
      });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost/backend/delete_measurement.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ measurement_id: id }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setMeasurements((prev) => prev.filter((m) => m.id !== id));
              Swal.fire({
                icon: 'success',
                title: 'Measurement deleted successfully!',
                showConfirmButton: false,
                timer: 1500
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Failed to delete measurement',
                text: data.message || 'Please try again.',
              });
            }
          });
      }
    });
  };

  return (
    <div>
      <h2 className="m-0 mb-3">Customer Measurements</h2>

      <label>
        Search By:
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="form-select mb-2">
          <option value="name">Name</option>
          <option value="contact">Phone Number</option>
        </select>
      </label>

      <input
        style={{ width: "145px" }}
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder={`Enter ${searchType === "name" ? "Name" : "contact"}`}
        className="form-control mb-3"
      />

      {measurements.length === 0 ? (
        <p>No measurements available.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered" style={{ fontSize: "13px" }}>
            <thead className="table-dark">
              <tr>
                <th>TOP <br /> 1 FULL LENGTH</th>
                <th>2 SHOULDER</th>
                <th>3 SLEEVE</th>
                <th>4 SLEEVE BOTTOM</th>
                <th>5 ARM HALL</th>
                <th>6 BICEP</th>
                <th>7 UPPER CHEST</th>
                <th>8 CHEST</th>
                <th>9 UPPER WAIST</th>
                <th>10 WAIST</th>
                <th>LOWER <br />11 HIP</th>
                <th>12 TOP LENGTH</th>
                <th>13 THIGHS</th>
                <th>14 KNEE</th>
                <th>15 BOTTOM</th>
                <th>16 TOP WAIST</th>
                <th>17 TYPE</th>
                <th>18 DESCRIPTION</th>
                <th>19 DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {measurements.map((measurement) => (
                <tr key={measurement.id}>
                  <td>{measurement.full_length || "NULL"}</td>
                  <td>{measurement.shoulder || "NULL"}</td>
                  <td>{measurement.sleeve || "NULL"}</td>
                  <td>{measurement.sleeve_bottom || "NULL"}</td>
                  <td>{measurement.arm_hall || "NULL"}</td>
                  <td>{measurement.bicep || "NULL"}</td>
                  <td>{measurement.upper_chest || "NULL"}</td>
                  <td>{measurement.chest || "NULL"}</td>
                  <td>{measurement.upper_waist || "NULL"}</td>
                  <td>{measurement.waist || "NULL"}</td>
                  <td>{measurement.hip || "NULL"}</td>
                  <td>{measurement.pant_length || "NULL"}</td>
                  <td>{measurement.thighs || "NULL"}</td>
                  <td>{measurement.knee || "NULL"}</td>
                  <td>{measurement.bottom || "NULL"}</td>
                  <td>{measurement.pant_waist || "NULL"}</td>
                  <td>{measurement.type || "NULL"}</td>
                  <td>
                    <div className="scrollable-content">
                      {measurement.description || "NULL"}
                    </div>
                  </td>
                  <td>{measurement.date || "NULL"}</td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <button className="btn btn-primary btn-sm mr-2 text-white" onClick={() => setEditingMeasurement(measurement)}>Edit</button>
                      <button className="btn btn-danger btn-sm mr-2 text-white" onClick={() => handleDelete(measurement.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingMeasurement && (
        <EditMeasurementsForm
          measurements={editingMeasurement}
          onUpdate={handleUpdate}
          onCancel={() => setEditingMeasurement(null)}
        />
      )}
    </div>
  );
};

export default CustomerMeasurements;

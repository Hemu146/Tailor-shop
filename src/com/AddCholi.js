import React, { useState, useEffect } from "react";
import EditCholi from "./EditCholi";
import Swal from "sweetalert2";

const AddCholi = () => {
  const [measurements, setMeasurements] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchMeasurements = () => {
    if (!searchValue) return;

    let url = `http://localhost/backend/get_choli_measurements.php?${searchType}=${encodeURIComponent(searchValue)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMeasurements(data.measurements);
        } else {
          setMeasurements([]);
        }
        setHasSearched(true);
      })
      .catch((error) => console.error("Error fetching measurements:", error));
  };

  useEffect(() => {
    if (searchValue.trim() !== "") {
      fetchMeasurements();
    } else {
      setHasSearched(false);
    }
  }, [searchValue, searchType]);

  const handleEdit = (measurement, e) => {
    e.preventDefault();
    setEditingMeasurement(measurement);
  };

  const handleDelete = async (id, event) => {
    event.preventDefault();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This measurement will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch("http://localhost/backend/delete_choli_measurement.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (data.success) {
          setMeasurements((prev) => prev.filter((item) => item.id !== id));
          Swal.fire("Deleted!", "Measurement deleted successfully!", "success");
        } else {
          Swal.fire("Failed!", "Failed to delete measurement.", "error");
        }
      } catch (error) {
        console.error("Error deleting:", error);
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  return (
    <div>
      {/* 🔍 Search Bar */}
      <div>
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
      </div>

      {/* ✅ Show data in horizontal table format */}
      {hasSearched && measurements.length > 0 ? (
        <table className="table table-bordered mb-4" style={{ fontSize: "13px" }}>
          <thead className="table-dark">
            <tr>
              <th>1 TOP LENGTH</th>
              <th>2 SHOULDER</th>
              <th>3 SLEEVE LENGTH</th>
              <th>4 SLEEVE BOTTOM</th>
              <th>5 ARM HALL</th>
              <th>6 BICEP</th>
              <th>7 UPPER CHEST</th>
              <th>8 CHEST</th>
              <th>9 UPPER WAIST</th>
              <th>10 TOP WAIST</th>
              <th>11 DART POINT</th>
              <th>12 FRONT NECK</th>
              <th>13 BACK NECK</th>
              <th>14 LOWER WAIST</th>
              <th>15 LOWER LENGTH</th>
              <th>16 HIP</th>
              <th>17 DESCRIPTION</th>
              <th>18 TYPE</th>
              <th>19 DATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((measurement) => (
              <tr key={measurement.id}>
                <td>{measurement.top_length || "NULL"}</td>
                <td>{measurement.shoulder || "NULL"}</td>
                <td>{measurement.sleeves_length || "NULL"}</td>
                <td>{measurement.sleeves_bottom || "NULL"}</td>
                <td>{measurement.arm_hall || "NULL"}</td>
                <td>{measurement.bicep || "NULL"}</td>
                <td>{measurement.upper_chest || "NULL"}</td>
                <td>{measurement.chest || "NULL"}</td>
                <td>{measurement.upper_waist || "NULL"}</td>
                <td>{measurement.top_waist || "NULL"}</td>
                <td>{measurement.dart_point || "NULL"}</td>
                <td>{measurement.front_neck || "NULL"}</td>
                <td>{measurement.back_neck || "NULL"}</td>
                <td>{measurement.lower_waist || "NULL"}</td>
                <td>{measurement.lower_length || "NULL"}</td>
                <td>{measurement.hip || "NULL"}</td>
                <td>
                  <div className="scrollable-content">{measurement.description || "NULL"}</div>
                </td>
                <td>{measurement.type || "NULL"}</td>
                <td>{measurement.date || "NULL"}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm text-white" onClick={(e) => handleEdit(measurement, e)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm text-white" onClick={(e) => handleDelete(measurement.id, e)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : hasSearched ? (
        <p>No measurements found.</p>
      ) : null}

      {editingMeasurement && (
        <EditCholi
          measurement={editingMeasurement}
          onUpdate={(updatedMeasurement) => {
            setMeasurements((prev) =>
              prev.map((item) => (item.id === updatedMeasurement.id ? updatedMeasurement : item))
            );
            setEditingMeasurement(null);
            Swal.fire("Updated!", "Measurement updated successfully!", "success");
          }}
          onCancel={() => setEditingMeasurement(null)}
        />
      )}
    </div>
  );
};

export default AddCholi;

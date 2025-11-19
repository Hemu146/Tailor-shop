import React, { useState, useEffect } from "react";

const EditMeasurementsForm = ({ measurements, onUpdate, onCancel }) => {
  const [editedMeasurements, setEditedMeasurements] = useState(measurements);

  useEffect(() => {
    setEditedMeasurements(measurements);
  }, [measurements]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedMeasurements);
  };

  return (
    <div>
      <h3 >Edit Measurements</h3>
      <form onSubmit={handleSubmit}>
        <table className="table-bordered text-center table-striped table-dark ml-5" style={{ fontSize: "13px", width: "22%" }}>
          <thead>
            <tr>
              <th>Measurement</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(editedMeasurements).map((key) => (
              key !== "id" && key !== "customer_id" ? (
                <tr key={key}>
                  <td style={{ textTransform: "capitalize" }}>{key.replace("_", " ")}</td>
                  <td>
                    <input
                      style={{ width: "100% " }}
                      type="text"
                      name={key}
                      value={editedMeasurements[key] || ""}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
              ) : null
            ))}
          </tbody>
        </table>
        <div style={{marginLeft:"150px"}} className="mt-2">
          <button type="submit" className="btn btn-primary btn-sm mr-2 text-white">Update</button>
          <button type="button" className="btn btn-danger btn-sm text-white" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditMeasurementsForm;

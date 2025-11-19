import { useEffect, useState } from "react";

const MeasurementTable = ({ customerId, newMeasurements }) => {
  const [measurements, setMeasurements] = useState([]);

  // Fetch Measurements When Component Mounts or New Measurements Arrive
  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        const response = await fetch(`http://localhost/backend/get_customer_measurements.php?customer_id=${customerId}`);
        const data = await response.json();
        if (data.success) {
          setMeasurements(data.measurements);
        }
      } catch (error) {
        console.error("Error fetching measurements:", error);
      }
    };

    fetchMeasurements();
  }, [customerId, newMeasurements]); // ⬅️ Dependency Array Updated

  return (
    <div>
      <h2>Body Measurements</h2>
      <table>
        <thead>
          <tr>
            <th>Full Length</th>
            <th>Shoulder</th>
            <th>Sleeve</th>
            <th>Sleeve Bottom</th>
            <th>Arm Hole</th>
            <th>Bicep</th>
            <th>Upper Chest</th>
            <th>Chest</th>
            <th>Upper Waist</th>
            <th>Waist</th>
            <th>pant Waist</th>
            <th>Hip</th>
            <th>Pant Length</th>
            <th>Thighs</th>
            <th>Knee</th>
            <th>Bottom</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {measurements.length > 0 ? (
            measurements.map((m, index) => (
              <tr key={index}>
                <td>{m.full_length}</td>
                <td>{m.shoulder}</td>
                <td>{m.sleeve}</td>
                <td>{m.sleeve_bottom}</td>
                <td>{m.arm_hole}</td>
                <td>{m.bicep}</td>
                <td>{m.upper_chest}</td>
                <td>{m.chest}</td>
                <td>{m.upper_waist}</td>
                <td>{m.waist}</td>
                <td>{m.pant_waist}</td>
                <td>{m.hip}</td>
                <td>{m.pant_length}</td>
                <td>{m.thighs}</td>
                <td>{m.knee}</td>
                <td>{m.bottom}</td>
                <td>{m.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="16">No measurements added yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MeasurementTable;

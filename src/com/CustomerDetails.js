import React, { useState, useEffect } from "react";
import AddMeasurementsForm from "./AddMeasurementsForm";

const CustomerDetails = ({ selectedCustomer }) => {
  const [measurements, setMeasurements] = useState(null);

  const fetchCustomerMeasurements = async (customerId) => {
    try {
      const response = await fetch(`http://localhost/backend/get_customer_measurements.php?customer_id=${customerId}`);
      const data = await response.json();
      if (data.success) {
        setMeasurements(data.measurements);
      } else {
        setMeasurements(null);
      }
    } catch (error) {
      console.error("Error fetching measurements:", error);
    }
  };

  useEffect(() => {
    if (selectedCustomer) {
      fetchCustomerMeasurements(selectedCustomer.id);
    }
    
  }, [selectedCustomer]);

  return (
    <div className="font-style" >
      <h2></h2>
      {selectedCustomer ? (
        <div className="p-3  card " >
          <h2>Customer Details</h2>
          <div >
          <p><strong>Name:</strong> {selectedCustomer.name}</p>
          <p><strong>Contact:</strong> {selectedCustomer.contact}</p>
          <p><strong>Address:</strong> {selectedCustomer.address}</p>
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default CustomerDetails;

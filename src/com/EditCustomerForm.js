import React, { useState } from "react";
import Swal from "sweetalert2";

const EditCustomerForm = ({ customer, onUpdate, onCancel }) => {
  const [updatedCustomer, setUpdatedCustomer] = useState({ ...customer });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Input field change handler
  const handleChange = (e) => {
    setUpdatedCustomer({ ...updatedCustomer, [e.target.name]: e.target.value });
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost/backend/update_customer.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCustomer),
      });

      const data = await response.json();

      if (data.success) {
        // Success SweetAlert
        Swal.fire({
          title: 'Success!',
          text: 'Customer details updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        });

        onUpdate(updatedCustomer); // Update parent state
      } else {
        setError("Failed to update customer.");
        // Error SweetAlert
        Swal.fire({
          title: 'Error!',
          text: '❌ ' + data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      // Network Error SweetAlert
      Swal.fire({
        title: 'Error!',
        text: '❌ ' + err.message,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }

    setLoading(false);
  };

  return (
    <div className="border p-3 fw-bold card">
      <h2>Edit Customer Details</h2>
      
      {error && <p className="text-danger">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-3">
            <label>Name :</label>
            <input 
              type="text" 
              name="name" 
              value={updatedCustomer.name} 
              onChange={handleChange} 
              required 
              className="form-control mb-2" 
            />
          </div>
          <div className="col-md-3">
            <label>Phone :</label>
            <input 
              type="text" 
              name="contact" 
              value={updatedCustomer.contact} 
              onChange={handleChange} 
              required 
              className="form-control mb-2" 
            />
          </div>
          <div className="col-md-3">
            <label>Address :</label>
            <input 
              type="text" 
              name="address" 
              value={updatedCustomer.address} 
              onChange={handleChange} 
              required 
              className="form-control mb-2" 
            />
          </div>
          <div>
            <button 
              type="submit" 
              className="mt-1 btn btn-success mr-2 text-white" 
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
            <button 
              type="button" 
              onClick={onCancel} 
              className=" mt-1 btn btn-primary text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditCustomerForm;

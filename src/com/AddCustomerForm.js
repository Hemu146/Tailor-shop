import React, { useState } from "react";
import Swal from "sweetalert2";

const AddCustomerForm = ({ onCustomerAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tailor_id = localStorage.getItem("tailor_id");

    try {
      const response = await fetch("http://localhost/backend/add_customer.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, tailor_id }),
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Customer Added",
          text: "Customer added successfully!",
        });
        setFormData({ name: "", contact: "", address: "" });
        onCustomerAdded(); // Refresh customer list
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.message || "Failed to add customer.",
        });
      }
    } catch (error) {
      console.error("Error adding customer:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while adding customer.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="row" style={{ justifyContent: "center" }}>
      <h2 className="text-center mt-4 mb-4">Manage Customer</h2>
      <div className="pl-2 pr-2 row">
        <div className="col-md-3 mb-3">
          <label> Enter Name :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="form-control mb-1 mr-2"
          />
        </div>
        <div className="col-md-3 mb-3">
          <label> Enter Phone No :</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Phone"
            required
            className="form-control mb-1 mr-2"
          />
        </div>
        <div className="col-md-3 mb-3">
          <label> Enter Address :</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="form-control mb-1 mr-2"
          />
        </div>
        <div className="col-md-3 mb-3" style={{ marginTop: "35px" }}>
          <button type="submit" className="btn btn-primary text-white">Add Customer</button>
        </div>
      </div>
    </form>
  );
};

export default AddCustomerForm;

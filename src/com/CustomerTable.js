import React, { useState } from "react";

const CustomerTable = ({ customers, onSelectCustomer, onEditCustomer, onDeleteCustomer }) => {
  return (
    <table width="100%"  className="table table-hover table-borderless border-bottom  ">
    <thead className="table-dark ">
      <tr>
        <th>Name</th>
        <th>Contact</th>
        <th>Address</th>
        <th className="text-center">Actions</th>
      </tr>
    </thead>
    <tbody>
      {customers.length > 0 ? (
        customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.name}</td>
            <td>{customer.contact}</td>
            <td
  style={{
    width: "300px",
    maxHeight: "100px",
    overflow: "auto",
    display: "block",
    scrollbarWidth: "none", // Firefox के लिए
    msOverflowStyle: "none", // IE/Edge के लिए
  }}
  className="hide-scrollbar"
>
  {customer.address}</td>
            <td className="text-center">
              <button className="btn btn-sm btn-success mr-3 pl-4 pr-4 text-white" onClick={() => onSelectCustomer(customer)}>View</button> 
              <button className="btn btn-sm btn-primary mr-3 pl-4 pr-4 text-white" onClick={() => onEditCustomer(customer)}>Edit</button>
              <button className="btn btn-sm btn-danger pl-4 pr-4 text-white" onClick={() => onDeleteCustomer(customer.id)}>Delete</button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5">No customers found.</td>
        </tr>
      )}
    </tbody>
  </table>
  
  );
};
const style = {
  
}

export default CustomerTable;

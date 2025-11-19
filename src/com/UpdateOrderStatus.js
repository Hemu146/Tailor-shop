import { useState } from "react";

const UpdateOrderStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState("Pending");
  const [message, setMessage] = useState("");

  const updateStatus = () => {
    fetch("http://localhost/backend/update_order_status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order_id: orderId, status: status }),
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.success ? "Order updated!" : data.error))
      .catch(() => setMessage("Failed to update order"));
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Update Order Status</h2>
      <input
        type="text"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
        className="border p-2 w-full mb-2"
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="border p-2 w-full mb-2">
        <option value="Pending">Pending</option>
        <option value="Confirmed">Confirmed</option>
        <option value="Shipped">Shipped</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
      </select>
      <button onClick={updateStatus} className="bg-blue-500 text-white px-4 py-2 rounded">Update</button>
      {message && <p className="mt-2 text-red-500">{message}</p>}
    </div>
  );
};

export default UpdateOrderStatus;

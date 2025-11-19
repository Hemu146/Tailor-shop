import React, { useState, useEffect } from "react";
import axios from "axios";
import Admin_nav from "./Admin_nav";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // Holds input value
    const [filteredOrders, setFilteredOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost/backend/orders.php");

            console.log("Response Data:", response.data); // Debugging

            if (response.data.error) {
                console.error("API Error:", response.data.error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.error,
                });
                setOrders([]);
                setFilteredOrders([]);
            } else if (Array.isArray(response.data)) {
                setOrders(response.data);
                setFilteredOrders(response.data);
            } else {
                console.error("Unexpected API response:", response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Unexpected API response.',
                });
                setOrders([]);
                setFilteredOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to load orders. Please try again.',
            });
            setOrders([]);
            setFilteredOrders([]);
        }
    };

    const handleSearch = (query) => {
        const filtered = orders.filter((order) =>
            order.user_name.toLowerCase().includes(query.toLowerCase()) ||
            order.store_name.toLowerCase().includes(query.toLowerCase()) ||
            order.status.toLowerCase().includes(query.toLowerCase()) ||
            order.order_date.includes(query) ||
            order.amount.toString().includes(query) ||
            (order.payment_id && order.payment_id.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredOrders(filtered);
    };

    useEffect(() => {
        handleSearch(searchQuery); // Trigger the search filter whenever the search query changes
    }, [searchQuery]); // Dependency array makes it run when searchQuery changes

    return (
        <div className="font-style">
            <div className="row flex-grow-1">
                {/* Sidebar */}
                <div className="col-md-3 col-lg-2 bg-light vh-100 overflow-auto position-sticky top-0 bg-white border">
                    <Admin_nav />
                </div>

                <div className="container mt-4 mb-4 p-3 font-style" style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.7)", width: "80%" }}>
                <div className="d-flex justify-content-end mt-3">

<button
className="btn btn-danger "
onClick={() => {
localStorage.removeItem("tailor_id");
localStorage.removeItem("tailorEmail");
navigate("/adminlogin");
}}
>
Logout
</button>
</div>
                    <h2 className="text-center">Orders List</h2>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                        />
                    </div>
                    {filteredOrders.length === 0 ? (
                        <p className="text-center text-muted">No orders found.</p>
                    ) : (
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>User Name</th>
                                    <th>Store Name</th>
                                    <th>Status</th>
                                    <th>Order Date</th>
                                    <th>Amount</th>
                                    <th>Payment ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.user_name}</td>
                                        <td>{order.store_name}</td>
                                        <td>{order.status}</td>
                                        <td>{order.order_date}</td>
                                        <td>{order.amount}</td>
                                        <td>{order.payment_id || "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;

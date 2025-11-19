import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomerTable from "./CustomerTable";
import AddCustomerForm from "./AddCustomerForm";
import CustomerDetails from "./CustomerDetails";
import EditCustomerForm from "./EditCustomerForm";
import AddMeasurementsForm from "./AddMeasurementsForm";
import CustomerMeasurements from "./CustomerMeasurementsForm";
import AddCholiMeasurementForm from "./AddCholiMeasurementForm";
import AddCholi from "./AddCholi";
import EditCholi from "./EditCholi";
import TailorProducts from "./TailorProduct";
import Header from "./Header";
import searchicon from "./search-interface-symbol.png";
import Swal from 'sweetalert2'; // Import SweetAlert2

const TailorDashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tailorId, setTailorId] = useState(null);
  const [subscriptionAlert, setSubscriptionAlert] = useState(false);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTailorId = localStorage.getItem("tailor_id");
    if (!storedTailorId) {
      navigate("/tlogin");
    } else {
      setTailorId(storedTailorId);
    }
  }, [navigate]);

  const fetchCustomers = async () => {
    if (!tailorId) return;
    try {
      const response = await fetch(`http://localhost/backend/get_customers.php?tailor_id=${tailorId}`);
      const data = await response.json();
      setCustomers(data.success ? data.customers : []);
    } catch (error) {
      console.error("🔴 Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [tailorId]);

  useEffect(() => {
    const tailorEmail = localStorage.getItem("tailorEmail");
    if (!tailorEmail) return;

    fetch('http://localhost/backend/tget_subscription.php', {
      method: 'POST',
      body: JSON.stringify({ email: tailorEmail }),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          const today = new Date();
          const endDate = new Date(data.data.subscription_end_date);
          const diffTime = endDate - today;
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (daysLeft <= 1 && data.data.subscription_status !== 'expired') {
            setSubscriptionAlert(true);
          }
        } else {
          console.log("Subscription check error:", data.message);
        }
      })
      .catch(err => {
        console.error("Fetch error:", err);
      });
  }, []);

  useEffect(() => {
    if (tailorId) {
      fetchCustomers();

      fetch(`http://localhost/backend/get_tailor_orders.php?tailor_id=${tailorId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          } else {
            setOrders([]);
          }
        })
        .catch(err => console.error("Error fetching orders:", err));
    }
  }, [tailorId]);

  const filteredCustomers = customers.filter((customer) => {
    const name = customer.name ? customer.name.toLowerCase() : "";
    const email = customer.email ? customer.email.toLowerCase() : "";
    const contact = customer.contact ? customer.contact.toLowerCase() : "";

    return (
      name.includes(searchQuery.toLowerCase()) ||
      email.includes(searchQuery.toLowerCase()) ||
      contact.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div>
      <Header />

      {/* ✅ Logout button added here */}
      <div className="text-end p-2">
        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.removeItem("tailor_id");
            localStorage.removeItem("tailorEmail");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
      <TailorProducts />

      {subscriptionAlert && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
          <p>
            ⚠ Your subscription is about to expire.{" "}
            <a href="/tailor/subscribe" className="underline text-blue-600 font-semibold">
              Renew now
            </a>{" "}
            to continue uninterrupted access.
          </p>
        </div>
      )}

      <div className="card p-4 my-4 shadow">
        <h4 className="mb-3">Orders for Your Products</h4>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Search by Order ID, User Name, Product, Status, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Amount (₹)</th>
              <th>Status</th>
              <th>Description</th>
              <th>Order Date</th>
            </tr>
          </thead>

          <tbody>
            {orders
              .filter((order) =>
                Object.values(order).some((value) =>
                  String(value).toLowerCase().includes(searchQuery.toLowerCase())
                )
              )
              .map((order, idx) => (
                <tr key={idx}>
                  <td>{order.order_id}</td>
                  <td>{order.user_name}</td>
                  <td>{order.category}</td>
                  <td>{order.quantity}</td>
                  <td>{order.amount}</td>
                  <td>{order.status}</td>
                  <td>{order.product_name}</td>
                  <td>{new Date(order.order_date).toLocaleString()}</td>
                </tr>
              ))}

            {orders.filter((order) =>
              Object.values(order).some((value) =>
                String(value).toLowerCase().includes(searchQuery.toLowerCase())
              )
            ).length === 0 && (
              <tr>
                <td colSpan="7" className="text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="m-3 font-style">
        <div style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.7)" }} className="mt-2 mb-2 p-2 card">
          <AddCustomerForm onCustomerAdded={fetchCustomers} />

          <div style={{ position: "relative" }}>
            <img
              src={searchicon}
              width="22px"
              style={{
                position: "absolute",
                top: "50%",
                left: "10px",
                transform: "translateY(-50%)",
              }}
              alt="Search"
            />
            <input
              type="text"
              placeholder="Search for name, email, or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ margin: "10px 0", padding: "8px 10px 8px 35px", width: "100%" }}
              className="form-control mb-3"
            />
          </div>

          <CustomerTable
            customers={filteredCustomers}
            onSelectCustomer={setSelectedCustomer}
            onEditCustomer={(customer) => {
              setSelectedCustomer(customer);
              setIsEditing(true);
            }}
            onDeleteCustomer={(customerId) => {
              Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel',
              }).then((result) => {
                if (result.isConfirmed) {
                  fetch("http://localhost/backend/delete_customer.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: customerId }),
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) {
                        Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
                        fetchCustomers();
                      } else {
                        Swal.fire('Error!', 'Failed to delete customer.', 'error');
                      }
                    })
                    .catch((error) => console.error("Error deleting customer:", error));
                }
              });
            }}
          />

          {isEditing && selectedCustomer && (
            <EditCustomerForm
              customer={selectedCustomer}
              onUpdate={() => {
                fetchCustomers();
                setIsEditing(false);
              }}
              onCancel={() => setIsEditing(false)}
            />
          )}

          {!isEditing && selectedCustomer && (
            <div>
              <CustomerDetails selectedCustomer={selectedCustomer} />
              <div className="mt-2 mb-2 p-2 card">
                <CustomerMeasurements customerId={selectedCustomer.id} />
              </div>
              <div className="mt-2 mb-2 p-2 card">
                <h3>Add Measurements</h3>
                <AddMeasurementsForm customerId={selectedCustomer.id} onMeasurementsAdded={fetchCustomers} />
              </div>
              <div className="mt-2 mb-2 p-2 card">
                <h3>Choli Measurements</h3>
                <AddCholi customerId={selectedCustomer.id} />
                <AddCholiMeasurementForm customerId={selectedCustomer.id} onMeasurementsAdded={fetchCustomers} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TailorDashboard;

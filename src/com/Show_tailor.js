import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Admin_nav from "./Admin_nav";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const ShowTailor = () => {
    const [tailors, setTailors] = useState([]);
    const [search, setSearch] = useState("");
    const [newTailor, setNewTailor] = useState({
        name: "",
        email: "",
        password: "",
        store_name: "",
        gender: "",
        city: "",
        address: "",
        phone_number: "",
    });
    const [editTailor, setEditTailor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTailors();
    }, []);

    const fetchTailors = async () => {
        try {
            const response = await axios.get("http://localhost/backend/get_tailors.php");
            if (response.data.success) {
                setTailors([...response.data.tailors]);
            } else {
                Swal.fire("Error", "Error fetching tailors: " + response.data.message, "error");
            }
        } catch (error) {
            Swal.fire("Error", "Error fetching tailors: " + error.message, "error");
        }
    };

    const handleAddTailor = async () => {
        // Frontend validation
        const { name, email, password, store_name, gender, city, address, phone_number } = newTailor;
        
        if (
            !name.trim() || !email.trim() || !password.trim() || !store_name.trim() ||
            !gender.trim() || !city.trim() || !address.trim() || !phone_number.trim()
        ) {
            Swal.fire("Oops!", "Please enter all fields", "warning");
            return;
        }
    
        try {
            const response = await axios.post("http://localhost/backend/add_tailor.php", newTailor);
            Swal.fire("Success", response.data.message || "Tailor added successfully", "success");
            setNewTailor({
                name: "",
                email: "",
                password: "",
                store_name: "",
                gender: "",
                city: "",
                address: "",
                phone_number: "",
            });
            fetchTailors();
        } catch (error) {
            Swal.fire("Error", "Error Adding Tailor: " + (error.response?.data?.message || error.message), "error");
        }
    };
    

    const handleDelete = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirmDelete.isConfirmed) {
            try {
                const response = await axios.post("http://localhost/backend/delete_tailor.php", { id });
                Swal.fire("Deleted!", response.data.message || "Tailor deleted successfully", "success");
                fetchTailors();
            } catch (error) {
                Swal.fire("Error", "Error deleting tailor: " + (error.response?.data?.message || error.message), "error");
            }
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
        // If search is empty, fetch all tailors again
        if (!e.target.value) {
            fetchTailors();
        } else {
            const filteredTailors = tailors.filter((tailor) =>
                tailor.name.toLowerCase().includes(e.target.value.toLowerCase()) ||
                tailor.store_name.toLowerCase().includes(e.target.value.toLowerCase())
            );
            setTailors(filteredTailors);
        }
    };

    const handleEdit = (tailor) => {
        setEditTailor({ ...tailor });
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.post("http://localhost/backend/update_tailor.php", editTailor);
            Swal.fire("Success", response.data.message || "Tailor updated successfully", "success");
            setEditTailor(null);
            fetchTailors();
        } catch (error) {
            Swal.fire("Error", "Error Updating Tailor: " + (error.response?.data?.message || error.message), "error");
        }
    };

    return (
        <div className="font-style">
      
            <div className="row flex-grow-1">
                {/* Sidebar - Scrollable */}
                <div className="col-md-3 col-lg-2 bg-light vh-100 overflow-auto position-sticky top-0 bg-white border">
                    <Admin_nav />
                </div>
                <div className="container mt-4 mb-4 p-3" style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.7)", width: "80%" }}>
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
                    <h2 className="mb-4 text-center">Tailor Management</h2>

                    {/* Search Input */}
                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search by name or store" 
                            value={search} 
                            onChange={handleSearch} 
                        />
                    </div>

                    {/* Add Tailor */}
                    <div className="card p-4 mb-4">
                        <h3>Add Tailor</h3>
                        <div className="row">
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Full Name"
                                    value={newTailor.name}
                                    onChange={(e) => setNewTailor({ ...newTailor, name: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="email"
                                    className="form-control mb-2"
                                    placeholder="Email Address"
                                    value={newTailor.email}
                                    onChange={(e) => setNewTailor({ ...newTailor, email: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="password"
                                    className="form-control mb-2"
                                    placeholder="Password"
                                    value={newTailor.password}
                                    onChange={(e) => setNewTailor({ ...newTailor, password: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Store Name"
                                    value={newTailor.store_name}
                                    onChange={(e) => setNewTailor({ ...newTailor, store_name: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Gender"
                                    value={newTailor.gender}
                                    onChange={(e) => setNewTailor({ ...newTailor, gender: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="City"
                                    value={newTailor.city}
                                    onChange={(e) => setNewTailor({ ...newTailor, city: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Address"
                                    value={newTailor.address}
                                    onChange={(e) => setNewTailor({ ...newTailor, address: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3">
                                <input
                                    type="text"
                                    className="form-control mb-2"
                                    placeholder="Phone Number"
                                    value={newTailor.phone_number}
                                    onChange={(e) => setNewTailor({ ...newTailor, phone_number: e.target.value })}
                                />
                            </div>
                            <div className="col-md-3 mt-2">
                                <button className="btn btn-success" onClick={handleAddTailor}>Add Tailor</button>
                            </div>
                        </div>
                    </div>

                    {/* Tailor List */}
                    <h3>Tailors List</h3>
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Store</th>
                                <th>Email</th>
                                <th>Gender</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tailors.map((tailor) => (
                                <tr key={tailor.id}>
                                    <td>{tailor.name}</td>
                                    <td>{tailor.store_name}</td>
                                    <td>{tailor.email || "No Email"}</td>
                                    <td>{tailor.gender || "N/A"}</td>
                                    <td>{tailor.city || "N/A"}</td>
                                    <td>{tailor.address || "N/A"}</td>
                                    <td>{tailor.phone_number || "N/A"}</td>
                                    <td>
                                        <button className="btn btn-warning me-2" onClick={() => handleEdit(tailor)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(tailor.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Edit Tailor */}
                   {/* Edit Tailor */}
{editTailor && (
    <div className="card p-4 mt-4">
        <h3>Edit Tailor</h3>
        <div className="row">
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Full Name"
                    value={editTailor.name}
                    onChange={(e) => setEditTailor({ ...editTailor, name: e.target.value })}
                />
            </div>
            <div className="col-md-3">
                <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Email Address"
                    value={editTailor.email}
                    onChange={(e) => setEditTailor({ ...editTailor, email: e.target.value })}
                />
            </div>
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Store Name"
                    value={editTailor.store_name}
                    onChange={(e) => setEditTailor({ ...editTailor, store_name: e.target.value })}
                />
            </div>
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Gender"
                    value={editTailor.gender}
                    onChange={(e) => setEditTailor({ ...editTailor, gender: e.target.value })}
                />
            </div>
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="City"
                    value={editTailor.city}
                    onChange={(e) => setEditTailor({ ...editTailor, city: e.target.value })}
                />
            </div>
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Address"
                    value={editTailor.address}
                    onChange={(e) => setEditTailor({ ...editTailor, address: e.target.value })}
                />
            </div>
            <div className="col-md-3">
                <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Phone Number"
                    value={editTailor.phone_number}
                    onChange={(e) => setEditTailor({ ...editTailor, phone_number: e.target.value })}
                />
            </div>
            <div className="col-md-3 mt-2">
                <button className="btn btn-primary me-2" onClick={handleUpdate}>Update Tailor</button>
                <button className="btn btn-secondary" onClick={() => setEditTailor(null)}>Cancel</button>
            </div>
        </div>
    </div>
)}

              
                </div>
            </div>
        </div>
    );
};

export default ShowTailor;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Admin_nav from "./Admin_nav";
import Swal from 'sweetalert2'; // Add this import
import { useNavigate } from "react-router-dom";

// ...imports remain same

const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune", "Jaipur"
];


const Show_User = () => {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: "", gender: "", address: "", city: "", phone_number: "", email: "", password: ""
    });
    const [editFormData, setEditFormData] = useState(null);
    const [search, setSearch] = useState("");
      const navigate = useNavigate();


    useEffect(() => {
        fetchUsers();
    }, [search]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`http://localhost/backend/users_api.php?search=${search}`);
            if (response.data.success) {
                setUsers(response.data.users);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            setUsers([]);
        }
    };

    const handleAddUser = async () => {
        const { name, gender, address, city, phone_number, email, password } = formData;
        if (!name.trim() || !email.trim() || !password.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Name, Email, and Password are required!',
            });
            return;
        }
        try {
            const response = await axios.post("http://localhost/backend/users_api.php", formData);
            Swal.fire({
                icon: 'success',
                title: 'User Added',
                text: response.data.message,
            });
            fetchUsers();
            setFormData({
                name: "", gender: "", address: "", city: "", phone_number: "", email: "", password: ""
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error Adding User: " + error.message,
            });
        }
    };

    const handleEdit = (user) => {
        setEditFormData({ ...user, password: "" });
    };

    const handleUpdate = async () => {
        const { name, gender, address, city, phone_number, email, password, id } = editFormData;
        if (!name.trim() || !email.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Name and Email are required!',
            });
            return;
        }
        try {
            let updatedData = { id, name, gender, address, city, phone_number, email };
            if (password.trim()) updatedData.password = password;

            const response = await axios.put("http://localhost/backend/users_api.php", updatedData);
            Swal.fire({
                icon: 'success',
                title: 'User Updated',
                text: response.data.message,
            });
            fetchUsers();
            setEditFormData(null);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error Updating User: " + error.message,
            });
        }
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`http://localhost/backend/users_api.php?id=${id}`);
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted',
                        text: response.data.message,
                    });
                    fetchUsers();
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: "Error deleting user: " + error.message,
                    });
                }
            }
        });
    };

    return (
        <div className="font-style">
            <div className="row flex-grow-1">
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
                    <h2 className="mb-4 text-center">User Management</h2>

                    <div className="input-group mb-3">
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Search User" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            autoFocus 
                        />
                    </div>

                    {/* Add User */}
                    <div className="card p-4 mb-4">
                        <h3>Add User</h3>
                        <div className="row">
                            <div className="col-md-3 mb-2">
                                <input type="text" className="form-control" placeholder="Name"
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                            </div>

                            <div className="col-md-3 mb-2">
                                <select className="form-control" value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="col-md-3 mb-2">
                                <input type="text" className="form-control" placeholder="Address"
                                    value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                            </div>

                            <div className="col-md-3 mb-2">
                                <select className="form-control" value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}>
                                    <option value="">Select City</option>
                                    {indianCities.map((city, idx) => (
                                        <option key={idx} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3 mb-2">
                                <input type="text" className="form-control" placeholder="Phone Number"
                                    value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
                            </div>

                            <div className="col-md-3 mb-2">
                                <input type="email" className="form-control" placeholder="Email"
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                            </div>

                            <div className="col-md-3 mb-2">
                                <input type="password" className="form-control" placeholder="Password"
                                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                            </div>

                            <div className="col-md-3 mb-2 d-flex align-items-center">
                                <button className="btn btn-success w-100" onClick={handleAddUser}>Add User</button>
                            </div>
                        </div>
                    </div>

                    {/* User List */}
                    <h3>User List</h3>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>City</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone_number}</td>
                                    <td>{user.gender}</td>
                                    <td>{user.city}</td>
                                    <td>{user.address}</td>
                                    <td>
                                        <button className="btn btn-warning me-2" onClick={() => handleEdit(user)}>Edit</button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(user.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Edit User Form */}
                    {editFormData && (
                        <div className="card p-4 mt-4">
                            <h3>Edit User</h3>
                            <div className="row">
                                <div className="col-md-3 mb-2">
                                    <input type="text" className="form-control" placeholder="Name"
                                        value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} />
                                </div>

                                <div className="col-md-3 mb-2">
                                    <select className="form-control" value={editFormData.gender}
                                        onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="col-md-3 mb-2">
                                    <input type="text" className="form-control" placeholder="Address"
                                        value={editFormData.address} onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })} />
                                </div>

                                <div className="col-md-3 mb-2">
                                    <select className="form-control" value={editFormData.city}
                                        onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}>
                                        <option value="">Select City</option>
                                        {indianCities.map((city, idx) => (
                                            <option key={idx} value={city}>{city}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-3 mb-2">
                                    <input type="text" className="form-control" placeholder="Phone Number"
                                        value={editFormData.phone_number} onChange={(e) => setEditFormData({ ...editFormData, phone_number: e.target.value })} />
                                </div>

                                <div className="col-md-3 mb-2">
                                    <input type="email" className="form-control" placeholder="Email" disabled
                                        value={editFormData.email} />
                                </div>

                                <div className="col-md-3 mb-2">
                                    <button className="btn btn-primary me-2" onClick={handleUpdate}>Update User</button>
                                    <button className="btn btn-secondary" onClick={() => setEditFormData(null)}>Cancel</button>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Show_User;

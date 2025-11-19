import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Admin_nav from './Admin_nav';
import { useNavigate } from "react-router-dom";

const AdminAddOptions = () => {
    const [newCategory, setNewCategory] = useState('');
    const [newColor, setNewColor] = useState('');
    const [newSize, setNewSize] = useState('');
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    const [editCategory, setEditCategory] = useState(null);
    const [editColor, setEditColor] = useState(null);
    const [editSize, setEditSize] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchColors();
        fetchSizes();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get('http://localhost/backend/getCategories.php');
            const data = res.data.categories || [];
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchColors = async () => {
        try {
            const res = await axios.get('http://localhost/backend/getColors.php');
            const data = res.data.colors || [];
            setColors(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    const fetchSizes = async () => {
        try {
            const res = await axios.get('http://localhost/backend/getSizes.php');
            const data = res.data.sizes || [];
            setSizes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching sizes:', error);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost/backend/addCategory.php",
                JSON.stringify({ category: newCategory }),
                { headers: { 'Content-Type': 'application/json' } }
            );
            setLoading(false);
            if (response.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Category Added',
                    text: 'Category added successfully!',
                });
                setNewCategory('');
                fetchCategories();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error adding category.',
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding the category.',
            });
            console.error('Error adding category:', error);
        }
    };

    const handleAddColor = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost/backend/addColor.php", { name: newColor });
            setLoading(false);
            if (response.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Color Added',
                    text: 'Color added successfully!',
                });
                setNewColor('');
                fetchColors();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error adding color.',
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding the color.',
            });
            console.error('Error adding color:', error);
        }
    };

    const handleAddSize = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost/backend/addSize.php", { name: newSize });
            setLoading(false);
            if (response.data.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Size Added',
                    text: 'Size added successfully!',
                });
                setNewSize('');
                fetchSizes();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error adding size.',
                });
            }
        } catch (error) {
            setLoading(false);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while adding the size.',
            });
            console.error('Error adding size:', error);
        }
    };

    const handleDelete = async (type, id) => {
        try {
            await axios.post("http://localhost/backend/deleteOption.php", {
                id,
                type: type.toLowerCase()
            });
            Swal.fire({
                icon: 'success',
                title: `${type} Deleted`,
                text: `${type} deleted successfully!`,
            });
            if (type === 'Category') fetchCategories();
            else if (type === 'Color') fetchColors();
            else if (type === 'Size') fetchSizes();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to delete ${type}.`,
            });
            console.error(`Error deleting ${type.toLowerCase()}:`, error);
        }
    };

    const handleSaveEdit = async (type, value, id) => {
        try {
            await axios.post("http://localhost/backend/updateOption.php", {
                id,
                name: value,
                type: type.toLowerCase()
            });
            Swal.fire({
                icon: 'success',
                title: `${type} Updated`,
                text: `${type} updated successfully!`,
            });
            if (type === 'Category') {
                setEditCategory(null);
                fetchCategories();
            } else if (type === 'Color') {
                setEditColor(null);
                fetchColors();
            } else if (type === 'Size') {
                setEditSize(null);
                fetchSizes();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Failed to update ${type}.`,
            });
            console.error(`Error updating ${type.toLowerCase()}:`, error);
        }
    };

    const handleEdit = (type, item) => {
        if (type === 'Category') setEditCategory(item);
        else if (type === 'Color') setEditColor(item);
        else if (type === 'Size') setEditSize(item);
    };

    const renderTable = (data, type) => {
        const isEditing = (id) => {
            if (type === 'Category') return editCategory?.id === id;
            if (type === 'Color') return editColor?.id === id;
            if (type === 'Size') return editSize?.id === id;
        };

        const getEditValue = (item) => {
            if (type === 'Category') return editCategory?.name;
            if (type === 'Color') return editColor?.color_name;
            if (type === 'Size') return editSize?.size_name;
        };

        return (
            <table className="table table-bordered font-style">
                <thead className="thead-dark">
                    <tr>
                        <th>{type}</th>
                        <th style={{ width: "200px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>
                                {isEditing(item.id) ? (
                                    <input
                                        className="form-control"
                                        value={getEditValue(item)}
                                        onChange={(e) => {
                                            if (type === 'Category') setEditCategory({ ...editCategory, name: e.target.value });
                                            if (type === 'Color') setEditColor({ ...editColor, color_name: e.target.value });
                                            if (type === 'Size') setEditSize({ ...editSize, size_name: e.target.value });
                                        }}
                                    />
                                ) : (
                                    item.name || item.color_name || item.size_name
                                )}
                            </td>
                            <td>
                                {isEditing(item.id) ? (
                                    <button className="btn btn-success btn-sm me-2" onClick={() => handleSaveEdit(type, getEditValue(item), item.id)}>Save</button>
                                ) : (
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(type, item)}>Edit</button>
                                )}
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(type, item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="d-flex font-style">
        {/* Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light overflow-auto position-sticky top-0 bg-white border">
            <Admin_nav />
        </div>
    
        {/* Scrollable Main Content */}
        <div className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: '#fff' }}>
            <div className="container" style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.7)" }}>
            <div className="d-flex justify-content-end mt-3 ">

<button
className="btn btn-danger mt-4"
onClick={() => {
localStorage.removeItem("tailor_id");
localStorage.removeItem("tailorEmail");
navigate("/adminlogin");
}}
>
Logout
</button>
</div>
                <h2 className="text-center mb-4">Add Options</h2>
    
                {/* Rest of your form and tables... */}
    

                {/* CATEGORY */}
                <form onSubmit={handleAddCategory} className="mb-3">
                    <input type="text" placeholder="Add Category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required className="form-control" />
                    <button type="submit" className="btn btn-primary mt-2" disabled={loading}>{loading ? 'Adding...' : 'Add Category'}</button>
                </form>
                {renderTable(categories, 'Category')}

                {/* COLOR */}
                <form onSubmit={handleAddColor} className="mb-3 mt-4">
                    <input type="text" placeholder="Add Color" value={newColor} onChange={(e) => setNewColor(e.target.value)} required className="form-control" />
                    <button type="submit" className="btn btn-primary mt-2" disabled={loading}>{loading ? 'Adding...' : 'Add Color'}</button>
                </form>
                {renderTable(colors, 'Color')}

                {/* SIZE */}
                <form onSubmit={handleAddSize} className="mb-3 mt-4">
                    <input type="text" placeholder="Add Size" value={newSize} onChange={(e) => setNewSize(e.target.value)} required className="form-control" />
                    <button type="submit" className="btn btn-primary mt-2" disabled={loading}>{loading ? 'Adding...' : 'Add Size'}</button>
                </form>
                {renderTable(sizes, 'Size')}
                </div>
            </div>
        </div>
    );
};

export default AdminAddOptions;

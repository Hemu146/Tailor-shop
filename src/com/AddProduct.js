import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AddProduct = () => {
    const [product, setProduct] = useState({
        product_name: '',
        category: '',
        description: '',
        price: '',
        stock: '',
        image: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        setProduct({ ...product, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (let key in product) {
            formData.append(key, product[key]);
        }
        formData.append('tailor_id', 1); // Replace with actual logged-in tailor ID

        try {
            const response = await axios.post('http://localhost/backend/add_product.php', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Show Success Popup
            Swal.fire({
                icon: 'success',
                title: 'Product Added',
                text: response.data.message || '✅ Product added successfully!',
            });
        } catch (error) {
            console.error('Error adding product:', error);
            // Show Error Popup
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: '❌ Failed to add product. Please try again.',
            });
        }
    };

    return (
        <div className='font-style'>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="product_name"
                    placeholder="Product Name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category"
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    onChange={handleChange}
                    required
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required
                />
                <button type="submit ">Add Product</button>
            </form>
        </div>
    );
};

export default AddProduct;

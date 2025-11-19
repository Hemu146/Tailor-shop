import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';


const TailorProducts = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        tailor_id: localStorage.getItem("tailor_id") || "",
        store_name: "",
        category: "",
        description: "",
        price: "",
        stock: "",
        image: null,
        colors: [],
        sizes: [],
        sizevalue: ""
    });

    const [editingProduct, setEditingProduct] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchOptions();
    }, []);

    const [searchCategory, setSearchCategory] = useState("");

    const filteredProducts = products.filter(product =>
        product.category.toLowerCase().includes(searchCategory.toLowerCase())
    );

    const fetchProducts = async () => {
        try {
            const tailorId = localStorage.getItem("tailor_id");
            if (!tailorId) return;

            const response = await axios.get(`http://localhost/backend/get_products.php?tailor_id=${tailorId}`);
            setProducts(response.data.products || []);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchOptions = async () => {
        try {
            const [catRes, colorRes, sizeRes] = await Promise.all([
                axios.get('http://localhost/backend/getCategories.php'),
                axios.get('http://localhost/backend/getColors.php'),
                axios.get('http://localhost/backend/getSizes.php')
            ]);

            setCategories(catRes.data?.categories || []);
            setColors(colorRes.data?.colors || []);
            setSizes(sizeRes.data?.sizes || []);
        } catch (error) {
            console.error("Error fetching dropdown options:", error);
        }
    };

    const handleEditClick = (product) => {
        let parsedColors = [];
        let parsedSizes = [];

        try {
            parsedColors = JSON.parse(product.colors || "[]");
        } catch (err) {
            console.error("Error parsing colors:", err);
        }

        try {
            parsedSizes = JSON.parse(product.sizes || "[]");
        } catch (err) {
            console.error("Error parsing sizes:", err);
        }

        setEditingProduct(product);
        setNewProduct({
            tailor_id: product.tailor_id,
            store_name: product.store_name,
            category: product.category,
            description: product.description,
            price: product.price,
            stock: product.stock,
            image: null,
            colors: parsedColors,
            sizes: parsedSizes,
            sizevalue: product.sizevalue || ""
        });
        setPreviewImage(product.image_path);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewProduct({ ...newProduct, image: file });
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setPreviewImage(null);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const tailorId = localStorage.getItem("tailor_id");
        if (!tailorId) return;
    
        let formData = new FormData();
        Object.entries(newProduct).forEach(([key, val]) => {
            formData.append(key, key === "colors" || key === "sizes" ? JSON.stringify(val) : val);
        });
    
        try {
            const res = await fetch("http://localhost/backend/add_product.php", {
                method: "POST",
                body: formData,
            });
    
            const text = await res.text();
    
            const data = JSON.parse(text);
            if (data.status === "success") {
                Swal.fire({
                    title: 'Product Added!',
                    text: '✅ Your product has been successfully added.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                fetchProducts();
                resetForm();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: '❌ ' + data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (err) {
            console.error("❌ Error adding product:", err);
            Swal.fire({
                title: 'Error!',
                text: '❌ An error occurred while adding the product.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    


    const handleUpdateProduct = async (e) => {
        e.preventDefault();
    
        try {
            const formData = new FormData();
            formData.append("product_id", editingProduct.id);
            Object.entries(newProduct).forEach(([key, val]) => {
                formData.append(key, key === "colors" || key === "sizes" ? JSON.stringify(val) : val);
            });
    
            const response = await fetch("http://localhost/backend/update_product.php", {
                method: "POST",
                body: formData,
            });
    
            const text = await response.text();
            let data;
    
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error("❌ JSON parse error:", err, "Response text:", text);
                return;
            }
    
            if (data.status === "success") {
                Swal.fire({
                    title: 'Product Updated!',
                    text: '✅ Your product has been successfully updated.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                fetchProducts();
                resetForm();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: '❌ ' + data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error("❌ Network or server error:", error);
            Swal.fire({
                title: 'Error!',
                text: '❌ An error occurred while updating the product.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    
    const handleDeleteProduct = async (productId) => {
        // SweetAlert2 se confirmation prompt
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Once deleted, you will not be able to recover this product!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        });
    
        if (!result.isConfirmed) return; // Agar user ne cancel kiya ho, toh return kar jaye
    
        const tailorId = localStorage.getItem("tailor_id");
        if (!tailorId) return;
    
        try {
            const response = await fetch("http://localhost/backend/delete_product.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ product_id: productId, tailor_id: tailorId }),
            });
    
            const data = await response.json();
            if (data.status === "success") {
                Swal.fire({
                    title: 'Product Deleted!',
                    text: '✅ Your product has been deleted.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                fetchProducts();
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: '❌ ' + data.message,
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error("❌ Error deleting product:", error);
            Swal.fire({
                title: 'Error!',
                text: '❌ An error occurred while deleting the product.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };
    
    
    const resetForm = () => {
        setNewProduct({
            tailor_id: localStorage.getItem("tailor_id") || "",
            store_name: "",
            category: "",
            description: "",
            price: "",
            stock: "",
            image: null,
            colors: [],
            sizes: [],
            sizevalue: ""
        });
        setPreviewImage(null);
        setEditingProduct(null);
    };

    return (
        <div className='font-style'>
            <h1 className='text-center mt-4'>Tailor Dashboard</h1>
            <div className='m-4 p-4' style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.7)" }}>
                <h2 className='text-center mb-4'>Manage Products</h2>

                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className='card p-4 m-4'>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                          <label> Store Name :</label>
                          <input type="text" className="form-control" placeholder="store Name" required
                                value={newProduct.store_name}
                                onChange={(e) => setNewProduct({ ...newProduct, store_name: e.target.value })}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                        <label> Select Category :</label>
                            <select className="form-control" required
                                value={newProduct.category}
                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3 mb-3">
                        <label> Enter Price :</label>
                            <input type="number" className="form-control" placeholder="Price" required
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            />
                        </div>

                        <div className="col-md-3 mb-3">
                        <label> Enter Stock :</label>
                            <input type="number" className="form-control" placeholder="Stock" required
                                value={newProduct.stock}
                                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            />
                        </div>
                       
                        <div className="col-md-3 mb-3">
                        <label> Select Size :</label>
                            <input type="number" className="form-control" placeholder="Size Value"
                                value={newProduct.sizevalue}
                                onChange={(e) => setNewProduct({ ...newProduct, sizevalue: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3 mb-3 " style={{marginTop:"32px"}}>
                      
                      <select multiple className="form-control"
                          value={newProduct.sizes}
                          onChange={(e) => setNewProduct({ ...newProduct, sizes: Array.from(e.target.selectedOptions, opt => opt.value) })}
                      >
                          {sizes.map(size => (
                              <option key={size.id} value={size.size_name}>{size.size_name}</option>
                          ))}
                      </select>
                  </div>
                  <div className="col-md-3 mb-3">
                        <label>Select Color :</label>
                            <select multiple className="form-control"
                                value={newProduct.colors}
                                onChange={(e) => setNewProduct({ ...newProduct, colors: Array.from(e.target.selectedOptions, opt => opt.value) })}
                            >
                                {colors.map(color => (
                                    <option key={color.id} value={color.color_name}>{color.color_name}</option>
                                ))}
                            </select>
                        </div>


                        <div className="col-md-3 mb-3">
                        <label> Enter Description :</label>
                            <textarea className="form-control" placeholder="Description" required
                                value={newProduct.description}
                                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                style={{height:"91px"}}
                            />
                        </div>
                        <label> Select Image :</label>
                        <div className="col-md-3 mb-3">
                            <input type="file" onChange={handleImageChange} />
                            {previewImage && <img src={previewImage} alt="Preview" width="100" />}
                        </div>

                        <div className="col-md-3">
                            
                            <button type="submit" className="btn btn-primary text-white">
                                {editingProduct ? "Update Product" : "Add Product"}
                            </button>
                        </div>
                    </div>
                </form>
                <div className="mb-3">

</div>

                {/* Product Table */}
               {/* Search Bar */}
<div className="mb-3">
    <input
        type="text"
        className="form-control"
        placeholder="Search by Category"
        value={searchCategory}
        onChange={(e) => setSearchCategory(e.target.value)}
    />
</div>

{/* Product Table */}
<table className="table">
    <thead>
        <tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Colors</th><th>Sizevalue</th><th>Sizes</th><th>Description</th><th>Image</th><th>Actions</th></tr>
    </thead>
    <tbody>
        {filteredProducts.map(product => (
            <tr key={product.id}>
                <td>{product.store_name}</td>
                <td>{product.category}</td>
                <td>{product.price}</td>
                <td>{product.stock}</td>
                <td>{
                    (() => {
                        try {
                            return Array.isArray(JSON.parse(product.colors))
                                ? JSON.parse(product.colors).join(", ")
                                : product.colors;
                        } catch (e) {
                            return product.colors;
                        }
                    })()
                }</td>
                <td>{product.sizevalue}</td>
                <td>{
                    (() => {
                        try {
                            return Array.isArray(JSON.parse(product.sizes))
                                ? JSON.parse(product.sizes).join(", ")
                                : product.sizes;
                        } catch (e) {
                            return product.sizes;
                        }
                    })()
                }</td>
                <td>{product.description}</td>
                <td>
                    <img
                        src={product.image_path || "/images/noimg.png"}
                        alt="Product"
                        width="60"
                        height="60"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/images/logo.png"; }}
                    />
                </td>
                <td>
                    <button className="btn btn-warning me-2 text-white" onClick={() => handleEditClick(product)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </td>
            </tr>
        ))}
    </tbody>
</table>


            </div>
        </div>
    );
};

export default TailorProducts;
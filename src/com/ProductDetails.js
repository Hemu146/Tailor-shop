import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const user_id = 1; // Ye abhi static hai, baad me auth system se lena padega

    useEffect(() => {
        fetchProductDetails();
    }, []);

    const fetchProductDetails = async () => {
        try {
            const response = await axios.get(`http://localhost/backend/get_products.php?product_id=${id}`);
            if (response.data.status === "success") {
                setProduct(response.data.product);
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            console.error("Error fetching product details:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to fetch product details. Please try again later.",
            });
        }
    };

    const handleAddToCart = async () => {
        try {
            const response = await axios.post("http://localhost/backend/add_to_cart.php", {
                user_id,
                product_id: id,
                quantity,
            });

            if (response.data.success) {
                Swal.fire({
                    icon: "success",
                    title: "Added to Cart",
                    text: response.data.message,
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: response.data.message,
                });
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to add product to cart. Please try again.",
            });
        }
    };

    return (
        <div>
            {product ? (
                <div>
                    <h2>{product.store_name}</h2>
                    <img
                        src={`http://localhost/backend/uploads/${product.image}`}
                        alt={product.store_name}
                        style={{ width: "300px", height: "300px" }}
                    />
                    
                    <p><strong>Category:</strong> {product.category}</p>
                    <p><strong>Price:</strong> ₹{product.price}</p>
                    <p><strong>Stock:</strong> {product.stock}</p>
                    <p><strong>Description:</strong> {product.description}</p>
                    <input
                        type="number"
                        value={quantity}
                        min="1"
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <button onClick={handleAddToCart}>Add to Cart</button>
                    <button>Buy Now</button>
                </div>
            ) : (
                <p>Loading product details...</p>
            )}
        </div>
    );
};

export default ProductDetails;
    
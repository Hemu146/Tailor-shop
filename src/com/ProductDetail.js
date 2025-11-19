import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost/backend/get_product_by_id.php?id=${id}`);
                if (response.data.status === "success") {
                    setProduct(response.data.product);
                } else {
                    console.log("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleBuyNow = () => {
        if (product) {
            navigate("/checkout", { state: { cartItems: [product] } });
        }
    };

    if (!product) return <div style={styles.loading}>Loading...</div>;

    return (
        <div>
            <Header/>
        <div style={styles.container}>
            <div style={styles.card}>
                {/* Image Container */}
                <div style={styles.imageContainer}>
                    <img
                        src={`http://localhost/backend/${product.image_path}`}
                        alt={product.name}
                        style={styles.mainImage}
                        onError={(e) => (e.target.src = "/default-image.png")}
                    />
                </div>

                {/* Product Details */}
                <div style={styles.detailsContainer}>
                    <h2 style={styles.title}>{product.store_name}</h2>
                    <p style={styles.price}>₹{product.price}</p>

                    <p><strong>Stock : </strong> {product.stock > 0 ? `${product.stock} available` : "Out of stock"}</p>
                    <p><strong>Category : </strong> {product.category}</p>
                    <p><strong>Description : </strong> {product.description || "No description available."}</p>

                    {/* Size Dropdown */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <strong style={{ marginRight: "10px" }}>Size :</strong>
                        {(() => {
                            let sizeOptions = [];
                            try {
                                sizeOptions = JSON.parse(product.sizes || "[]");
                            } catch (e) {
                                console.error("Invalid size JSON", e);
                            }

                            if (Array.isArray(sizeOptions) && sizeOptions.length > 0) {
                                return (
                                    <select style={{ padding: "10px", fontSize: "16px", borderRadius: "5px" }}>
                                        {sizeOptions.map((size, index) => (
                                            <option key={index} value={size}>{size}</option>
                                        ))}
                                    </select>
                                );
                            } else {
                                return <span style={{ fontSize: "16px" }}>N/A</span>;
                            }
                        })()}
                    </div>

                    {/* Color Dropdown */}
                    <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
                        <strong style={{ marginRight: "10px" }}>Color : </strong>
                        {(() => {
                            let colors = [];
                            try {
                                colors = JSON.parse(product.colors || "[]");
                            } catch (e) {
                                console.error("Invalid color JSON", e);
                            }

                            if (Array.isArray(colors) && colors.length > 0) {
                                return (
                                    <select style={{ padding: "10px", fontSize: "16px", borderRadius: "5px" }}>
                                        {colors.map((color, index) => (
                                            <option key={index} value={color}>{color}</option>
                                        ))}
                                    </select>
                                );
                            } else {
                                return <span style={{ fontSize: "16px" }}>N/A</span>;
                            }
                        })()}
                    </div>

                    {/* Buy Now Button */}
                    <div style={styles.buySection} className="mt-3">
                        <button style={styles.buyButton} onClick={handleBuyNow}>
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "50px 20px",
        backgroundColor: "#f4f4f4",
        minHeight: "50vh",
    },
    card: {
        width: "100%",
        maxWidth: "1200px",
        display: "flex",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        height: "auto",
    },
    imageContainer: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        height: "100%",
        width: "350px",
    },
    mainImage: {
        width: "100%",
        height: "auto",
        maxHeight: "400px",
        objectFit: "contain",
        marginBottom: "20px",
        borderRadius: "8px",
    },
    detailsContainer: {
        flex: 1.5,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflowY: "auto",
    },
    title: {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "15px",
        textAlign: "left",
    },
    price: {
        fontSize: "24px",
        color: "#007bff",
        fontWeight: "bold",
        marginBottom: "15px",
    },
    buySection: {
        display: "flex",
        alignItems: "center",
    },
    buyButton: {
        padding: "12px 25px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        fontSize: "18px",
        fontWeight: "bold",
        borderRadius: "10px",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s",
    },
    loading: {
        textAlign: "center",
        fontSize: "24px",
        color: "#333",
        marginTop: "50px",
    },
};

export default ProductDetail;

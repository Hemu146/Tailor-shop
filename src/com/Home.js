import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Eye, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import Header from "./Header";
import "./product.css";
import Tailort5 from "./t5.jpeg";
import Tailort4 from "./t4.jpeg";
import TailoringImage from "./t3.jpeg";
import SewingImage from "./t1.jpeg";
import ClothingStoreImage from "./t2.jpeg";

const images = [SewingImage, ClothingStoreImage, TailoringImage, Tailort4, Tailort5];

const Home = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const scrollRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    // Fetch Products and handle category from URL
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const categoryFromURL = urlParams.get("category");
        setCategoryFilter(categoryFromURL || "");

        const fetchProducts = async () => {
            try {
                const res = await axios.get("http://localhost/backend/get_all_products.php");
                if (res.data.status === "success") {
                    setProducts(res.data.products);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        return () => document.body.removeChild(script);
    }, [location.search]);

    // Auto-scroll banner
    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % images.length;
            scrollToImage(nextIndex);
        }, 3000);
        return () => clearInterval(interval);
    }, [activeIndex]);

    const scrollToImage = (index) => {
        if (scrollRef.current) {
            const scrollX = index * scrollRef.current.clientWidth;
            scrollRef.current.scrollTo({ left: scrollX, behavior: "smooth" });
            setActiveIndex(index);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesCategory = categoryFilter
                ? product.category.toLowerCase().includes(categoryFilter.toLowerCase())
                : true;
            const matchesSearch = searchQuery
                ? product.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  product.description.toLowerCase().includes(searchQuery.toLowerCase())
                : true;
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, products, categoryFilter]);

    const addToCart = async (product) => {
        if (!user || !user.id) {
            Swal.fire("Login Required", "Please login first!", "warning");
            navigate("/userlogin");
            return;
        }
        try {
            const res = await axios.post("http://localhost/backend/add_to_cart.php", {
                user_id: user.id,
                product_id: product.id,
                quantity: 1,
            });
            if (res.data.status === "success") {
                Swal.fire("Added", "Product added to cart! 🛒", "success");
            } else {
                Swal.fire("Error", "Failed to add product to cart.", "error");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            Swal.fire("Error", "Something went wrong.", "error");
        }
    };

    
   

    return (
        <div>
            <Header setSearchQuery={setSearchQuery} />

          
          

   

            {/* Products Section */}
            <div  className="productContainer">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            key={product.id}
                            className="productCard"
                        >
                            <h3 className=" productTitle">{product.store_name}</h3>
                            <img
                                src={`http://localhost/backend/${encodeURI(product.image_path)}`}
                                alt={product.name}
                                onError={(e) => (e.target.src = "/default-image.png")}
                                className="productImage"
                            />
                            <p className=" productPrice">₹{product.price}</p>
                            <p className=" productDescription">{product.description}</p>

                            <div className="d-flex gap-2 justify-content-center">
                                <button
                                    onClick={() => navigate(`/product-detail/${product.id}`)}
                                    className="btn btn-outline-primary btn-sm"
                                    title="View Product"
                                    style={{ width: "80px" }}
                                >
                                    <Eye size={16} />
                                </button>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="btn btn-outline-success btn-sm"
                                    title="Add to Cart"
                                    style={{ width: "80px" }}
                                >
                                    <ShoppingCart size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <p className="text-center">No products available</p>
                )}
            </div>
        </div>
    );
};

export default Home;

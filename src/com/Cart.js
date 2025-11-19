import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Cart = () => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`http://localhost/backend/get_cart.php?user_id=${user.id}`);
            setCart(response.data.cart || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    const removeFromCart = async (cartId) => {
        try {
            await axios.post("http://localhost/backend/remove_from_cart.php", { cart_id: cartId });
            fetchCart();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const totalAmount = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const proceedToCheckout = () => {
        if (cart.some(item => item.quantity > item.stock)) {
            setError("Some items exceed available stock. Please adjust quantities.");
            return;
        }
        setError("");
        navigate("/checkout");
    };

   
   

    return (
        <div>
            <Header />
            
                <h2 className="text-center mt-4">My Cart</h2> 
                <div className="productContainer">
    {error && <p>{error}</p>}

    {cart.length > 0 ? (
        cart.map((item) => (
            <div className="productCard" key={item.id}>
                <h3 className="productTitle">{item.store_name}</h3>
                <img
                    src={`http://localhost/backend/${item.image_path}`}
                    alt={item.store_name}
                    className="productImage"
                    onError={(e) => (e.target.src = "/default-image.png")}
                />
                <p className="productPrice">₹{item.price}</p>
                <p className="productDescription">{item.description}</p>
                <button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
                    Remove
                </button>
            </div>
        ))
    ) : (
        <p className="text-center">Your cart is empty.</p>
    )}
</div>

{/* 👇 Proceed to Checkout Button - outside the grid layout */}
{cart.length > 0 && (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={proceedToCheckout} className="btn btn-primary mb-4">
            Proceed to Checkout (₹{totalAmount})
        </button>
    </div>
)}

        </div>
    );
};

export default Cart;

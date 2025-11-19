import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./AuthContext";
import "./ProductCard.module.css";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Swal from 'sweetalert2';



const Checkout = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState({ name: "", address: "", pincode: "", phone: "" });
    const navigate = useNavigate();
    const location = useLocation();

    const sampleTrackingData = [
        { status: "Processing", message: "Order received", date: "2025-04-06" },
        { status: "Dispatched", message: "Left the warehouse", date: "2025-04-07" },
        { status: "Out for Delivery", message: "Rider is on the way", date: "2025-04-08" },
        { status: "Delivered", message: "Package delivered successfully", date: "2025-04-09" }
    ];


    useEffect(() => {
        // If coming from "Buy Now" button
        if (location.state?.cartItems) {
            const itemsWithQty = location.state.cartItems.map(item => ({
                ...item,
                quantity: 1,
            }));
            setCartItems(itemsWithQty);
        }
        // Else, fetch from cart
        else if (user?.id) {
            axios
                .get(`http://localhost/backend/get_cart.php?user_id=${user.id}`)
                .then((response) => {
                    const fetchedCart = response.data.cart || [];
                    setCartItems(fetchedCart);
                })
                .catch((error) => {
                    console.error("Error fetching cart data:", error);
                });
        }
    }, [user, location.state]);

    const updateCart = (updatedCart) => setCartItems(updatedCart);

    const changeQuantity = (productId, change) => {
        updateCart(cartItems.map(item =>
            item.id === productId && item.quantity + change > 0 && item.quantity + change <= item.stock
                ? { ...item, quantity: item.quantity + change }
                : item
        ));
    };

    const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const verifyPayment = async (payment_id, order_id) => {
        const res = await fetch("http://localhost/backend/verify_payment.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                razorpay_payment_id: payment_id,
                order_id: order_id
            })
        });
    
        const data = await res.json();
        console.log(data);
    
        if (data.status === "success") {
            // ✅ Payment verified successfully
            Swal.fire({
                icon: 'success',
                title: 'Payment Verified',
                text: 'Your payment has been successfully verified!',
            });
        } else {
            // ❌ Payment verification failed
            Swal.fire({
                icon: 'error',
                title: 'Payment Verification Failed',
                text: data.message,
            });
        }
    };

    const handlePayment = useCallback(async () => {
        if (!user?.id) return Swal.fire({
            icon: 'warning',
            title: 'Please log in first',
        });
        if (!address.name || !address.address || !address.pincode || !address.phone) return Swal.fire({
            icon: 'warning',
            title: 'Missing Shipping Details',
            text: 'Please fill in all shipping details.',
        });
        if (cartItems.length === 0) return Swal.fire({
            icon: 'warning',
            title: 'Cart is Empty',
            text: 'Your cart is empty. Please add items to your cart.',
        });
    
        try {
            const response = await axios.post("http://localhost/backend/create_order.php", {
                amount: totalAmount,
                user_id: user.id,
                products: cartItems.map(item => ({ id: item.id, quantity: item.quantity }))
            });
    
            if (response.data.status === "success") {
                const { order_id, amount, currency } = response.data;
                const options = {
                    key: "rzp_test_YbmdK39EeEqIxk",
                    amount: amount * 100,
                    currency,
                    name: "Tailor Management",
                    description: "Payment for order",
                    order_id,
                    handler: async function (response) {
                        await axios.post("http://localhost/backend/update_payment.php", {
                            order_id: response.razorpay_order_id,
                            payment_id: response.razorpay_payment_id
                        });
    
                        await verifyPayment(response.razorpay_payment_id, response.razorpay_order_id); // ✅ added
    
                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            text: `Payment ID: ${response.razorpay_payment_id}`,
                        });
    
                        await generateInvoice(response.razorpay_order_id, response.razorpay_payment_id);
                        navigate("/order-success", { state: { orderId: response.razorpay_order_id, trackingInfo: sampleTrackingData } });
    
                    },
                    prefill: {
                        name: address.name,
                        email: user?.email || "user@example.com",
                        contact: address.phone
                    },
                    theme: { color: "#3399cc" }
                };
                new window.Razorpay(options).open();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Payment Order Creation Failed',
                    text: response.data.message,
                });
            }
        } catch (error) {
            console.error("❌ Payment Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed!',
                text: 'Please try again.',
            });
        }
    }, [user, cartItems, totalAmount, navigate, address]);
    

    const generateInvoice = async (order_id, payment_id) => {
        try {
            const invoiceData = {
                order_id,
                payment_id,
                totalAmount: Number(totalAmount),
                address: {
                    ...address,
                    email: user?.email || "user@example.com"
                },
                products: cartItems.map(item => ({
                    product_id: item.id,
                    tailor_id: item.tailor_id ?? 1,
                    store_name: item.store_name,
                    quantity: Number(item.quantity)
                }))
            };
    
            const response = await axios.post("http://localhost/backend/create_invoice.php", invoiceData, {
                headers: { "Content-Type": "application/json" }
            });
    
            await axios.post("http://localhost/backend/buy_product.php", {
                products: cartItems.map(item => ({
                    product_id: Number(item.product_id || item.id),
                    quantity: Number(item.quantity)
                }))
            });
    
            // SweetAlert2 success message
            Swal.fire({
                icon: "success",
                title: "Invoice Created",
                text: "Invoice has been generated and stock updated successfully!",
                confirmButtonColor: "#3085d6"
            });
    

            // ✅ Shiprocket order creation
            await axios.post("http://localhost/backend/order_create_shiprocket.php", {
                order_id,
                totalAmount: Number(totalAmount),
                address: {
                    ...address,
                    email: user?.email || "user@example.com"
                },
                products: cartItems.map(item => ({
                    store_name: item.store_name,
                    quantity: item.quantity
                }))
            });

        
        } catch (error) {
           
        }
    };



    return (
        <div>
        <Header/>

`

        <div className="card m-4 p-5">
            <h2 className=" text-center">Checkout</h2>
            {cartItems.length > 0 ? (
                <div>
                    <div className="productContainer row">
                        {cartItems.map((item) => (
                            <div key={item.id} className="productCard m-3">
                                <h3 className="productTitle">{item.store_name}</h3>
                                <img className="productImage" src={`http://localhost/backend/${item.image_path}`} alt={item.store_name} />
                                <p className="productPrice">₹{item.price}</p>
                                <p className="productDescription">{item.description}</p>
                                <div className="d-flex align-items-center gap-2" style={{ marginLeft:"70px" }} >
                                    <button onClick={() => changeQuantity(item.id, -1)} className="btn btn-primary text-white" style={{ width: "35px" }}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => changeQuantity(item.id, 1)} className="btn btn-primary text-white" style={{ width: "35px" }}>+</button>

                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3>Order Summary</h3>
                        <p>Subtotal: ₹{totalAmount}</p>
                    </div>
                    <div className="card p-3 m-2">
                        <h3>Shipping Details</h3>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label>Enter Name :</label>

                                <input type="text" placeholder="Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="mb-3 form-control" />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label> Enter Address :</label>

                                <input type="text" placeholder="Address" value={address.address} onChange={(e) => setAddress({ ...address, address: e.target.value })} className="mb-3 form-control" />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label> Enter Pincode :</label>

                                <input type="text" placeholder="Pincode" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="mb-3 form-control" />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label> Enter Phone No :</label>

                                <input type="text" placeholder="Phone Number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="mb-3 form-control" />
                            </div>
                           
                        </div>
                        <div className=" mt-0">
  <button onClick={handlePayment} className="btn btn-success mt-0 text-white">Proceed to Payment</button>
</div>
                    </div>
                </div>
            ) : (
                <p>No items in checkout</p>
            )}
        </div>
        </div>
    );
};

export default Checkout;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "./Subscription.css";
import Swal from 'sweetalert2';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [daysLeft, setDaysLeft] = useState(null);

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Check subscription status
  useEffect(() => {
    if (user?.id) {
      axios
        .get(`http://localhost/backend/tailor_subscription_status.php?tailor_id=${user.id}`)
        .then((res) => {
          setStatus(res.data.status);
          setDaysLeft(res.data.days_left);
        })
        .catch((err) => console.error("Status fetch error:", err));
    }
  }, [user]);

  const handleSubscribe = async (planType) => {
    if (!user?.id) {
      alert("User not logged in.");
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Failed to load Razorpay script.");
      return;
    }

    let amount = 499; // Default for paid subscription
    if (planType === "trial") {
      amount = 1; // Free trial amount
    }

    try {
      const res = await axios.post(
        "http://localhost/backend/create_tailor_subscription_order.php",
        { tailor_id: user.id, amount: amount },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status === "success") {
        const { order_id, amount, currency } = res.data;

        const options = {
          key: "rzp_test_YbmdK39EeEqIxk", // Replace with live key in production
          amount: amount * 100,
          currency: currency,
          name: "Tailor Management",
          description: planType === "trial" ? "Free Trial Subscription" : "Tailor Subscription Payment",
          order_id: order_id,
          handler: async function (response) {
            await axios.post("http://localhost/backend/confirm_tailor_subscription.php", {
              tailor_id: user.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
            });

            Swal.fire({
              title: '🎉 Subscription Activated!',
              text: 'Welcome to premium features!',
              icon: 'success',
              confirmButtonText: 'Go to Dashboard'
            }).then(() => {
              navigate(`/tailordashboard/${user.id}`);
            });
          },
          prefill: {
            name: user?.name,
            email: user?.email,
          },
          theme: { color: "#E91E63" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("❌ Order creation failed: " + res.data.message);
      }
    } catch (error) {
      console.error("❌ Payment error:", error);
      alert("Payment failed");
    }
  };

  // Define renderStatus function
  const renderStatus = () => {
    if (status === "trial") {
      return `⏳ Trial Active (${daysLeft ?? "--"} days left)`;
    } else if (status === "active") {
      return `✅ Active (${daysLeft ?? "--"} days left)`;
    } else if (status === "expired") {
      return "❌ Subscription Expired";
    } else {
      return "🕐 No Subscription";
    }
  };

  return (
    <div className="subscription-page-container" style={{ backgroundColor: "#0B5289" }}>
      {!user ? (
        <p className="text-center">🔄 Checking user session...</p>
      ) : (
        <div className="subscription-card">
          <h2 className="text-center text-accent">🎁 Tailor Subscription</h2>
          <p className="status-text text-center">{renderStatus()}</p>
          <h4 className="text-center">Choose Your Plan</h4>

          <div className="plan-details">
            <div className="premium-plan">
              <h5>🌟 Why Go Premium?</h5>
              <ul>
                <li>✔️ Boost sales with professional features</li>
                <li>✔️ Priority customer support</li>
                <li>✔️ Secure cloud data storage</li>
              </ul>
            </div>
            <div className="premium-plan">
              <h5>Premium Plan - ₹499 / month</h5>
              <ul>
                <li>✔️ Unlimited Customers</li>
                <li>✔️ Product Listings</li>
                <li>✔️ E-commerce Dashboard</li>
              </ul>
            </div>
            <div className="trial-plan">
              <h5>⏳ 7-Day Free Trial</h5>
              <p>Try premium features for 7 days, then decide if you want to continue.</p>
            </div>
          </div>

          <div className="subscription-buttons">
            {status === "active" ? (
              <button className="btn disabled">Subscribed</button>
            ) : (
              <>
                <button
                  className="text-white btn btn-warning"
                  onClick={() => handleSubscribe("trial")}
                >
                  Start Free Trial
                </button>
                <button
                  className="btn btn-success"
                  onClick={() => handleSubscribe("paid")}
                >
                  Subscribe Now (₹499)
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SubscriptionPrompt = ({ email }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!email) return;

    setLoading(true);
    axios.post("http://localhost/backend/tcheck_subscription.php", { email })
      .then((res) => {
        setStatus(res.data.data.subscription_status);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Subscription check failed:", err);
        setError("Failed to fetch subscription status");
        setLoading(false);
      });
  }, [email]);

  if (loading) {
    return (
      <div className="bg-yellow-100 p-3 rounded-md text-yellow-800">
        Checking subscription status...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-3 rounded-md text-red-700">
        {error}
      </div>
    );
  }

  if (status === 'expired' || status === 'none') {
    return (
      <div className="bg-red-100 p-4 rounded-md shadow-md">
        <p className="text-red-800 font-bold">
          Your subscription is expired or inactive.
        </p>
        <a href="/subscription" className="text-blue-600 underline">Upgrade Now</a>
      </div>
    );
  }

  return null;
};

export default SubscriptionPrompt;

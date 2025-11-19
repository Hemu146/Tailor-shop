import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2

const SubscriptionStatus = ({ userId }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!userId) return;

    fetch("http://localhost/backend/tget_subscrption.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tailor_id: userId }),
    })
      .then(res => res.json())
      .then(data => {
        setData(data);

        if (data.subscription_status === "expired") {
          Swal.fire({
            title: 'Subscription Expired!',
            text: 'Your subscription is expired. Please renew.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        } else if (data.days_left === 1) {
          Swal.fire({
            title: 'Subscription Expiry Alert!',
            text: 'Your subscription will expire tomorrow.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
      });
  }, [userId]);

  if (!data) return null;

  return (
    <div className="bg-white p-4 rounded shadow mt-4">
      <h3 className="text-xl font-semibold mb-2">Subscription Info</h3>
      <p>Status: <strong>{data.subscription_status}</strong></p>
      <p>Trial Start: {data.trial_start_date}</p>
      <p>Expires On: {data.subscription_end_date || "Not Subscribed"}</p>
    </div>
  );
};

export default SubscriptionStatus;

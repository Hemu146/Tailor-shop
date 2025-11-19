import React from "react";
import { motion } from "framer-motion";
import Header from "./Header";

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const PrivacyPolicy = () => {
  return (
    <div>
      <Header />

      <div style={styles.container} className="mt-4 mb-4">
        <motion.div
          style={styles.section}
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div style={styles.textContainer}>
            <h2 className="brand-name" style={styles.h2}>Privacy & Policy</h2>
            <p style={styles.p}>
              Fabric Fusion is committed to protecting the privacy and personal data of both our tailors and customers.
              This policy outlines how we collect, use, and safeguard your information.
            </p>

            <h4 style={styles.h4}>1. Information We Collect</h4>
            <ul>
              <li><strong>For Tailors:</strong> Name, email, store name, password, products, and customer details.</li>
              <li><strong>For Customers:</strong> Name, contact details, payment info, and purchase history.</li>
            </ul>

            <h4 style={styles.h4}>2. How We Use the Data</h4>
            <ul>
              <li>To manage orders, product listings, and tailoring records.</li>
              <li>To process payments and ensure secure transactions.</li>
              <li>To improve user experience through data insights.</li>
            </ul>

            <h4 style={styles.h4}>3. Data Security</h4>
            <p style={styles.p}>
              All personal data is encrypted and stored securely. We implement best practices to avoid unauthorized access.
            </p>

            <h4 style={styles.h4}>4. Payment Handling</h4>
            <p style={styles.p}>
              Payment transactions are handled via trusted third-party gateways. We do not store card or UPI details.
            </p>

            <h4 style={styles.h4}>5. User Rights</h4>
            <p style={styles.p}>
              Users can request data access, correction, or deletion at any time by contacting support.
            </p>

            <h4 style={styles.h4}>6. Changes to Policy</h4>
            <p style={styles.p}>
              We may update this policy periodically. Users will be notified of significant changes via email or dashboard alerts.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    maxWidth: "1000px",
    margin: "auto",
  },
  section: {
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  },
  textContainer: {
    width: "100%",
  },
  h2: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  h4: {
    fontSize: "1.4rem",
    fontWeight: "600",
    marginTop: "20px",
    marginBottom: "10px",
  },
  p: {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    marginBottom: "10px",
  },
};

export default PrivacyPolicy;
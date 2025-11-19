import React from "react";
import { motion } from "framer-motion";
import TailoringImage from "./photo-1633655442356-ab2dbc69c772.avif";
import SewingImage from "./DeWatermark.ai_1741191261669.png";
import FashionImage from "./user.avif";
import ClothingStoreImage from "./premium_photo-1683129663272-6a157e9c493c.avif";
import HandmadeImage from "./gg.avif";
import Header from "./Header"; 
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const boxVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.8 } },
  hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.4)" },
};

const imageVariants = {
  hover: { scale: 1.1, transition: { duration: 0.5 } },
};

const About = () => {
  return (

    <div>
      <Header/>


    <div style={styles.container} className="mt-4 mb-4">
     
      {[
        { image: TailoringImage, title: "Fabric Fusion", text: "Fabric Fusion is a comprehensive platform designed for both tailors and customers, providing an all-in-one solution for tailoring services, product sales, and seamless management of records." },
        { image: ClothingStoreImage, title: "Why Choose Fabric Fusion?", text: "Fabric Fusion is a game-changer in the tailoring and fashion industry. We aim to empower tailors with tools for business growth while providing customers with access to high-quality tailoring products. With secure transactions and an intuitive interface, we make tailoring effortless."},
        { 
          image: SewingImage, 
          title: "Tailors", 
          text: (
            <>
              Fabric Fusion helps professional tailors streamline their work by providing an efficient record management system.  
              They can store customer measurements, manage orders, and sell products like custom clothing, raw materials, and tailoring essentials.<br></br>
              <strong> Each Tailor has their own dashboard where they can: </strong>
              <ul>
                <li><strong>Manage Customers:</strong> Add, edit, and delete customer details.</li>
                <li><strong>Store Measurements:</strong> Save and update customer body measurements.</li>
                <li><strong>Sell Products:</strong> List clothing items like sarees, pants, shirts & accessories.</li>
                <li><strong>Manage Orders:</strong> View and process customer orders.</li>
                <li><strong>Track Payments:</strong> Receive payments securely.</li>
                <li><strong>Update Order Status:</strong> Mark orders as Pending, Shipped, or Delivered.</li>
              </ul>
            </>
          )
        },
        { 
          image: FashionImage, 
          title: "Users", 
          text: (
            <>
              Customers looking for high-quality tailoring materials and products can explore the Fabric Fusion marketplace.  
              The platform offers a seamless browsing and purchasing experience to help users find and buy the best products tailored to their needs.  
              <br />
              
              <strong>The User (Customer) can:</strong>
              <ul>
                <li><strong>Browse Products:</strong> View clothing items listed by tailors.</li>
                <li><strong>Buy Products:</strong> Add items to the cart and place orders.</li>
                <li><strong>Make Payments:</strong> Pay using UPI, Credit/Debit Cards, Net Banking, or Cash on Delivery.</li>
                <li><strong>Track Orders:</strong> See the status of their purchases.</li>
              </ul>
            </>
          )
        },
      ].map((section, index) => (
        <motion.div 
          key={index} 
          style={styles.section} 
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }}
        >
          <motion.div 
            style={styles.box} 
            variants={boxVariants} 
            initial="hidden" 
            whileInView="visible" 
            whileHover="hover"
          >
            <motion.img 
              src={section.image} 
              alt={section.title} 
              style={styles.image} 
              variants={imageVariants} 
              whileHover="hover"
            />
          </motion.div>
          <div style={styles.textContainer}>
            <h2 className="brand-name" style={styles.h2}>{section.title}</h2>
            <p style={styles.p}>{section.text}</p>
            {index === 4 && <motion.button style={styles.button} whileHover={{ scale: 1.1, backgroundColor: "#0056b3" }}>Sign Up Now</motion.button>}
          </div>
        </motion.div>
      ))}
    </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    maxWidth: "1200px",
    margin: "auto",
  },
  section: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#f9f9f9",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
  },
  box: {
    width: "45%",
    height: "350px",
    borderRadius: "15px",
    overflow: "hidden",
    backgroundColor: "#eee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  textContainer: {
    width: "55%",
    paddingLeft: "20px",
  },
  h2: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  p: {
    fontSize: "1.2rem",
    lineHeight: "1.8",
  },
  button: {
    padding: "12px 24px",
    fontSize: "1.3rem",
    borderRadius: "30px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "0.3s",
  },
};

export default About;
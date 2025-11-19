import React from "react";  // ✅ correct
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./com/AuthContext"; // 🔥 Import AuthProvider
import Login from "./com/Login";
import Home from "./com/Home";
import UserRegister from "./com/UserRegister";
import UserLogin from "./com/UserLogin";
import TLogin from "./com/TLogin";
import TRegister from "./com/TRegister";
import TForgotPassword from "./com/TForgotPassword";
import TResetPassword from "./com/TResetPassword";
import TSendOTP from "./com/TSend_Otp";
import TVerifyOTP from "./com/TVerifyOTP";
import ForgotPassword from "./com/ForgotPassword";
import VerifyOTP from "./com/VerifyOTP";
import Dashboard from "./com/Dashboard";
import ResetPassword from "./com/ResetPassword";
import Footer from "./com/Footer";
import TailorDashboard from "./com/TailorDashboard";
import ErrorBoundary from "./com/ErrorBoundary"; 
import CustomerTable from "./com/CustomerTable";
import "./index.css";
import AddCustomerForm from "./com/AddCustomerForm";
import AddMeasurementsForm from "./com/AddMeasurementsForm";
import CustomerDetails from "./com/CustomerDetails";
import MeasurementTable from "./com/MeasurementTable";
import EditCustomerForm from "./com/EditCustomerForm";
import CustomerMeasurements from "./com/CustomerMeasurementsForm";
import AddCholiMeasurementForm from "./com/AddCholiMeasurementForm";
import AddCholi from "./com/AddCholi";
import EditCholi from "./com/EditCholi";
import About from "./com/About";
import AddProduct from "./com/AddProduct";
import TailorProducts from "./com/TailorProduct";
import ProductDetails from "./com/ProductDetails";
import Cart from "./com/Cart";
import Checkout from "./com/Checkout";
import AdminLogin from "./com/AdminLogin";
import AdminRegister from "./com/AdminRegister";
import AdminForgotPassword from "./com/AdminForgotpassword";
import AdminResetPassword from "./com/Adminresetpassword"; // ✅ Fixed Import Case
import Show_tailor from "./com/Show_tailor";
import SearchBar from "./com/SearchBar";
import Show_user from "./com/Show_User";
import Admin_nav from "./com/Admin_nav";
import OrdersPage from "./com/OrdersPage";
import OrderTracking from "./com/OrderTracking";
import UpdateOrderStatus from "./com/UpdateOrderStatus";
import SubscriptionPage from "./com/SubscriptionPage";
import SubscriptionPrompt from "./com/SubscriptionPrompt";
import SubscriptionStatus from "./com/SubscriptionStatus";
import AdminAddOptions from "./com/AdminAddOptions";
import TrackOrder from "./com/TrackOrder";
import TrackingStatus from "./com/TrackingStatus";
import LiveOrderTracking from "./com/LiveOrderTracking";
import OrderSuccess from "./com/OrderSuccess";
import ProductDetail from "./com/ProductDetail";
import PrivacyPolicy from "./com/PrivacyPolicy";

function App() {


  return (
    <ErrorBoundary> {/* 🔥 Wrap with ErrorBoundary */}
      <AuthProvider> {/* 🔥 Wrap with AuthProvider */}
        <Router>
          <div>
         
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tlogin" element={<TLogin />} />
              <Route path="/tregister" element={<TRegister />} />
              <Route path="/tforgot-password" element={<TForgotPassword />} />
              <Route path="/tverify-otp" element={<TVerifyOTP />} />
              <Route path="/tsendotp" element={<TSendOTP />} />
              <Route path="/tresetpassword" element={<TResetPassword />} />
              <Route path="/login" element={<Login />} />
              <Route path="/userlogin" element={<UserLogin />} />
              <Route path="/userregister" element={<UserRegister />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/tailordashboard/:id" element={<TailorDashboard />} />
              <Route path="/customertable" element={<CustomerTable />} />
              <Route path="/addcustomerform" element={<AddCustomerForm />} />
              <Route path="/addmeasurementsform" element={<AddMeasurementsForm />} />
              <Route path="/customerdetails" element={<CustomerDetails />} />
              <Route path="/measurementtable" element={<MeasurementTable />} />
              <Route path="/editcustomerform" element={<EditCustomerForm />} />
              <Route path="/customermeasurementform" element={<CustomerMeasurements />} />
              <Route path="/addcholimeasurementform" element={<AddCholiMeasurementForm />} />
              <Route path="/addcholi" element={<AddCholi />} />
              <Route path="/editcholi" element={<EditCholi />} />
              <Route path="/about" element={<About />} />
              <Route path="/addproduct" element={<AddProduct />} />
              <Route path="/tailorproducts" element={<TailorProducts />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/home" element={<Home />} />
              <Route path="/adminlogin" element={<AdminLogin />} />
              <Route path="/adminregister" element={<AdminRegister />} />
              <Route path="/aforgot-password" element={<AdminForgotPassword />} />
              <Route path="/areset-password" element={<AdminResetPassword />} />
              <Route path="/show_tailor" element={<Show_tailor />} />
              <Route path="/searchbar" element={<SearchBar />} />
              <Route path="/show_user" element={<Show_user />} />
              <Route path="/admin_nav" element={<Admin_nav />} />
              <Route path="/orderspage" element={<OrdersPage />} />
              <Route path="/track-order" element={<OrderTracking />} />
              <Route path="/updateorderstatus" element={<UpdateOrderStatus />} />
              <Route path="/subpage" element={<SubscriptionPage />} />
              <Route path="/subprompt" element={<SubscriptionPrompt />} />
              <Route path="/substatus" element={<SubscriptionStatus />} />
              <Route path="/adminaddoptions" element={<AdminAddOptions />} />
              <Route path="/trackorder" element={<TrackOrder />} />
              <Route path="/trackstatus" element={<TrackingStatus />} />
              <Route path="/liveordertracking" element={<LiveOrderTracking />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/product-detail/:id" element={<ProductDetail/>}/>
              <Route path="/privacypolicy" element={<PrivacyPolicy />}/>
            </Routes>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

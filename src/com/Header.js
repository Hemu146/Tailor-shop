import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useAuth } from "./AuthContext";
import axios from "axios";
import Logo from "./IMG_20250313_024313 (1).jpg";
import { Link } from "react-router-dom";


function Header({ setSearchQuery }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentLocation = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost/backend/getCategories.php");
        if (response.data && Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      const fetchCartCount = async () => {
        try {
          const response = await axios.get(`http://localhost/backend/get_cart.php?user_id=${user.id}`);
          setCartCount(response.data.count);
        } catch (error) {
          console.error("Error fetching cart count:", error);
        }
      };
      fetchCartCount();
    }
  }, [user]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost/backend/search_products.php?query=${searchTerm}`);
      if (response.data.status === "success") {
        setSuggestions(response.data.products);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchQuery(event.target.value);
  };

  const handleSuggestionClick = (storeName) => {
    setSearchTerm(storeName);
    setShowSuggestions(false);
    setSearchQuery(storeName);
    navigate("/");
  };

  const handleCategorySelect = (category) => {
    navigate(`/?category=${category}`);
  };

  return (
    <>
    <style>{`
  .navbar {
    background: linear-gradient(to right, #c2e9fb, #a1c4fd);
    color: black;
    padding: 10px 0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  }

  .brand-name {
    font-weight: bold;
    font-size: 22px;
    color: black;
    text-decoration: none;
    margin-left: 10px;
  }

  .header-logo {
    height: 80px;
    width: 60px;
    margin-right: 10px;
    border-radius: 45%;
    object-fit: cover;
  }

  .nav-link {
    color: black !important;
    margin-left: 15px;
  }

  .nav-link:hover {
    color: #333 !important;
  }

  .btn {
    font-size: 14px;
    border-radius: 6px;
    padding: 5px 10px;
    color: black;
  }

  .btn-danger {
    background-color: #ff4d4f;
    border: none;
    color: white;
  }

  .btn-danger:hover {
    background-color: #e43c3e;
  }

  .badge.bg-danger {
    font-size: 12px;
    margin-left: 5px;
  }

  .search-container {
    position: relative;
    margin-left: 30px;
  }

  .search-input {
    padding: 5px 10px;
    border-radius: 5px;
    border: none;
    width: 500px;
    font-size: 14px;
    color: black;
  }

  .suggestions-dropdown {
    position: absolute;
    top: 36px;
    left: 0;
    background: white;
    color: black;
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 10;
    list-style: none;
    padding: 5px 0;
    max-height: 200px;
    overflow-y: auto;
  }

  .suggestions-dropdown li {
    padding: 8px 12px;
    cursor: pointer;
    color: black;
  }

  .suggestions-dropdown li:hover {
    background-color: #f0f0f0;
  }
`}</style>




      <nav className="navbar navbar-expand-lg border-bottom pt-3 pb-3 " style={{height:"100px"}}>
        <div className="container-fluid">
        <Link to="/" className="brand-name d-flex align-items-center">
  <img src={Logo} alt="Fabric Fusion Logo" className="header-logo" />
  Fabric Fusion
</Link>


          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav fs-5">
            <li className="nav-item"><Link className="nav-link pl-5" to="/">Home</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/about">About Us</Link></li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="categoryDropdown" data-bs-toggle="dropdown">Categories</a>
                <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                  {categories.length > 0 ? (
                    categories.map((category, index) => (
                      <li key={index}>
                        <button className="dropdown-item" onClick={() => handleCategorySelect(category.name)}>
                          {category.name}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="dropdown-item text-muted">No Categories Available</li>
                  )}
                </ul>
              </li>
            </ul>

            {currentLocation.pathname === "/" && (
              <div className="search-container">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {loading && <div className="spinner-border text-light ms-2" role="status" style={{ width: "1rem", height: "1rem" }}></div>}
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="suggestions-dropdown">
                    {suggestions.map((product, index) => (
                      <li key={index} onClick={() => handleSuggestionClick(product.store_name)}>
                        {product.store_name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <ul className="navbar-nav ms-auto fs-5">
              {!user ? (
                <>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Tailor</a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="/tregister">Signup</a></li>
                      <li><a className="dropdown-item" href="/tlogin">Login</a></li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">User</a>
                    <ul className="dropdown-menu">
                      <li><a className="dropdown-item" href="/userregister">Signup</a></li>
                      <li><a className="dropdown-item" href="/userlogin">Login</a></li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <button className="btn me-3 text-white" onClick={() => navigate("/cart")}>
                      👜 {cartCount > 0 && <span className="badge btn btn-danger">{cartCount}</span>}
                    </button>
                  </li>
                  <li className="nav-item">
                  <button
  className="btn btn-danger"
  onClick={() => {
    logout();
    navigate("/");
  }}
>
  Logout
</button>

                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;

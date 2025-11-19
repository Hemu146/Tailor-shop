import React, { useState } from "react";
import axios from "axios";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 1) { // Jab user 2+ characters likhe tab API call kare
      try {
        const response = await axios.get("http://localhost/backend/search_products.php?query=${value}");
        
        if (response.data.status === "success" && response.data.products.length > 0) {
          setSuggestions(response.data.products); // Response ko proper format mein set karte hain
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching search suggestions", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (storeName) => {
    setQuery(storeName); // Jab user kisi suggestion pe click kare to input me set ho jaye
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search by store name or description..."
        value={query}
        onChange={handleSearch}
        className="search-bar"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((product, index) => (
            <li key={index} onClick={() => handleSelect(product.store_name)}>
              {product.store_name} - {product.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
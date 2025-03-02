import React, { useEffect, useState } from "react";
import "../../styles/availability.css"; // Import the CSS file
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"; // Import the circular progress bar component
import "react-circular-progressbar/dist/styles.css"; // Import the default styles for the circular progress bar

const Availability = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get sellerId from local storage
    const sellerId = localStorage.getItem("sellerId");

    if (sellerId) {
      // Fetch products by sellerId
      fetch(`http://localhost:5129/api/products-quantity?sellerId=${sellerId}`)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.message || "Failed to fetch products");
            });
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            setError("Unexpected response format from server");
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          setError(error.message || "Failed to load products");
        });
    } else {
      setError("Seller ID not found in local storage");
    }
  }, []);

  // Function to calculate battery level percentage based on quantity
  const calculateBatteryLevel = (quantity) => {
    const maxQuantity = 100; // Assuming 100 is the maximum quantity for full gauge
    return Math.min((quantity / maxQuantity) * 100, 100); // Percentage of quantity
  };

  // Function to determine the color of the battery gauge based on quantity
  const getGaugeColor = (quantity) => {
    if (quantity < 5) return "#ff0000"; // Red
    if (quantity < 20) return "#ffa500"; // Yellow
    return "#008000"; // Green
  };

  return (
    <div className="availability-section">
      <h1 className="title">Availability of Products</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="product-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-card" key={product._id || product.id}>
                <div className="cylinder-container">
                  <div
                    className="cylinder-fill"
                    style={{
                      height: `${Math.min(product.quantity, 100)}%`,
                      backgroundColor: getGaugeColor(product.quantity),
                    }}
                  ></div>
                </div>
                <p className="product-name">{product.productName}</p>
                <p className="product-quantity">Quantity: {product.quantity}</p>
              </div>
            ))
          ) : (
            <p className="no-products">No products available for this seller.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Availability;

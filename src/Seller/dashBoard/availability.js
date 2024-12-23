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
    const level = calculateBatteryLevel(quantity);
    if (level > 60) return "green";
    if (level > 30) return "yellow";
    return "red";
  };

  return (
    <div className="availability-section">
      <h1>Availability of Products</h1>
      {error ? (
        <p className="error-message">{error}</p>
      ) : (
        <div className="product-list">
          {products.length > 0 ? (
            products.map((product) => (
              <div className="product-item" key={product._id || product.id}>
                {/* Circular Progressbar Battery Gauge */}
                <div className="battery-gauge">
                  {product.quantity === 0 ? (
                    <div className="empty-message">Product is empty</div>
                  ) : (
                    <CircularProgressbar
                      value={calculateBatteryLevel(product.quantity)}
                      text={`${product.quantity}`}
                      styles={buildStyles({
                        pathColor: getGaugeColor(product.quantity),
                        textColor: "#000",
                        trailColor: "#f3f3f3",
                        strokeLinecap: "round",
                        textSize: "16px",
                      })}
                    />
                  )}
                </div>

                {/* Product Name */}
                <div className="product-name">{product.productName}</div>
              </div>
            ))
          ) : (
            <p>No products available for this seller.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Availability;

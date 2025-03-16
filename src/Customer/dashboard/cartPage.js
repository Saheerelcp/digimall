import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "../../styles/cartPage.css";


const CartPage = () => {
  const navigate = useNavigate();
  const { customerId, sellerId } = useParams(); // Get customerId and sellerId from the URL
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!customerId || !sellerId) {
      console.error("Customer ID or Seller ID is missing or invalid");
      return;
    }

    const fetchCart = async () => {
      try {
        // Fetch the cart for this customer and seller (shop)
        const response = await fetch(`http://localhost:5129/api/cart/${customerId}/${sellerId}`);
        console.log(`Response Status: ${response.status}`); // Log response status
        if (response.ok) {
          const data = await response.json();
          console.log(`Cart Data: ${JSON.stringify(data)}`); // Log response data
          setCartItems(data.items || []);
          calculateTotal(data.items || []);
        } else {
          console.error("Failed to fetch cart details");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [customerId, sellerId]);
  console.log('cartItems' + cartItems);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(total);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      alert("Quantity cannot be less than 1");
      return;
    }

    const updatedItems = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);

    try {
      // Send the updated quantity to the backend
      const response = await fetch(`http://localhost:5129/api/cart/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          sellerId,
          productId,
          quantity: newQuantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }
      console.log("Quantity updated successfully");
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Error updating quantity.");
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5129/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId }), // Include customerId in the request body
      });

      if (!response.ok) {
        throw new Error("Failed to remove product from cart");
      }

      // Filter out the removed product from the cart items
      const updatedCartItems = cartItems.filter((item) => item.productId !== productId);
      setCartItems(updatedCartItems);
      calculateTotal(updatedCartItems); // Update total cost after removal
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Error removing item from cart.");
    }
  };

  const handleProceedToCheckout = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      // Backend call to validate stock
      const response = await fetch("http://localhost:5129/api/cart/validate-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          sellerId,
          items: cartItems.map(({ productId, quantity }) => ({ productId, quantity })),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.isStockSufficient) {
          // Proceed to checkout if stock is sufficient
          
          navigate("/checkout");
        } else {
          // Display insufficient stock message
          const insufficientItems = data.insufficientItems.map(
            (item) => `${item.name}: Only ${item.availableStock} left in stock.`
          ).join("\n");
          setPopupMessage(`Insufficient stock for the following items:\n${insufficientItems}`);
          setShowPopup(true);
          setTimeout(() => setShowPopup(false), 3000); 
        }
      } else {
        console.error("Failed to validate stock");
        alert("Error validating stock. Please try again.");
      }
    } catch (error) {
      console.error("Error during stock validation:", error);
      alert("An error occurred while checking stock availability.");
    }
  };


  // Ensure the category field is used in the logic as shown below
  const isFloatingAllowed = (category) => {
    const floatingCategories = ["groceries", "vegetables", "fruits", "cakes", "bakery"];
    return floatingCategories.includes(category?.toLowerCase() || "");
  };

  return (
    <div className="cart-container">
        {showPopup && <div className="popup-message">{popupMessage}</div>}
      <h1 className="cart-title">Your Shopping Cart</h1>
      
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          {/* Left Side - Cart Items */}
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.productId} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                
                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <div className="quantity-section">
                    <label>Qty:</label>
                    <input
                      type="number"
                      step={isFloatingAllowed(item.category) ? "0.1" : "1"}
                      value={(item.quantity).toFixed(1)}
                      
                      min="1"
                      max="100"
                      onChange={(e) => handleQuantityChange(item.productId, parseFloat(e.target.value))}
                      className="cart-item-quantity"
                    />
                  </div>
                </div>

                <button className="remove-btn-cart" onClick={() => handleRemoveItem(item.productId)}>
                  <FaTrash className="trash-icon-cart" />
                </button>
              </div>
            ))}
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-summary">
            <h2>Order Summary</h2>

            <div className="order-items-header">
              <span className="header-name">Product Name</span>
              <span className="header-quantity">Quantity</span>
              <span className="header-price">Price</span>
            </div>

            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="order-item">
                  <span className="order-item-name">{item.name}</span>
                  <span className="order-item-quantity">x{item.quantity}</span>
                  <span className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <hr />

            <div className="order-total">
              <span>Total:</span>
              <span className="total-price">₹{totalCost.toFixed(2)}</span>
            </div>

            <button className="checkout-button" onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/cartPage.css";

const CartPage = () => {
  const { customerId } = useParams(); // Get the customerID from the URL
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    if (!customerId) {
      console.error("Customer ID is missing or invalid");
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch(`http://localhost:5129/api/cart/${customerId}`);
        if (response.ok) {
          const data = await response.json();
          // Initialize quantities to 1 if not already set
          const updatedItems = data.items.map(item => ({
            ...item,
            quantity: 1, // Default quantity
          }));
          setCartItems(updatedItems);
          calculateTotal(updatedItems);
        } else {
          console.error("Failed to fetch cart details");
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [customerId]);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(total);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedItems = cartItems.map((item) =>
      item.productId === productId
        ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 } // Ensure quantity is at least 1
        : item
    );
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
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

      setCartItems(cartItems.filter((item) => item.productId !== productId));
      calculateTotal(cartItems.filter((item) => item.productId !== productId)); // Update total cost after removal
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Error removing item from cart.");
    }
  };

  const handleProceedToCheckout = () => {
    alert("Proceeding to checkout...");
    // Add navigation to checkout page if needed
  };
  ///////////////
  
  // Ensure the category field is used in the logic as shown below

const isFloatingAllowed = (category) => {
  const floatingCategories = ["groceries", "vegetables", "fruits", "cakes", "bakery"];
  return floatingCategories.includes(category?.toLowerCase() || "");
};


  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Price: ₹{item.price}</p>
              
                <p>
                  Quantity:{" "}
                  <input
                    type="number"
                    step={isFloatingAllowed(item.category) ? "0.1" : "1"}
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleQuantityChange(
                        item.productId,
                        parseFloat(e.target.value)
                      )
                    }
                    className="cart-item-quantity"
                  />
                </p>
              </div>
              <div className="cart-item-actions">
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <h2>Total: ₹{totalCost.toFixed(2)}</h2>
          <button className="checkout-button" onClick={handleProceedToCheckout}>
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;

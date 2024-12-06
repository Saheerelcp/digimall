import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/cartPage.css";

const CartPage = () => {
  const navigate = useNavigate();
  const { customerId, sellerId } = useParams(); // Get customerId and sellerId from the URL
  const [cartItems, setCartItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);

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

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    alert("Proceeding to checkout...");
    navigate("/checkout"); // Navigate to the checkout page
  };

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

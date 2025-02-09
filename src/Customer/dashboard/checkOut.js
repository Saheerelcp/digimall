import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/checkout.css";

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    country: "",
    fullName: "",
    mobileNumber: "",
    pinCode: "",
    houseNumber: "",
    area: "",
    landmark: "",
    city: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();

  const steps = ["Address Details", "Payment Gateway"];
  const customerId = localStorage.getItem("customerId");
  const sellerId = localStorage.getItem("sellerId");
  const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      try {
        const response = await fetch(`http://localhost:5129/api/get-saved-addresses/${customerId}`);
        if (response.ok) {
          const data = await response.json();
          setSavedAddresses(data.address || []);
        } else {
          console.error("Failed to fetch saved addresses.");
        }
      } catch (error) {
        console.error("Error fetching saved addresses:", error.message);
      }
    };
    fetchSavedAddresses();
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSavedAddressChange = (e) => {
    const addressIndex = parseInt(e.target.value, 10);
    setSelectedAddress(savedAddresses[addressIndex]);
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleNextStep = async () => {
    if (step === 0) {
      const addressToSave = useSavedAddress ? selectedAddress : formData;
      try {
        const response = await fetch("http://localhost:5129/api/save-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customerId,
            address: addressToSave,
          }),
        });

        if (response.ok) {
          alert("Address saved successfully!");
          setStep(step + 1);
        } else {
          throw new Error("Failed to save address.");
        }
      } catch (error) {
        console.error("Error saving address:", error.message);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      return alert("Please select a payment method.");
    }

    try {
      const addressToSend = useSavedAddress ? selectedAddress : formData;
      let orderItems = [];
      let totalAmount = 0;

      if (selectedProduct) {
        // Handle "Buy Now" scenario
        orderItems = [
          {
            productId: selectedProduct.productId,
            productName: selectedProduct.name,
            quantity: selectedProduct.quantity || 1,
            price: selectedProduct.price,
            amount: selectedProduct.price * (selectedProduct.quantity || 1),
          },
        ];
        totalAmount = orderItems[0].amount;
      } else {
        // Handle cart scenario
        const cartResponse = await fetch(`http://localhost:5129/api/cart/${customerId}`);
        const cartData = await cartResponse.json();

        if (!cartData?.items?.length) {
          return alert("No items in the cart.");
        }

        orderItems = cartData.items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          amount: item.price * item.quantity,
        }));

        totalAmount = orderItems.reduce((total, item) => total + item.amount, 0);
      }

      // Check stock availability
      for (const item of orderItems) {
        const purchaseResponse = await fetch("http://localhost:5129/api/purchase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: item.productId,
            purchasedQuantity: item.quantity,
          }),
        });

        if (!purchaseResponse.ok) {
          throw new Error(`Stock unavailable for ${item.productName}.`);
        }
      }

      // Place the order
      const response = await fetch("http://localhost:5129/api/create-customer-bill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          sellerId,
          items: orderItems,
          totalAmount,
          address: addressToSend,
        }),
      });

      if (response.ok) {
        alert("Payment successful!");
        navigate(`/delivery-updates/${customerId}`);
      } else {
        const data = await response.json();
        alert(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="checkout-form">
      <h2>{steps[step]}</h2>

      {step === 0 && (
        <div className="step-0-container">
          {savedAddresses.length > 0 && (
            <div className="address-options">
              <h3>Select a Saved Address or Enter a New Address</h3>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="saved"
                    onChange={() => setUseSavedAddress(true)}
                  />
                  Use Saved Address
                </label>
                <label>
                  <input
                    type="radio"
                    name="addressType"
                    value="new"
                    onChange={() => setUseSavedAddress(false)}
                    defaultChecked
                  />
                  Enter New Address
                </label>
              </div>
            </div>
          )}

          <div className="address-input-container">
            {useSavedAddress && savedAddresses.length > 0 ? (
              <div className="saved-address-list">
                <h4>Select a Saved Address</h4>
                {savedAddresses.map((address, index) => (
                  <div key={index} className="saved-address-item">
                    <input
                      type="radio"
                      name="savedAddress"
                      value={index}
                      onChange={handleSavedAddressChange}
                    />
                    <span>
                      {address.fullName}, {address.houseNumber}, {address.area}, {" "}
                      {address.city}, {address.state} - {address.pinCode}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="new-address-form">
                <h4>Enter Address Details</h4>
                {Object.keys(formData).map((field) => (
                  <div key={field} className="form-group-row">
                    <label>{field.replace(/([A-Z])/g, " $1").toUpperCase()}</label>
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="payment-container">
          <h3>Select Payment Method</h3>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="payment"
                value="GPay"
                checked={paymentMethod === "GPay"}
                onChange={handlePaymentChange}
              />
              Google Pay
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="PhonePe"
                checked={paymentMethod === "PhonePe"}
                onChange={handlePaymentChange}
              />
              PhonePe
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={handlePaymentChange}
              />
              Cash on Delivery
            </label>
          </div>
        </div>
      )}

      <div className="buttons-row">
        {step > 0 && (
          <button type="button" className="back-btn" onClick={handlePreviousStep}>
            Back
          </button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" className="next-btn" onClick={handleNextStep}>
            Next
          </button>
        ) : (
          <button type="submit" className="submit-btn">
            Place Order
          </button>
        )}
      </div>
    </form>
  );
};

export default Checkout;

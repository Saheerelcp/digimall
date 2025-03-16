import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/checkout.css";

const Checkout = () => {
  const [step, setStep] = useState(0);
    const [popupMessage, setPopupMessage] = useState("");
     const [showPopup, setShowPopup] = useState(false);
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

        // Skip validation and database storage if using a saved address
        if (useSavedAddress) {
            setStep(step + 1); // Move to the next step directly
            return;
        }

        // Validate only when entering a new address
        const isEmpty = Object.values(formData).some(value => value.trim() === "");
        if (isEmpty) {
            setPopupMessage("All fields are required!");
            setShowPopup(true);
            setTimeout(() => setShowPopup(false), 3000);
            return;
        }

        try {
            // Save the new address in local state
            setSavedAddresses((prev) => [...prev, addressToSave]);

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
                setPopupMessage("Address saved successfully!");
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
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
      setPopupMessage("Please select a payment method");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      return
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
        const cartResponse = await fetch(`http://localhost:5129/api/cart/${customerId}/${sellerId}`);
        const cartData = await cartResponse.json();
        console.log("cart data"+cartData.items);
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
        console.log("thooook daaa"+orderItems)
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
          console.log(item.productName);
          throw new Error(`Stock unavailable for ${item.productName}.`);
        }
      }
      console.log("Order Items:", orderItems);

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
        setPopupMessage(`Payment successful!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
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
      <h2 className="form-title">{steps[step]}</h2>
      {showPopup && <div className="popup-message">{popupMessage}</div>}
      {step === 0 && (
        <div className="step-container">
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
                    <input type="radio" name="savedAddress" value={index}  onChange={handleSavedAddressChange}/>
                    <span>
                      {address.fullName}, {address.houseNumber}, {address.area}, {address.city}, {address.state} - {address.pinCode}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="new-address-form">
                <h4>Enter Address Details</h4>
                {Object.keys(formData).map((field) => (
                  <div key={field} className="form-group">
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
            <label className="disabled-option">
              <input type="radio" name="payment" value="GPay" disabled />
              Google Pay <span className="coming-soon">(Coming Soon)</span>
            </label>
            <label className="disabled-option">
              <input type="radio" name="payment" value="PhonePe" disabled />
              PhonePe <span className="coming-soon">(Coming Soon)</span>
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
          <button type="button" className="back-btn" onClick={handlePreviousStep}>Back</button>
        )}
        {step < steps.length - 1 ? (
          <button type="button" className="next-btn" onClick={handleNextStep}>Next</button>
        ) : (
          <button type="submit" className="submit-btn">Place Order</button>
        )}
      </div>
    </form>
  );
};

export default Checkout;

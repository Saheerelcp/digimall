import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/checkout.css";

const Checkout = () => {
  const [step, setStep] = useState(0); // Step management
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
  const navigate = useNavigate();

  const steps = ["Address Details", "Payment Gateway"]; // Steps definition

  const customerId = localStorage.getItem("customerId"); // Fetch customer ID from localStorage

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleNextStep = async () => {
    if (step === 0) {
      // Submit address when moving from Step 0 to Step 1
      const dataToSend = {
        customerId,
        address: formData,
      };

      try {
        const response = await fetch("http://localhost:5129/api/save-address", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
          throw new Error("Failed to save address.");
        }

        alert("Address saved successfully!");
        setStep(step + 1); // Move to the next step only if address is saved
      } catch (error) {
        console.error("Error saving address:", error.message);
      }
    } else if (step === 1) {
      setStep(step + 1); // Proceed to payment success confirmation step
    }
  };

  const handlePreviousStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (paymentMethod) {
      alert("Payment successful!");
      // Order placed after payment confirmation
      alert("Order placed successfully!");
      navigate("/customer-bill"); // Navigate to confirmation page
    } else {
      alert("Please select a payment method.");
    }
  };

  return (
    <form onSubmit={handlePaymentSubmit} className="checkout-form">
      <h2>{steps[step]}</h2>

      {step === 0 && (
        <div>
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

      {step === 1 && (
        <div>
          <h3>Select Payment Method</h3>
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
      )}

      <div className="buttons">
        {step > 0 && <button type="button" onClick={handlePreviousStep}>Back</button>}
        {step < steps.length - 1 ? (
          <button type="button" onClick={handleNextStep}>Next</button>
        ) : (
          <button type="submit">Place Order</button>
        )}
      </div>
    </form>
  );
};

export default Checkout;

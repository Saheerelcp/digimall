import React, { useState, useEffect } from "react";
import "../../styles/addressComponent.css";
import { FaEdit, FaTrash } from "react-icons/fa";
const AddressComponent = () => {
  const [addresses, setAddresses] = useState([]);
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
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const customerId = localStorage.getItem("customerId");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`http://localhost:5129/api/get-address/${customerId}`);
        const data = await response.json();
        if (data && data.address) {
          setAddresses(data.address);
        }
      } catch (error) {
        showPopupMessage("Error fetching addresses.");
      }
    };
    fetchAddresses();
  }, [customerId]);

  const showPopupMessage = (message) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveAddress = async () => {
    const endpoint = editIndex !== null ? "update-address" : "new-address";
    const method = editIndex !== null ? "PUT" : "POST";

    try {
      const isEmpty = Object.values(formData).some(value => value.trim() === "");
      if (isEmpty) {
        setPopupMessage("All fields are required!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        return;
      }
      const response = await fetch(`http://localhost:5129/api/${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, address: formData }),
      });

      if (response.ok) {
        if (editIndex !== null) {
          const updatedAddresses = [...addresses];
          updatedAddresses[editIndex] = formData;
          setAddresses(updatedAddresses);
        } else {
          setAddresses((prev) => [...prev, formData]);
        }
        showPopupMessage(editIndex !== null ? "Address updated!" : "Address added!");
        resetForm();
      }
    } catch {
      showPopupMessage("Error saving address.");
    }
  };

  const handleDeleteAddress = async (index) => {
    try {
      const response = await fetch("http://localhost:5129/api/delete-address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, address: addresses[index] }),
      });

      if (response.ok) {
        setAddresses(addresses.filter((_, i) => i !== index));
        showPopupMessage("Address deleted successfully!");
      }
    } catch {
      showPopupMessage("Error deleting address.");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditIndex(null);
    setFormData({
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
  };

  return (
    <div className="address-section">
      {showPopup && <div className="popup-message">{popupMessage}</div>}
      {!isEditing && (
        <button onClick={() => setIsEditing(true)} className="add-address-button">
          Add New Address
        </button>
      )}
      {isEditing && (
        <div className="address-form">
          <h3>{editIndex !== null ? "Edit Address" : "Add New Address"}</h3>
          <div className="form-grid">
            {Object.keys(formData).map((key) => (
              <input
                key={key}
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                placeholder={key.replace(/([A-Z])/g, " $1").trim()}
                required
              />
            ))}
          </div>
          <button onClick={handleSaveAddress} className="save-address-button">
            {editIndex !== null ? "Save Changes" : "Add Address"}
          </button>
        </div>
      )}
      <h3>Saved Addresses</h3>
      {addresses.map((address, index) => (
        <div key={index} className="address-item">
          <p><strong>Full Name:</strong> {address.fullName}</p>
          <p><strong>Mobile Number:</strong> {address.mobileNumber}</p>
          <p><strong>Address:</strong> {`${address.houseNumber}, ${address.area}, ${address.city}, ${address.state}, ${address.country}, ${address.pinCode}`}</p>
          <div className="button-container">


            <button
              onClick={() => { setIsEditing(true); setEditIndex(index); setFormData(address); }}
              className="edit-button"
            >
              <FaEdit size={16} /> {/* Edit icon */}
            </button>

            <button
              onClick={() => handleDeleteAddress(index)}
              className="delete-button"
            >
              <FaTrash size={16} /> {/* Trash icon */}
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default AddressComponent;

import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import '../../styles/addressComponent.css'; // Import the provided CSS

const AddressComponent = () => {
  const [address, setAddresses] = useState([]); // To store all addresses
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
  const [editIndex, setEditIndex] = useState(null); // Track which address is being edited
  const [errorMessage, setErrorMessage] = useState("");
  const customerId = localStorage.getItem("customerId");
  //const navigate = useNavigate();

  useEffect(() => {
    // Fetch all addresses when component loads
    const fetchAddresses = async () => {
      try {
        const response = await fetch(`http://localhost:5129/api/get-address/${customerId}`);
        const data = await response.json();
        if (data && data.address) {
          setAddresses(data.address); // Set all addresses
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        setErrorMessage("Error fetching addresses.");
      }
    };

    fetchAddresses();
  }, [customerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveNewAddress = async () => {
    try {
      const response = await fetch("http://localhost:5129/api/new-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          address: formData,
        }),
      });

      if (response.ok) {
        //const result = await response.json();
        alert("Address saved successfully!");
        setAddresses((prevAddresses) => [...prevAddresses, formData]); // Add new address to state
        resetForm();
      } else {
        const result = await response.json();
        setErrorMessage(result.message || "Error saving address.");
      }
    } catch (error) {
      console.error("Error saving address:", error);
      setErrorMessage("Error saving address.");
    }
  };

  const handleUpdateAddress = async () => {
    try {
      const dataToSend = {
        customerId,
        address: formData,
      };

      const response = await fetch("http://localhost:5129/api/update-address", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Address updated successfully!");

        const updatedAddresses = [...address];
        updatedAddresses[editIndex] = formData; // Update the specific address in the list
        setAddresses(updatedAddresses);

        resetForm();
      } else {
        setErrorMessage(result.message || "Error updating address.");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      setErrorMessage("Error updating address.");
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

  const handleSaveAddress = () => {
    if (editIndex !== null) {
      handleUpdateAddress();
    } else {
      handleSaveNewAddress();
    }
  };

  const handleEditAddress = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setFormData(address[index]); // Load the selected address into the form
  };

  const handleDeleteAddress = async (index) => {
    try {
      const addressToDelete = address[index];
      const response = await fetch("http://localhost:5129/api/delete-address", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId, address: addressToDelete }),
      });

      if (response.ok) {
        alert("Address deleted successfully!");
        const updatedAddresses = address.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
      } else {
        const result = await response.json();
        setErrorMessage(result.message || "Error deleting address.");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      setErrorMessage("Error deleting address.");
    }
  };

  const handleAddNewAddress = () => {
    resetForm(); // Reset form for adding a new address
    setIsEditing(true);
  };

  return (
    <div className="address-section">
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      {!isEditing && (
        <button onClick={handleAddNewAddress} className="add-address-button">
          Add New Address
        </button>
      )}

      {isEditing ? (
        <div className="address-form">
          <h3>{editIndex !== null ? "Edit Address" : "Add New Address"}</h3>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            required
          />
          <input
            type="text"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleInputChange}
            placeholder="House Number"
            required
          />
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            placeholder="Area"
            required
          />
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleInputChange}
            placeholder="Landmark"
          />
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            required
          />
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            placeholder="State"
            required
          />
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Country"
            required
          />
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleInputChange}
            placeholder="Pin Code"
            required
          />
          <button onClick={handleSaveAddress} className="save-address-button">
            {editIndex !== null ? "Save Changes" : "Add Address"}
          </button>
        </div>
      ) : (
        <>
          <h3>Saved Addresses</h3>
          {address.map((address, index) => (
            <div key={index} className="address-item">
              <p><strong>Full Name:</strong> {address.fullName}</p>
              <p><strong>Mobile Number:</strong> {address.mobileNumber}</p>
              <p><strong>Address:</strong> {`${address.houseNumber}, ${address.area}, ${address.city}, ${address.state}, ${address.country}, ${address.pinCode}`}</p>
              <div className="button-container">
                <button onClick={() => handleEditAddress(index)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteAddress(index)} className="delete-button">Delete</button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AddressComponent;

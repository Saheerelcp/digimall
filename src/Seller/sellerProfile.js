import { useState, useEffect } from "react";
import { FaSignOutAlt, FaQuestionCircle, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "../styles/SellerProfile.css"; // Importing the CSS file




const SellerProfile = () => {
    const [popupMessage, setPopupMessage] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [loading, setLoading] = useState(false);
    const sellerId = localStorage.getItem("sellerId");
    const [sellerDetails, setSellerDetails] = useState({
        sellerName: "",
        shopName: "",
        contactNumber: "",
        shopAddress: "",
        sellerId: sellerId,
    });

   
    

    useEffect(() => {
        if (!sellerId) {
            
            console.error("Seller ID not found in localStorage.");
            return;
        }

        setLoading(true); // Start loading before fetch
        fetch(`http://localhost:5129/api/seller/details/${sellerId}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setSellerDetails({
                        sellerName: data.sellerName || "",
                        shopName: data.shopName || "",
                        contactNumber: data.contactNumber || "",
                        shopAddress: data.shopAddress || "",
                        sellerId: sellerId
                    });
                }
                setLoading(false); // Stop loading after data is set
            })
            .catch(error => {
                console.error("Error fetching seller details:", error);
                setLoading(false); // Stop loading even if there's an error
            });
    }, [sellerId]); // Re-run effect when `sellerId` changes

    const handleChange = (e) => {
        setSellerDetails({ ...sellerDetails, [e.target.name]: e.target.value });
    };


    const handleSave = () => {
        fetch("http://localhost:5129/api/seller/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(sellerDetails),
        })
            .then(response => response.json())
            .then(data => {
                if (data.updatedSeller) {
                    setSellerDetails(data.updatedSeller);
                }
                setPopupMessage("Seller details updated successfully!");
                setShowPopup(true);
                setTimeout(() => setShowPopup(false), 3000);
            })
            .catch(error => console.error("Error updating details:", error));
    };

    const handleLogout = () => {
        localStorage.removeItem("sellerId");
        setPopupMessage("You have been logged out!");
        window.location.href = "/";
    };

    return (
        <div className="profile-container">
            {showPopup && <div className="popup-message">{popupMessage}</div>}

            <div className="header">
                <h2 className="profile-title">Seller Profile</h2>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt size={20} />
                </button>
            </div>

            <button className="view-details-button" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "Hide Seller Details" : "View Seller Details"}
            </button>

            {showDetails && (
                <div className="profile-card">
                    {loading ? (
                        <p>Loading seller details...</p>
                    ) : (
                        <>
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Seller Name</label>
                                    <input
                                        type="text"
                                        name="sellerName"
                                        value={sellerDetails.sellerName}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Shop Name</label>
                                    <input
                                        type="text"
                                        name="shopName"
                                        value={sellerDetails.shopName}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>Contact Number</label>
                                    <input
                                        type="text"
                                        name="contactNumber"
                                        value={sellerDetails.contactNumber}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Shop Address</label>
                                    <input
                                        type="text"
                                        name="shopAddress"
                                        value={sellerDetails.shopAddress}
                                        onChange={handleChange}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <button className="save-button" onClick={handleSave}>Save Changes</button>
                        </>
                    )}
                </div>
            )}

            {/* FAQ Section */}
            <div className="faq-section">
                <h3><FaQuestionCircle /> Frequently Asked Questions</h3>
                <ul>
                    <li>How can I update my shop details?
                        <p>ANS: Edit the fields in your profile and click "Save Changes".</p>
                    </li>
                    <li>How do I manage my products?
                        <p>ANS: You can add, edit, and remove products from the seller dashboard.</p>
                    </li>
                    <li>What payment methods are supported?
                        <p>ANS: We support multiple payment methods including credit/debit cards and UPI.</p>
                    </li>
                </ul>
            </div>

            {/* Contact Support Section */}
            <div className="contact-section">
                <h3><FaPhoneAlt /> Contact Support</h3>
                <p>For any assistance, reach out to our support team:</p>
                <p><FaEnvelope /> <span className="support-email">support@digitalmall.com</span></p>
                <p><FaPhoneAlt /> <span className="support-phone">+91 98765 43210</span></p>
            </div>
        </div>
    );
};

export default SellerProfile;

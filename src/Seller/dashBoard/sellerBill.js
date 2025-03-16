import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../../styles/sellerBills.css";

const SellerBills = () => {
  const { sellerId } = useParams();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const openBillDetails = (bill) => {
    setSelectedBill(bill);
  };

  const closeBillDetails = () => {
    setSelectedBill(null);
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch(`http://localhost:5129/api/seller-bills/${sellerId}`);
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setBills(data.bills);
        } else {
          alert(data.message || "Failed to fetch bills.");
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
        alert("An error occurred while fetching the bills.");
      } finally {
        setLoading(false);
      }
    };

    if (sellerId) {
      fetchBills();
    }
  }, [sellerId]);

  const handleUpdateBill = async (billId, updatedDetails) => {
    try {
      const response = await fetch(`http://localhost:5129/api/update-bill/${billId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDetails),
      });

      const data = await response.json();

      if (response.ok) {
        setPopupMessage("Bill updated successfully!");
        setBills((prevBills) =>
          prevBills.map((bill) => (bill._id === billId ? { ...bill, ...updatedDetails } : bill))
        );
      } else {
        setPopupMessage(data.message || "Failed to update the bill.");
      }
    } catch (error) {
      console.error("Error updating the bill:", error);
      setPopupMessage("An error occurred while updating the bill.");
    } finally {
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
   
    <div className="customer-bills-container">
       {showPopup && <div className="popup-message">{popupMessage}</div>}
      <h2 className="heading">Customer Bills</h2>
      
      <div className="bills-grid">
        {bills.length > 0 ? (
          bills.map((bill) => (
            <div key={bill._id} className="bill-card" onClick={() => openBillDetails(bill)}>
              <p><strong>Bill ID:</strong> {bill._id.slice(-6)}</p>
              <p><strong>Customer:</strong> {bill.customerName}</p>
              <p><strong>Order Date:</strong> {new Date(bill.orderDate).toLocaleDateString()}</p>
              <div className="status-container">
                <p className="current-status">Current Status: <strong>{bill.status ? bill.status : "Yet to update bill status"}</strong></p>
              </div>


            </div>
          ))
        ) : (
          <p>No bills available for this seller.</p>
        )}
      </div>

      {selectedBill && (
        <div className="bill-popup">
          <div className="popup-content">
            <button className="close-btn" onClick={closeBillDetails}>&times;</button>
            <h3>Bill Details</h3>
            <p><strong>Customer Name:</strong> {selectedBill.customerName}</p>
            <p><strong>Customer Address:</strong> {selectedBill.customerAddress}</p>
            <p><strong>Order Date:</strong> {new Date(selectedBill.orderDate).toLocaleString()}</p>
            <hr />

            {/* Bill Table */}
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>SI No.</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedBill.items.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.productName}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4"><strong>Total Amount</strong></td>
                    <td><strong>{selectedBill.totalAmount}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Expected Delivery Date Input */}
            <div className="form-group">
              <label><strong>Expected Delivery Date:</strong></label>
              <input
                type="date"
                value={selectedBill.expectedDelivery || ""}
                onChange={(e) =>
                  setSelectedBill((prevBill) => ({
                    ...prevBill,
                    expectedDelivery: e.target.value,
                  }))
                }
              />
            </div>

            {/* Status Update */}
            <div className="form-group">
              <label><strong>Status:</strong></label>
              <select
                value={selectedBill.status}
                onChange={(e) =>
                  setSelectedBill((prevBill) => ({
                    ...prevBill,
                    status: e.target.value,
                  }))
                }
              >
                <option value="Seen by Seller">Seen by Seller</option>
                <option value="Ready for Delivery">Ready for Delivery</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>

            {/* Update Button */}
            <button
              className="update-btn"
              onClick={() =>
                handleUpdateBill(selectedBill._id, {
                  expectedDelivery: selectedBill.expectedDelivery,
                  status: selectedBill.status,
                })
              }
            >
              Update Bill
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SellerBills;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams hook
import "../../styles/sellerBills.css";

const SellerBills = () => {
  const { sellerId } = useParams(); // Extract sellerId from URL
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch customer bills for the seller
    const fetchBills = async () => {
      try {
        const response = await fetch(`http://localhost:5129/api/seller-bills/${sellerId}`);
        const data = await response.json();
        if (response.ok) {
          setBills(data.bills); // Set bills state with the data fetched from backend
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
      fetchBills(); // Fetch bills when sellerId is available
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
        alert("Bill updated successfully!");
        // Update the state to reflect changes in the UI
        setBills((prevBills) =>
          prevBills.map((bill) =>
            bill._id === billId ? { ...bill, ...updatedDetails } : bill
          )
        );
      } else {
        alert(data.message || "Failed to update the bill.");
      }
    } catch (error) {
      console.error("Error updating the bill:", error);
      alert("An error occurred while updating the bill.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="seller-bills-container">
      <div className="seller-bills">
        <h2>Customer Bills</h2>
        {bills.length > 0 ? (
          <div>
            {bills.map((bill) => (
              <div key={bill._id} className="bill-details">
                <div className="customer-info">
                  <p><strong>Customer Name:</strong> {bill.customerName}</p>
                  <p><strong>Customer Address:</strong> {bill.customerAddress}</p>
                  <p><strong>Order Date:</strong> {new Date(bill.orderDate).toLocaleString()}</p>
                  <p><strong>Shop Name:</strong> {bill.shopName}</p>
                </div>

                <hr className="divider" />

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>SI No.</th>
                        <th>Product Name</th>
                        <th>Price (in Shop)</th>
                        <th>Quantity</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bill.items.map((item, index) => (
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
                        <td><strong>{bill.totalAmount}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="delivery-options">
                  <label>
                    Expected Delivery:
                    <input
                      type="date"
                      value={bill.expectedDelivery || ""}
                      onChange={(e) =>
                        setBills((prevBills) =>
                          prevBills.map((b) =>
                            b._id === bill._id
                              ? { ...b, expectedDelivery: e.target.value }
                              : b
                          )
                        )
                      }
                    />
                  </label>

                  <fieldset>
                    <legend>Status:</legend>
                    {["Seen by Seller", "Ready for Delivery", "Out for Delivery", "Delivered"].map(
                      (status) => (
                        <label key={status}>
                          <input
                            type="radio"
                            name={`status-${bill._id}`}
                            value={status}
                            checked={bill.status === status}
                            onChange={(e) =>
                              setBills((prevBills) =>
                                prevBills.map((b) =>
                                  b._id === bill._id
                                    ? { ...b, status: e.target.value }
                                    : b
                                )
                              )
                            }
                          />
                          {status}
                        </label>
                      )
                    )}
                  </fieldset>

                  <button
                    onClick={() =>
                      handleUpdateBill(bill._id, {
                        expectedDelivery: bill.expectedDelivery,
                        status: bill.status,
                      })
                    }
                  >
                    Update Bill
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No bills available for this seller.</p>
        )}
      </div>
    </div>
  );
};

export default SellerBills;

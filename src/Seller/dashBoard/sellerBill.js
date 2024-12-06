import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams hook
import '../../styles/sellerBills.css';

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
        console.log(data);
        if (response.ok) {
          setBills(data.bills);  // Set bills state with the data fetched from backend
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="seller-bills">
      <h2>Customer Bills</h2>
      {bills.length > 0 ? (
        <div>
          {bills.map((bill) => (
            <div key={bill._id} className="bill-details">
              {/* Customer Information Section */}
              <div className="customer-info">
                <p><strong>Customer Name:</strong> {bill.customerName}</p>
                <p><strong>Customer Address:</strong> {bill.customerAddress}</p>
                <p><strong>Customer Phone:</strong> {bill.customerMobile}</p>
                <p><strong>Order Date:</strong> {new Date(bill.orderDate).toLocaleString()}</p>
                <p><strong>Shop Name:</strong> {bill.shopName}</p>
              </div>
              
              {/* Underline Separator */}
              <hr className="divider" />

              {/* Product Details Table */}
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
          ))}
        </div>
      ) : (
        <p>No bills available for this seller.</p>
      )}
    </div>
  );
};

export default SellerBills;

import "./Orders.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../store/Authentication";
import { useNavigate } from "react-router-dom";

export const Orders = () => {
  const { userAuthToken } = UseAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate=useNavigate();
  


  const getOrders = async () => {
    try {
      const res = await fetch(
        "http://localhost:8000/api/order",
        {
          method: "GET",
          headers: {
            Authorization: userAuthToken,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <h2 className="loading-text">Loading Orders...</h2>;
  }

  return (
    <div className="orders-page">

      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (

        <div className="empty-orders">

          <h2>No Orders Found</h2>

          <p>You haven't placed any orders yet.</p>

        </div>

      ) : (

        orders.map((order) => (

          <div
            className="order-card"
            key={order._id}
          >

            <div className="order-header">

              <div>

                <h2>
                  Order #{order._id.slice(-6)}
                </h2>

                <p>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

              </div>

              <span
                className={`status ${order.orderStatus.toLowerCase()}`}
              >
                {order.orderStatus}
              </span>

            </div>
            <div className="order-products">

             {order.products.map((item, index) => {

  console.log("Order Item:", item);

  return (

    <div
      key={item.productId?._id || index}
      className="order-product"
    >

      <img
        src={
          item.productId?.image ||
          "https://via.placeholder.com/80?text=No+Image"
        }
        alt={item.name}
      />

      <div className="order-product-info">

        <h4>{item.name}</h4>

        <p>
          {item.productId?.weight || "Product Removed"}
        </p>

      </div>

      <div className="order-product-right">

        <span>
          Qty : {item.quantity}
        </span>

        <strong>
          Rs. {item.price * item.quantity}
        </strong>

      </div>

    </div>

  );

})}

            </div>

            <div className="order-footer">

              <div className="footer-info">

                <p>

                  <strong>Payment:</strong>{" "}

                  {order.paymentMethod}

                </p>

                <p>

                  <strong>Items:</strong>{" "}

                  {order.products.length}

                </p>

              </div>

              <div className="grand-total">

                <span>Grand Total</span>

                <h2>
                  Rs. {order.totalAmount}
                </h2>

              </div>

            </div>

           <button
    className="view-btn"
    onClick={() => navigate(`/orders/${order._id}`)}
>
View Details
</button>

          </div>

        ))

      )}

    </div>
  );
};
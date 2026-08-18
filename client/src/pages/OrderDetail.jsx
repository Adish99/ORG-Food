import "./OrderDetail.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UseAuth } from "../store/Authentication";
import { toast } from "react-toastify";

export const OrderDetails = () => {

  const { id } = useParams();

  const { userAuthToken } = UseAuth();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);

  const getOrder = async () => {

    try {

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/order/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: userAuthToken,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);
      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    getOrder();

  }, [id]);

  if (loading) {
    return <h2 className="loading">Loading Order...</h2>;
  }

  if (!order) {
    return <h2 className="loading">Order Not Found</h2>;
  }

  const cancelOrder = async () => {

    const confirmCancel = window.confirm(
        "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/order/${order._id}/cancel/`,
            {
                method: "PUT",
                headers: {
                    Authorization: userAuthToken
                }
            }
        );

        const data = await res.json();


        if (res.ok) {
          toast.success(data.message);

            setOrder({
                ...order,
                orderStatus: "Cancelled"
            });

        }

    } catch (error) {

        console.log(error);

    }

};

  return (

    <div className="order-details-page">

      <h1>Order Details</h1>

      <div className="order-details-card">

        {/* Header */}

        <div className="details-header">

          <div>

            <h2>
              Order #{order._id.slice(-6)}
            </h2>

            <p>

              {new Date(order.createdAt).toLocaleString()}

            </p>

          </div>

          <span
            className={`status ${order.orderStatus.toLowerCase()}`}
          >

            {order.orderStatus}

          </span>

        </div>

        {/* Shipping */}

        <div className="details-section">

          <h3>🚚 Shipping Address</h3>

          <p>{order.shippingAddress.fullName}</p>

          <p>{order.shippingAddress.phone}</p>

          <p>

            {order.shippingAddress.street}

          </p>

          <p>

            {order.shippingAddress.city},

            {" "}

            {order.shippingAddress.district}

          </p>

          <p>

            {order.shippingAddress.province}

          </p>

        </div>

        {/* Products */}

        <div className="details-section">

          <h3>🛒 Ordered Products</h3>

          {

            order.products.map((item) => (

              <div
                className="details-product"
                key={item.productId._id}
              >

                <img
                  src={item.productId.image}
                  alt={item.name}
                />

                <div className="details-product-info">

                  <h4>{item.name}</h4>

                  <p>

                    {item.productId.weight}

                  </p>

                </div>

                <div className="details-product-right">

                  <span>

                    Qty : {item.quantity}

                  </span>

                  <strong>

                    Rs. {item.price * item.quantity}

                  </strong>

                </div>

              </div>

            ))

          }

        </div>

        {/* Payment */}

        <div className="details-section">

          <h3>💳 Payment Information</h3>

          <p>

            <strong>Method :</strong>

            {" "}

            {order.paymentMethod}

          </p>

          <p>

            <strong>Status :</strong>

            {" "}

            {order.paymentStatus}

          </p>

        </div>

        {/* Summary */}

        <div className="details-summary">

          <div>

            <span>Subtotal</span>

            <span>

              Rs. {order.totalAmount}

            </span>

          </div>

          <div>

            <span>Delivery</span>

            <span>FREE</span>

          </div>

          <hr />

          <div className="grand-total">

            <strong>Grand Total</strong>

            <strong>

              Rs. {order.totalAmount}

            </strong>

          </div>

        </div>

       {
order.orderStatus === "Pending" && (

<button
    className="cancel-btn"
    onClick={cancelOrder}
>

Cancel Order

</button>



)
}

      </div>
      {
order.orderStatus === "Cancelled" && (

<p className="cancelled-message">

❌ This order has been cancelled.

</p>

)
}

    </div>

  );

};
import "./Orders.css";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { UseAuth } from "../store/Authentication";
import { useNavigate } from "react-router-dom";
import { Loader } from "../components/UI/Loader";

export const Orders = () => {
  const { userAuthToken } = UseAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingOrder, setPayingOrder] = useState("");

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

  const initiateEsewaPayment = async (orderId) => {

    try {
setPayingOrder(orderId);
        const res = await fetch(

            "http://localhost:8000/api/payment/esewa/initiate",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    Authorization: userAuthToken

                },

                body: JSON.stringify({

                    orderId

                })

            }

        );

        const data = await res.json();

        if (!res.ok) {

            return toast.error(data.message);

        }

        const form = document.createElement("form");

        form.method = "POST";

        form.action =
            "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

        Object.entries(data.paymentData).forEach(

            ([key, value]) => {

                const input = document.createElement("input");

                input.type = "hidden";

                input.name = key;

                input.value = value;

                form.appendChild(input);

            }

        );

        document.body.appendChild(form);

        form.submit();

    } catch (error) {
setPayingOrder("");
        console.log(error);

        toast.error("Unable to initiate payment.");

    }

};

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <Loader/>
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

<strong>Payment Method :</strong>

{

order.paymentMethod === "COD"

? "Cash On Delivery"

: order.paymentMethod

}

</p>

<p>

<strong>Payment Status :</strong>

<span
    className={`payment-status ${order.paymentStatus.toLowerCase()}`}
>

    {

    order.paymentStatus === "Paid"

        ? "🟢 Paid"

        : order.paymentStatus === "Failed"

        ? "🔴 Failed"

        : "🟡 Pending"

    }

</span>

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
{

order.paymentMethod === "Esewa" &&
order.paymentStatus !== "Paid" && (

<button
className="pay-again-btn"
disabled={payingOrder === order._id}
onClick={() =>
initiateEsewaPayment(order._id)
}
>

{

payingOrder === order._id

? "Redirecting..."

: "💳 Pay Now"

}

</button>

)

}

          </div>

        ))

      )}

    </div>
  );
};
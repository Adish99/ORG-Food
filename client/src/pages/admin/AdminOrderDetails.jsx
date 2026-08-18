import "./AdminOrderDetails.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UseAuth } from "../../store/Authentication";
import { toast } from "react-toastify";
import { Loader } from "../../components/UI/Loader";

export const AdminOrderDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { userAuthToken } = UseAuth();

    const [order, setOrder] = useState(null);

    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getOrder = async () => {

        try {

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/order/admin/${id}`,

                {
                    headers: {
                        Authorization: userAuthToken
                    }
                }

            );

            const data = await res.json();

            if (res.ok) {

                setOrder(data.order);

                setStatus(data.order.orderStatus);

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getOrder();

    }, []);

    const updateStatus = async () => {
         setIsSubmitting(true);
    try {

        console.log("Sending status:", status);

        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/order/admin/${id}/update`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: userAuthToken
                },
                body: JSON.stringify({
                    orderStatus: status
                })
            }
        );

        console.log("Status Code:", res.status);

        const data = await res.json();

        console.log(data);

        if (res.ok) {
            alert(data.message);
            getOrder();
        } else {
            alert(data.message);
        }

    } catch (error) {
        console.log(error);
    }finally {
    setIsSubmitting(false);
    }
};

const deleteOrder = async () => {

    const confirmDelete = window.confirm(

        "Are you sure you want to delete this order?"

    );

    if (!confirmDelete) return;

    try {

        const res = await fetch(

            `${import.meta.env.VITE_API_URL}/api/order/admin/${id}/delete`,

            {

                method: "DELETE",

                headers: {

                    Authorization: userAuthToken

                }

            }

        );

        const data = await res.json();

        if (res.ok) {

            toast.success(data.message);

            navigate("/admin/orders");

        } else {

        toast.error(data.message);

        }

    } catch (error) {

        console.log(error);

    }

};

    if (loading) {

        return <Loader/>

    }

    return (

        <div className="admin-order-details">

            <button
                className="back-btn"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <div className="details-card">

                <div className="details-header">

                    <div>

                        <h1>

                            Order #

                            {order._id.slice(-6)}

                        </h1>

                        <p>

                            {

                                new Date(
                                    order.createdAt
                                ).toLocaleString()

                            }

                        </p>

                    </div>

                    <span
                        className={`status ${order.orderStatus.toLowerCase()}`}
                    >

                        {order.orderStatus}

                    </span>

                </div>

                <div className="section">

                    <h2>Customer Information</h2>

                    <p>

                        <strong>Name:</strong>

                        {order.userId?.username}

                    </p>

                    <p>

                        <strong>Email:</strong>

                        {order.userId?.email}

                    </p>

                    <p>

                        <strong>Phone:</strong>

                        {order.userId?.phone}

                    </p>

                </div>

                <div className="section">

                    <h2>Shipping Address</h2>

                    <p>{order.shippingAddress.fullName}</p>

                    <p>{order.shippingAddress.phone}</p>

                    <p>

                        {order.shippingAddress.street}

                    </p>

                    <p>

                        {order.shippingAddress.city},

                        {" "}

                        {order.shippingAddress.district},

                        {" "}

                        {order.shippingAddress.province}

                    </p>

                </div>

                <div className="section">

                    <h2>Ordered Products</h2>

                    {

                        order.products.map((item, index) => (

                            <div
                                key={index}
                                className="product-item"
                            >

                                <div>

                                    <h4>

                                        {item.name}

                                    </h4>

                                    <small>

                                        Weight :

                                        {" "}

                                        {

                                            item.productId?.weight

                                        }

                                    </small>

                                </div>

                                <div>

                                    Qty :

                                    {" "}

                                    {item.quantity}

                                </div>

                                <strong>

                                    Rs.

                                    {" "}

                                    {

                                        item.price *
                                        item.quantity

                                    }

                                </strong>

                            </div>

                        ))

                    }

                </div>

                <div className="section summary">

                    <p>

                        <strong>Payment :</strong>

                        {order.paymentMethod}

                    </p>

                    <h2>

                        Grand Total :

                        Rs.

                        {order.totalAmount}

                    </h2>

                </div>

                <div className="section">

                    <h2>Update Order Status</h2>

                    <select

                        value={status}

                        onChange={(e) =>
                            setStatus(e.target.value)
                        }

                    >

                        <option>Pending</option>

                        <option>Processing</option>

                        <option>Shipped</option>

                        <option>Delivered</option>

                        <option>Cancelled</option>

                    </select>

                 <button
    className="update-btn"
    onClick={updateStatus}
       disabled={isSubmitting}
>
     {isSubmitting ? "Updating..." : "Update Status"}
</button>
{(order.orderStatus === "Cancelled" ||
  order.orderStatus === "Delivered") && (

    <button
        className="delete-order-btn"
        onClick={deleteOrder}
    >
        Delete Order
    </button>

)}

                </div>

            </div>

        </div>

    );

};
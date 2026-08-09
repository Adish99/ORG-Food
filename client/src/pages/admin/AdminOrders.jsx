import "./AdminOrders.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../../store/Authentication";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/UI/Loader";
import { EmptyState } from "../../components/UI/EmptyState";

export const AdminOrders = () => {

    const { userAuthToken } = UseAuth();

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const getOrders = async () => {

        try {

            const res = await fetch(
                "http://localhost:8000/api/order/admin",
                {
                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            if (res.ok) {

                setOrders(data.orders);

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

        return <Loader/>

    }

    return (

        <div className="admin-orders-page">

            <div className="admin-orders-header">

                <h1>Manage Orders</h1>

                <p>
                    View and manage all customer orders.
                </p>

            </div>

            {

                orders.length === 0 ?

                    (

                      
                          <EmptyState
    icon="📋"
    title="No orders found"
    message="There are currently no orders matching your search or filter."
/>

                    )

                    :

                    (

                        <div className="orders-container">

                            {

                                orders.map((order) => (

                                    <div
                                        key={order._id}
                                        className="admin-order-card"
                                    >

                                        <div className="order-top">

                                            <div>

                                                <h3>

                                                    Order #

                                                    {order._id.slice(-6)}

                                                </h3>

                                                <p>

                                                    {

                                                        new Date(
                                                            order.createdAt
                                                        ).toLocaleDateString()

                                                    }

                                                </p>

                                            </div>

                                            <span
                                                className={`status ${order.orderStatus.toLowerCase()}`}
                                            >

                                                {order.orderStatus}

                                            </span>

                                        </div>

                                        <div className="customer-info">

                                            <p>

                                                <strong>Customer:</strong>

                                                {

                                                    order.userId?.username

                                                }

                                            </p>

                                            <p>

                                                <strong>Email:</strong>

                                                {

                                                    order.userId?.email

                                                }

                                            </p>

                                            <p>

                                                <strong>Phone:</strong>

                                                {

                                                    order.userId?.phone

                                                }

                                            </p>

                                        </div>

                                        <div className="product-preview">

                                            {

                                                order.products.map((item, index) => (

                                                    <div
                                                        key={index}
                                                        className="preview-item"
                                                    >

                                                        <div>

                                                            <h4>

                                                                {

                                                                    item.name

                                                                }

                                                            </h4>

                                                            <small>

                                                                Qty :

                                                                {

                                                                    item.quantity

                                                                }

                                                            </small>

                                                        </div>

                                                        <strong>

                                                            Rs.

                                                            {

                                                                item.price * item.quantity

                                                            }

                                                        </strong>

                                                    </div>

                                                ))

                                            }

                                        </div>

                                        <div className="order-summary">

                                            <p>

                                                <strong>Payment:</strong>

                                                {

                                                    order.paymentMethod

                                                }

                                            </p>

                                            <p>

                                                <strong>Total:</strong>

                                                Rs.

                                                {

                                                    order.totalAmount

                                                }

                                            </p>

                                        </div>

                                        <button

                                            className="view-btn"

                                            onClick={() =>
                                                navigate(
                                                    `/admin/orders/${order._id}`
                                                )
                                            }

                                        >

                                            View Details

                                        </button>

                                    </div>

                                ))

                            }

                        </div>

                    )

            }

        </div>

    );

};
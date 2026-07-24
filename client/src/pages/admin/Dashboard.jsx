import "./Dashboard.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../../store/Authentication";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {

    const { userAuthToken } = UseAuth();

    const navigate = useNavigate();

    const [stats, setStats] = useState({

        totalUsers: 0,

        totalProducts: 0,

        totalCategories: 0,

        totalOrders: 0,

        totalRevenue: 0,

        recentOrders: [],

        recentUsers: []

    });

    const [loading, setLoading] = useState(true);

    const getDashboardStats = async () => {

        try {

            const res = await fetch(

                "http://localhost:8000/api/auth/admin/dashboard",

                {

                    headers: {

                        Authorization: userAuthToken

                    }

                }

            );

            const data = await res.json();

            if (res.ok) {

                setStats(data);

            }

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getDashboardStats();

    }, []);

    if (loading) {

        return <h2>Loading Dashboard...</h2>;

    }

    return (

        <div className="dashboard">

            <h1>Dashboard</h1>

            {/* Dashboard Cards */}

            <div className="dashboard-cards">

                <div

                    className="card clickable"

                    onClick={() => navigate("/admin/users")}

                >

                    <h3>Total Users</h3>

                    <h1>{stats.totalUsers}</h1>

                </div>

                <div

                    className="card clickable"

                    onClick={() => navigate("/admin/products")}

                >

                    <h3>Total Products</h3>

                    <h1>{stats.totalProducts}</h1>

                </div>

                <div

                    className="card clickable"

                    onClick={() => navigate("/admin/categories")}

                >

                    <h3>Total Categories</h3>

                    <h1>{stats.totalCategories}</h1>

                </div>

                <div

                    className="card clickable"

                    onClick={() => navigate("/admin/orders")}

                >

                    <h3>Total Orders</h3>

                    <h1>{stats.totalOrders}</h1>

                </div>

                <div className="card revenue">

                    <h3>Total Revenue</h3>

                    <h1>Rs. {stats.totalRevenue}</h1>

                </div>

            </div>

            {/* Recent Orders */}

            <div className="dashboard-section">

                <h2>Recent Orders</h2>

                <table>

                    <thead>

                        <tr>

                            <th>Order ID</th>

                            <th>Customer</th>

                            <th>Status</th>

                            <th>Total</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            stats.recentOrders.length > 0 ? (

                                stats.recentOrders.map((order) => (

                                    <tr

                                        key={order._id}

                                        className="clickable-row"

                                        onClick={() =>

                                            navigate(`/admin/orders/${order._id}`)

                                        }

                                    >

                                        <td>

                                            #{order._id.slice(-6)}

                                        </td>

                                        <td>

                                            {order.userId?.username}

                                        </td>

                                        <td>

                                            <span

                                                className={`order-status ${order.orderStatus.toLowerCase()}`}

                                            >

                                                {order.orderStatus}

                                            </span>

                                        </td>

                                        <td>

                                            Rs. {order.totalAmount}

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="4">

                                        No recent orders found.

                                    </td>

                                </tr>

                            )

                        }

                    </tbody>

                </table>

            </div>

            {/* Recent Users */}

            <div className="dashboard-section">

                <h2>Recent Users</h2>

                <table>

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Joined</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            stats.recentUsers.length > 0 ? (

                                stats.recentUsers.map((user) => (

                                    <tr

                                        key={user._id}

                                        className="clickable-row"

                                        onClick={() => navigate("/admin/users")}

                                    >

                                        <td>

                                            {user.username}

                                        </td>

                                        <td>

                                            {user.email}

                                        </td>

                                        <td>

                                            {

                                                new Date(

                                                    user.createdAt

                                                ).toLocaleDateString()

                                            }

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="3">

                                        No recent users found.

                                    </td>

                                </tr>

                            )

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

};
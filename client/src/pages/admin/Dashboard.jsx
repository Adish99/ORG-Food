
import "./Dashboard.css";
import {

    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,

    BarChart,
    Bar,

    PieChart,
    Pie,
    Cell,

    Legend

} from "recharts";
import { useEffect, useState } from "react";
import { UseAuth } from "../../store/Authentication";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/UI/Loader";
import { DashboardSkeleton } from "../../components/UI/DashboardSkeleton";

export const Dashboard = () => {

    const { userAuthToken } = UseAuth();

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalRevenue: 0,

    recentOrders: [],
    recentUsers: [],

    monthlyRevenue: [],
    monthlyOrders: [],
    orderStatusData: [],
    topSellingProducts: []
});

    const [loading, setLoading] = useState(true);

   const getDashboardData = async () => {
setLoading(true);
    try {

        const res = await fetch(

            "http://localhost:8000/api/admin/dashboard",

            {
                headers: {
                    Authorization: userAuthToken
                }
            }

        );

        const data = await res.json();

        if (res.ok) {

            setDashboardData(data);

        }

    } catch (error) {

        console.log(error);

    }finally{
        setLoading(false);
    }

};

    useEffect(() => {

        getDashboardData();

    }, []);

   if (loading) {
    return <DashboardSkeleton />;
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

                    <h1>{dashboardData.totalUsers}</h1>

                </div>

                <div

                    className="card clickable"

                    onClick={() => navigate("/admin/products")}

                >

                    <h3>Total Products</h3>

                    <h1>{dashboardData.totalProducts}</h1>

                </div>

                <div

                    className="card clickable"

                    onClick={() => navigate("/admin/categories")}

                >

                    <h3>Total Categories</h3>

                    <h1>{dashboardData.totalCategories}</h1>

                </div>

                <div

                    className="card clickable"

                    onClick={() => navigate("/admin/orders")}

                >

                    <h3>Total Orders</h3>

                    <h1>{dashboardData.totalOrders}</h1>

                </div>

                <div className="card revenue">

                    <h3>Total Revenue</h3>

                    <h1>Rs. {dashboardData.totalRevenue}</h1>

                </div>

            </div>

            {/* Dashboard Charts */}

<div className="dashboard-charts">

    {/* Monthly Revenue */}

    <div className="chart-card">

        <h2>Monthly Revenue</h2>

        <ResponsiveContainer width="100%" height={300}>

            <LineChart data={dashboardData.monthlyRevenue}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Line

                    type="monotone"

                    dataKey="revenue"

                    stroke="#4CAF50"

                    strokeWidth={3}

                />

            </LineChart>

        </ResponsiveContainer>

    </div>

    {/* Monthly Orders */}

    <div className="chart-card">

        <h2>Monthly Orders</h2>

        <ResponsiveContainer width="100%" height={300}>

            <BarChart data={dashboardData.monthlyOrders}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Bar

                    dataKey="orders"

                    fill="#2196F3"

                />

            </BarChart>

        </ResponsiveContainer>

    </div>

    {/* Order Status */}

    <div className="chart-card">

        <h2>Order Status</h2>

        <ResponsiveContainer width="100%" height={300}>

            <PieChart>

                <Pie

                    data={dashboardData.orderStatusData}

                    dataKey="count"

                    nameKey="status"

                    outerRadius={100}

                    label

                >

                    <Cell fill="#FF9800" />

                    <Cell fill="#4CAF50" />

                    <Cell fill="#2196F3" />

                    <Cell fill="#F44336" />

                    <Cell fill="#9C27B0" />

                </Pie>

                <Tooltip />

                <Legend />

            </PieChart>

        </ResponsiveContainer>

    </div>

    {/* Top Selling Products */}

    <div className="chart-card">

        <h2>Top Selling Products</h2>

        <ResponsiveContainer width="100%" height={300}>

            <BarChart

                data={dashboardData.topSellingProducts}

                layout="vertical"

            >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis type="number" />

                <YAxis

                    dataKey="product"

                    type="category"

                />

                <Tooltip />

                <Bar

                    dataKey="sold"

                    fill="#673AB7"

                />

            </BarChart>

        </ResponsiveContainer>

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

                            dashboardData.recentOrders.length > 0 ? (

                                dashboardData.recentOrders.map((order) => (

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

                            dashboardData.recentUsers.length > 0 ? (

                                dashboardData.recentUsers.map((user) => (

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
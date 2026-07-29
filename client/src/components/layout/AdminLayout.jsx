import "./AdminLayout.css";
import { NavLink, Outlet } from "react-router-dom";

export const AdminLayout = () => {

    return (

        <div className="admin-layout">

            <aside className="sidebar">

                <div className="sidebar-logo">

                    <h2>🌿 ORG-FOOD</h2>

                    <p>Admin Panel</p>

                </div>

                <nav>

                    <NavLink
                        to="/admin/dashboard"
                        className="sidebar-link"
                    >
                        📊 Dashboard
                    </NavLink>

                    <NavLink
                        to="/admin/products"
                        className="sidebar-link"
                    >
                        📦 Products
                    </NavLink>

                    <NavLink
                        to="/admin/categories"
                        className="sidebar-link"
                    >
                        🗂 Categories
                    </NavLink>

                    <NavLink
                        to="/admin/orders"
                        className="sidebar-link"
                    >
                        🛒 Orders
                    </NavLink>

                    <NavLink
                        to="/admin/users"
                        className="sidebar-link"
                    >
                        👥 Users
                    </NavLink>
                    <NavLink to="/admin/messages" className="sidebar-link">
    Customer Messages
</NavLink>
                    <NavLink
                        to="/"
                        className="sidebar-link"
                    >
                        Home
                    </NavLink>

                </nav>

                <NavLink
                    to="/logout"
                    className="logout-btn"
                >
                    🚪 Logout
                </NavLink>


            </aside>

            <main className="admin-main">

                <Outlet />

            </main>

        </div>

    );

};
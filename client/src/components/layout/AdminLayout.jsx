import "./AdminLayout.css";
import { NavLink, Outlet } from "react-router-dom";
import { UseAuth } from "../../store/Authentication";

export const AdminLayout = () => {

    const { user } = UseAuth();

    return (

        <div className="admin-layout">

            <aside className="sidebar">

                <div className="sidebar-logo">

                    <h2>🌿 ORG-FOOD</h2>

                    <p>Admin Panel</p>

                </div>


                {/* ==========================
                    Admin Profile
                ========================== */}

                <NavLink
                    to="/admin/profile"
                    className="admin-sidebar-profile"
                >

                    <div className="admin-sidebar-avatar">

                        {user?.profileImage ? (

                            <img
                                src={user.profileImage}
                                alt="Admin Profile"
                            />

                        ) : (

                            <div className="admin-sidebar-default-avatar">

                                {user?.username
                                    ?.charAt(0)
                                    .toUpperCase() || "A"}

                            </div>

                        )}

                    </div>


                    <div className="admin-sidebar-user-info">

                        <h3>
                            {user?.username || "Admin"}
                        </h3>

                        <span>
                            {user?.role?.toUpperCase() || "ADMIN"}
                        </span>

                    </div>

                </NavLink>


                {/* ==========================
                    Navigation
                ========================== */}

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


                    <NavLink
                        to="/admin/messages"
                        className="sidebar-link"
                    >
                        📩 Customer Messages
                    </NavLink>


                    <NavLink
                        to="/admin/profile"
                        className="sidebar-link"
                    >
                        👤 Profile
                    </NavLink>


                    <NavLink
                        to="/"
                        className="sidebar-link"
                    >
                        🏠 Home
                    </NavLink>

                </nav>


                {/* ==========================
                    Logout
                ========================== */}

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
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { UseAuth } from "../../store/Authentication";
import { useContext, useState } from "react";


export const Navbar = () => {
const [menuOpen, setMenuOpen] = useState(false);

    const {
        isLoggedIn,
        user,
        loading
    } = UseAuth();

    console.log({
        isLoggedIn,
        user,
        loading
    });
    if (loading) {
        return null;
    }

return (

  <nav className="navbar">

    <div className="logo">
        <NavLink to="/">
            🌱 Org-Khana
        </NavLink>
    </div>

    {/* Mobile Menu Button */}
    <button
        className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
    >
        {menuOpen ? "✕" : "☰"}
    </button>

    <ul className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>

        <li>
            <NavLink to="/" onClick={() => setMenuOpen(false)}>
                Home
            </NavLink>
        </li>

        <li>
            <NavLink to="/about" onClick={() => setMenuOpen(false)}>
                Learn More
            </NavLink>
        </li>

        <li>
            <NavLink to="/products" onClick={() => setMenuOpen(false)}>
                Products
            </NavLink>
        </li>

        {isLoggedIn && (
            <li>
                <NavLink to="/wishlist" onClick={() => setMenuOpen(false)}>
                    ❤️ Wishlist
                </NavLink>
            </li>
        )}

        {isLoggedIn && user?.role === "admin" && (
            <li>
                <NavLink to="/admin/dashboard" onClick={() => setMenuOpen(false)}>
                    Admin
                </NavLink>
            </li>
        )}

        {isLoggedIn && (
            <li>
                <NavLink to="/cart" onClick={() => setMenuOpen(false)}>
                    Cart 🛒
                </NavLink>
            </li>
        )}

        {isLoggedIn && (
            <li>
                <NavLink to="/orders" onClick={() => setMenuOpen(false)}>
                    Orders
                </NavLink>
            </li>
        )}

        {isLoggedIn && (
            <li>
                <NavLink to="/coupons" onClick={() => setMenuOpen(false)}>
                    🎟️ Coupons
                </NavLink>
            </li>
        )}

        {isLoggedIn && (
            <li>
                <NavLink to="/checkout" onClick={() => setMenuOpen(false)}>
                    Checkout
                </NavLink>
            </li>
        )}

        {!isLoggedIn ? (
            <>
                <li>
                    <NavLink to="/login" onClick={() => setMenuOpen(false)}>
                        Login
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/register" onClick={() => setMenuOpen(false)}>
                        Register
                    </NavLink>
                </li>
            </>
        ) : (
            <li>
                <NavLink to="/logout" onClick={() => setMenuOpen(false)}>
                    Logout
                </NavLink>
            </li>
        )}

        {isLoggedIn && (
            <li>
                <NavLink
                    to="/profile"
                    className="account-link"
                    onClick={() => setMenuOpen(false)}
                >
                    <div className="navbar-profile-picture">
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt="Profile"
                            />
                        ) : (
                            <div className="navbar-default-avatar">
                                {user?.username
                                    ?.charAt(0)
                                    .toUpperCase() || "A"}
                            </div>
                        )}
                    </div>

                    <span>My Account</span>
                </NavLink>
            </li>
        )}

    </ul>

</nav>
);
};
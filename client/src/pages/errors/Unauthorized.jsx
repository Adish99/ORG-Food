import { Link } from "react-router-dom";
import "./ErrorPages.css";

export const Unauthorized = () => {
    return (
        <div className="error-page">

            <h1>403</h1>

            <h2>Access Denied</h2>

            <p>
                You don't have permission to access this page.
            </p>

            <Link to="/" className="error-btn">
                Back to Home
            </Link>

        </div>
    );
};
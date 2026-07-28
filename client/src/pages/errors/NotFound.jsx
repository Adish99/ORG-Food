import { Link } from "react-router-dom";
import "./ErrorPages.css";

export const NotFound = () => {
    return (
        <div className="error-page">
            <h1>404</h1>

            <h2>Page Not Found</h2>

            <p>
                Sorry, the page you're looking for doesn't exist.
            </p>

            <Link to="/" className="error-btn">
                Go Home
            </Link>
        </div>
    );
};
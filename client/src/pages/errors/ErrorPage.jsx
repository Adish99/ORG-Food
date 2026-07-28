import { Link } from "react-router-dom";
import "./ErrorPages.css";

export const ErrorPage = () => {
    return (
        <div className="error-page">

            <h1>Oops!</h1>

            <h2>Something went wrong.</h2>

            <p>
                Please try again later.
            </p>

            <Link to="/" className="error-btn">
                Go Home
            </Link>

        </div>
    );
};
import { Navigate } from "react-router-dom";
import { UseAuth } from "../store/Authentication";


//Protected Routes component
export const AdminProtectedRoute = ({ children }) => {

    const {

        isLoggedIn,

        user,

        loading

    } = UseAuth();
    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!isLoggedIn) {

        return <Navigate to="/login" replace />;

    }

    if (user?.role !== "admin") {

        return <Navigate to="/403" replace />;

    }

    return children;

};
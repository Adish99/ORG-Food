import { Navigate } from "react-router-dom";
import { UseAuth } from "../store/Authentication";

//Protected routes component
export const ProtectedRoute=({children})=>{


const {isLoggedIn,loading}=UseAuth();

if (loading) {

    return <h2>Loading...</h2>;

}

if(!isLoggedIn){

return <Navigate to="/login"/>

}

return children;


}
import { Navigate } from "react-router-dom";
import { UseAuth } from "../store/Authentication";


export const ProtectedRoute=({children})=>{


const {isLoggedIn}=UseAuth();



if(!isLoggedIn){

return <Navigate to="/login"/>

}

return children;


}
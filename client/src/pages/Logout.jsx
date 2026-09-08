import { useEffect } from "react"
import {useNavigate} from "react-router-dom";
import { UseAuth } from "../store/Authentication";

//Logout component
export const Logout=()=>{
const {userLogout}=UseAuth();
const navigate=useNavigate();

    useEffect(()=>{
    userLogout();
    navigate("/login");
    },[userLogout]);
}
import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { CustomerSupportButton } from "../CustomerSupportButton"
import { PaymentNotice } from "./PaymentNotice"

export const WebLayout=()=>{
    return(
        <>
        <Navbar/>
        <PaymentNotice/>
        <Outlet/>
         <CustomerSupportButton />
        <Footer/>
         </>
    )
}
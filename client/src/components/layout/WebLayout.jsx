import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"
import { CustomerSupportButton } from "../CustomerSupportButton"

export const WebLayout=()=>{
    return(
        <>
        <Navbar/>
        <Outlet/>
         <CustomerSupportButton />
        <Footer/>
         </>
    )
}
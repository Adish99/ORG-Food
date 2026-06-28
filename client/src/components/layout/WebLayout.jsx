import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export const WebLayout=()=>{
    return(
        <>
        <Navbar/>
        <Outlet/>
        <Footer/>
         </>
    )
}
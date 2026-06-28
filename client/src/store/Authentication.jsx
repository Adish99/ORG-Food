import { createContext, useContext, useState } from "react";


// Creating AuthContext

export const AuthContext=createContext();



export const AuthProvider=({children})=>{
const [token,setToken]=useState(localStorage.getItem("orgToken"));

let isLoggedIn=!!token;
console.log("isLoggedIn",isLoggedIn);


//User Logout
const userLogout=()=>{
    setToken("");
   return localStorage.removeItem("orgToken");
}

// Store token
const storeTokenInLs=(serverToken)=>{


localStorage.setItem(
"orgToken",
serverToken
);


setToken(serverToken);


}

return (

<AuthContext.Provider

value={{

token,

storeTokenInLs,

isLoggedIn,
 userLogout
}}

>


{children}


</AuthContext.Provider>


)


}




// Custom hook

export const UseAuth=()=>{

const authContextValue=useContext(AuthContext);
if(!authContextValue){

throw new Error(
"No auth context value!"
);

}
return authContextValue;
}
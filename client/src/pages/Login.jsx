import {useState} from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../store/Authentication";

export const Login=()=>{


const [loginData,setLoginData]=useState({

email:"",
password:""

});

const {storeTokenInLs}=UseAuth();

const navigate=useNavigate();

const handleChange=(e)=>{

setLoginData({

...loginData,

[e.target.name]:e.target.value

})

}

const handleSubmit=async(e)=>{
    e.preventDefault();

    try{
const res=await fetch("http://localhost:8000/api/login",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(loginData)
});

const data=await res.json();
console.log(data);

if(res.ok){
    alert("Login Successful.");
    storeTokenInLs(data.token);
    setLoginData({
        email:"",
        password:""
    });
navigate("/");
}else{
    console.log(data.message);
}
    }catch(error){
        console.log(error);
    }
}

return(

<div className="auth-container">


<form

className="auth-form"

onSubmit={handleSubmit}

>


<h2>
Welcome Back 🌱
</h2>

<input

type="email"

name="email"

placeholder="Email"

value={loginData.email}

onChange={handleChange}

/>

<input

type="password"

name="password"

placeholder="Password"

value={loginData.password}

onChange={handleChange}
/>
<button>

Login

</button>

</form>
</div>
)
}
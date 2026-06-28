import {useState} from "react";
import "./Auth.css";
import { useNavigate} from "react-router-dom";
import { UseAuth } from "../store/Authentication";

export const Register=()=>{


const [formData,setFormData]=useState({

username:"",
email:"",
password:"",
phone:"",
address:""

});

const navigate=useNavigate();

const {storeTokenInLs}=UseAuth();

const handleChange=(e)=>{

setFormData({

...formData,

[e.target.name]:e.target.value

})

}

const handleSubmit=async(e)=>{
e.preventDefault();
try{
    const res=await fetch("http://localhost:8000/api/register",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    });

    const data=await res.json();
      console.log(data);
    if(res.ok){
        alert("Registration sucessfull.");
        storeTokenInLs(data.token);
        setFormData({
username:"",
email:"",
password:"",
phone:"",
address:""
});
navigate("/");
    }else{
        console.log(data.message);
    }
}catch(error){
    alert("Registration failed!");
    console.log(error);
}
}

return(

<div className="auth-container">


<form 
className="auth-form"
onSubmit={handleSubmit}
>

<h2>Create Account 🌱</h2>

<input

type="text"

name="username"

placeholder="Username"

value={formData.username}

onChange={handleChange}

/>

<input

type="email"

name="email"

placeholder="Email"

value={formData.email}

onChange={handleChange}

/>

<input

type="password"

name="password"

placeholder="Password"

value={formData.password}

onChange={handleChange}

/>

<input

type="text"

name="phone"

placeholder="Phone Number"

value={formData.phone}

onChange={handleChange}

/>

<textarea

name="address"

placeholder="Address"

value={formData.address}

onChange={handleChange}

/>

<button>
Register
</button>

</form>

</div>
)
}
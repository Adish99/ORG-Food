import {useState} from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { UseAuth } from "../store/Authentication";
import { toast } from "react-toastify";

export const Login=()=>{


const [loginData,setLoginData]=useState({

email:"",
password:""

});
const [isSubmitting, setIsSubmitting] = useState(false);

const {storeTokenInLs,storeUser}=UseAuth();


const navigate=useNavigate();

const handleChange=(e)=>{

setLoginData({

...loginData,

[e.target.name]:e.target.value

})

}

const handleSubmit=async(e)=>{
    e.preventDefault();
 setIsSubmitting(true);
    try{
const res=await fetch("http://localhost:8000/api/login",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify(loginData)
});

const data=await res.json();
console.log("Response:", data);
console.log("Toast",toast);

if(res.ok){
    toast.success("Login Successfully");
    storeTokenInLs(data.token);
    storeUser(data.user);
    setLoginData({
        email:"",
        password:""
    });
navigate("/");
}else{
    toast.error("Login failed!");
    console.log(data.message);
}
    }catch(error){
        console.log(error);
    }finally {
    setIsSubmitting(false);
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
<button
    type="submit"
    disabled={isSubmitting}
>
    {isSubmitting ? "Logging in..." : "Login"}
</button>
<p className="forgot-link">

    <span

        onClick={() => navigate("/forgot-password")}

    >

        Forgot Password?

    </span>

</p>

</form>
</div>
)
}
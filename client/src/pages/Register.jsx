import {useState} from "react";
import "./Auth.css";
import { useNavigate} from "react-router-dom";
import { UseAuth } from "../store/Authentication";
import { toast } from "react-toastify";

export const Register=()=>{


const [formData,setFormData]=useState({

username:"",
email:"",
password:"",
phone:"",
address:""

});
const [isSubmitting, setIsSubmitting] = useState(false);
const [showPassword, setShowPassword] = useState(false);

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
 setIsSubmitting(true);
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
       toast.success("Registration Successfully");
        storeTokenInLs(data.token);
        setFormData({
username:"",
email:"",
password:"",
phone:"",
address:""
});

navigate("/verify-otp", {

    state: {

        email: data.email

    }

});
    }else{
        console.log(data.message);
    }
}catch(error){
   toast.error("Registration failed!");
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

<div className="password-input">

    <input
        type={showPassword ? "text" : "password"}
        name="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={handleChange}
        required
    />

    <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
    >
        {showPassword ? "🙈" : "👁️"}
    </button>

</div>

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

<button
    type="submit"
    disabled={isSubmitting}
>
    {isSubmitting ? "Registering..." : "Register"}
</button>

</form>

</div>
)
}
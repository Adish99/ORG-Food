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
const [showPassword, setShowPassword] = useState(false);


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
const res=await fetch(`${import.meta.env.VITE_API_URL}/api/login`,{
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

return (

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

            <div className="password-input">

                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />

                <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                        setShowPassword(!showPassword)
                    }
                >
                    {showPassword ? "🙈" : "👁️"}
                </button>

            </div>

           <button
    type="submit"
    disabled={isSubmitting}
>
    {isSubmitting
        ? "Logging in..."
        : "Login"}
</button>

<p className="forgot-link">
    <span
        onClick={() =>
            navigate("/forgot-password")
        }
    >
        Forgot Password?
    </span>
</p>

<p className="auth-switch">
    Don't have an account?{" "}
    <span onClick={() => navigate("/register")}>
        Sign up now
    </span>
</p>

        </form>

    </div>

);
}
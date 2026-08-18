import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UseAuth } from "../store/Authentication";
import "./Auth.css";

export const VerifyOtp = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const { storeTokenInLs, storeUser } = UseAuth();

    const [otp, setOtp] = useState("");
    const [countdown, setCountdown] = useState(0);

    const email = location.state?.email || "";

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/verify-otp`,
                {
                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        email,

                        otp

                    })

                }
            );

            const data = await res.json();

            if (res.ok) {

                toast.success(data.message);

                storeTokenInLs(data.token);

                storeUser(data.user);

                navigate("/");

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

            toast.error("Verification failed.");

        }

    };

    const resendOtp = async () => {

    try {

        const res = await fetch(

            `${import.meta.env.VITE_API_URL}/api/resend-otp`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email

                })

            }

        );

        const data = await res.json();

        if (res.ok) {

           toast.success(data.message);

setCountdown(60);

        } else {

            toast.error(data.message);

        }

    } catch (error) {

        console.log(error);

    }

};
//This is for countdown
useEffect(() => {

    if (countdown <= 0) return;

    const timer = setInterval(() => {

        setCountdown((prev) => prev - 1);

    }, 1000);

    return () => clearInterval(timer);

}, [countdown]);

    return (

        <div className="auth-container">

            <form
                className="auth-form"
                onSubmit={handleSubmit}
            >

                <h2>

                    Verify Email

                </h2>

                <p>

                    Enter the OTP sent to

                    <br />

                    <strong>{email}</strong>

                </p>

                <input

                    type="text"

                    placeholder="Enter OTP"

                    value={otp}

                    onChange={(e) =>
                        setOtp(e.target.value)
                    }

                    required

                />

                <button>

                    Verify

                </button>
<button

type="button"

className="resend-btn"

onClick={resendOtp}

disabled={countdown > 0}

>

{

countdown > 0

?

`Resend OTP in ${countdown}s`

:

"Resend OTP"

}

</button>
            </form>

        </div>

    );

};
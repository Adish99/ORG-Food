import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css";

export const VerifyResetOtp = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/verify-reset-otp`,

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

                navigate(

                    "/reset-password",

                    {

                        state: {

                            email

                        }

                    }

                );

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log(error);

            toast.error("Something went wrong.");

        }

    };

    return (

        <div className="auth-container">

            <form

                className="auth-form"

                onSubmit={handleSubmit}

            >

                <h2>

                    Verify Reset OTP

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

                    Verify OTP

                </button>

            </form>

        </div>

    );

};
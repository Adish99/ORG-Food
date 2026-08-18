import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css";

export const ForgotPassword = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch(

                `${import.meta.env.VITE_API_URL}/api/forgot-password`,

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

                navigate(

                    "/verify-reset-otp",

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

                    Forgot Password

                </h2>

                <p>

                    Enter your registered email.

                </p>

                <input

                    type="email"

                    placeholder="Email"

                    value={email}

                    onChange={(e) =>
                        setEmail(e.target.value)
                    }

                    required

                />

                <button>

                    Send OTP

                </button>

            </form>

        </div>

    );

};
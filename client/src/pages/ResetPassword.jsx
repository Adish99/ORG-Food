import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css";

export const ResetPassword = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email || "";

    const [formData, setFormData] = useState({

        newPassword: "",

        confirmPassword: ""

    });

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value

        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (formData.newPassword !== formData.confirmPassword) {

            return toast.error("Passwords do not match.");

        }

        try {

            const res = await fetch(

                "http://localhost:8000/api/reset-password",

                {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json"

                    },

                    body: JSON.stringify({

                        email,

                        newPassword: formData.newPassword,

                        confirmPassword: formData.confirmPassword

                    })

                }

            );

            const data = await res.json();

            if (res.ok) {

                toast.success(data.message);

                navigate("/login");

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

                    Reset Password

                </h2>

                <p>

                    Create your new password.

                </p>

                <input

                    type="password"

                    name="newPassword"

                    placeholder="New Password"

                    value={formData.newPassword}

                    onChange={handleChange}

                    required

                />

                <input

                    type="password"

                    name="confirmPassword"

                    placeholder="Confirm Password"

                    value={formData.confirmPassword}

                    onChange={handleChange}

                    required

                />

                <button>

                    Reset Password

                </button>

            </form>

        </div>

    );

};
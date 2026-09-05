import "./Coupons.css";
import { useEffect, useState } from "react";
import { UseAuth } from "../store/Authentication";
import { toast } from "react-toastify";
import { Loader } from "../components/UI/Loader";
import { EmptyState } from "../components/UI/EmptyState";

export const Coupons = () => {

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userAuthToken } = UseAuth();
    
//get coupons function
    const getCoupons = async () => {

        try {

            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/coupon`,
                {
                    method: "GET",
                    headers: {
                        Authorization: userAuthToken
                    }
                }
            );

            const data = await res.json();

            if (res.ok) {

                setCoupons(data.coupons || []);

            } else {

                toast.error(data.message);

            }

        } catch (error) {

            console.log("Get coupons error:", error);

            toast.error("Unable to fetch coupons.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        getCoupons();

    }, []);
//copy coupon function
    const copyCoupon = async (code) => {

        try {

            await navigator.clipboard.writeText(code);

            toast.success("Coupon code copied!");

        } catch (error) {

            console.log("Copy coupon error:", error);

            toast.error("Unable to copy coupon code.");

        }

    };

    if (loading) {

        return <Loader />;

    }

    if (coupons.length === 0) {

        return (
            <EmptyState
                icon="🎟️"
                title="No coupons available"
                message="Keep shopping to unlock exciting coupons and discounts!"
                buttonText="Continue Shopping"
                onButtonClick={() => {
                    window.location.href = "/products";
                }}
            />
        );

    }

    return (

        <div className="coupons-page">

            <h1>🎟️ My Coupons</h1>

            <p className="coupons-subtitle">
                Use your available coupons at checkout.
            </p>

            <div className="coupons-container">

                {coupons.map((coupon) => (

                    <div
                        className="coupon-card"
                        key={coupon._id}
                    >

                        <div className="coupon-info">

                            <h2>
                                {coupon.code}
                            </h2>

                            <p className="coupon-discount">

                                {coupon.discountType === "percentage"
                                    ? `${coupon.discountValue}% OFF`
                                    : `Rs. ${coupon.discountValue} OFF`
                                }

                            </p>

                            <p>

                                Valid until:{" "}

                                {new Date(
                                    coupon.expiryDate
                                ).toLocaleDateString()}

                            </p>

                        </div>

                        <button
                            onClick={() =>
                                copyCoupon(coupon.code)
                            }
                        >
                            Copy Code
                        </button>

                    </div>

                ))}

            </div>

        </div>

    );

};
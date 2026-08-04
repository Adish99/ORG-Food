import "./Payment.css";
import { useNavigate } from "react-router-dom";

export const PaymentSuccess = () => {

    const navigate = useNavigate();

    return (

        <div className="payment-page">

            <div className="payment-card">

                <h1>✅ Payment Successful</h1>

                <p>

                    Thank you! Your payment has been completed successfully.

                </p>

                <button
                    onClick={() => navigate("/orders")}
                >

                    View My Orders

                </button>

            </div>

        </div>

    );

};
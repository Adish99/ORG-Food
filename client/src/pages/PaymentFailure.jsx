import "./Payment.css";
import { useNavigate } from "react-router-dom";

export const PaymentFailure = () => {

    const navigate = useNavigate();

    return (

        <div className="payment-page">

            <div className="payment-card">

                <h1>❌ Payment Failed</h1>

                <p>

                    Your payment could not be completed.

                    Please try again.

                </p>

                <button
                    onClick={() => navigate("/checkout")}
                >

                    Try Again

                </button>

            </div>

        </div>

    );

};
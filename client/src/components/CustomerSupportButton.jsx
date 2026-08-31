import { useNavigate } from "react-router-dom";
import "./CustomerSupportButton.css";

//Customer supoort button Component
export const CustomerSupportButton = () => {

    const navigate = useNavigate();

    return (

        <button
            className="support-btn"
            onClick={() => navigate("/contact")}
            title="Need Help?"
        >
            💬
        </button>

    );

};
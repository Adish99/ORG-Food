const sendEmail = require("./sendEmail");

const sendPaymentSuccessEmail = async (user, order) => {

    const html = `

        <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
        ">

            <h1 style="color: #2e7d32;">
                Org-Khana 🌱
            </h1>

            <h2>
                💳 Payment Successful
            </h2>

            <p>
                Hello ${user.username},
            </p>

            <p>
                Your payment has been successfully received.
                Your order is now confirmed.
            </p>

            <hr>

            <h3>Payment Details</h3>

            <p>
                <strong>Order ID:</strong>
                ${order._id}
            </p>

            <p>
                <strong>Payment Method:</strong>
                ${order.paymentMethod}
            </p>

            <p>
                <strong>Amount Paid:</strong>
                Rs. ${order.totalAmount}
            </p>

            <p>
                <strong>Payment ID:</strong>
                ${order.paymentId}
            </p>

            <p>
                <strong>Payment Status:</strong>
                Paid
            </p>

            <br>

            <p>
                Thank you for shopping with
                <strong>Org-Khana</strong> 🌱
            </p>

        </div>

    `;

    try {

        await sendEmail(
            user.email,
            "Payment Successful - Org-Khana",
            html
        );

        console.log(
            `Payment success email sent to ${user.email}`
        );

    } catch (error) {

        console.log(
            "Payment success email error:",
            error
        );

    }

};

module.exports = sendPaymentSuccessEmail;
const sendEmail = require("./sendEmail");

const sendOrderStatusEmail = async (user, order, status) => {

    const statusMessages = {

        Placed: {
            subject: "Order Placed Successfully - Org-Khana",
            title: "🛒 Order Placed Successfully!",
            message:
                "Thank you for your order! We have successfully received your order and will start processing it soon."
        },

        Processing: {
            subject: "Your Order Is Being Processed - Org-Khana",
            title: "⚙️ Your Order Is Being Processed",
            message:
                "Good news! We have started preparing your order."
        },

        Shipped: {
            subject: "Your Order Has Been Shipped - Org-Khana",
            title: "🚚 Your Order Is On The Way!",
            message:
                "Your order has been shipped and is now on its way to you."
        },

        Delivered: {
            subject: "Your Order Has Been Delivered - Org-Khana",
            title: "✅ Your Order Has Been Delivered!",
            message:
                "Your order has been successfully delivered. Thank you for shopping with Org-Khana!"
        },

        Cancelled: {
            subject: "Your Order Has Been Cancelled - Org-Khana",
            title: "❌ Your Order Has Been Cancelled",
            message:
                "Your order has been cancelled successfully. If you believe this was done by mistake, please contact our support team."
        }

    };


    const statusInfo = statusMessages[status];


    if (!statusInfo) {

        console.log(
            `No email template found for status: ${status}`
        );

        return;

    }


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
                Org-Khana
            </h1>

            <h2>
                ${statusInfo.title}
            </h2>

            <p>
                Hello ${user.username},
            </p>

            <p>
                ${statusInfo.message}
            </p>

            <hr>

            <h3>Order Details</h3>

            <p>
                <strong>Order ID:</strong>
                ${order._id}
            </p>

            <p>
                <strong>Total Amount:</strong>
                Rs. ${order.totalAmount}
            </p>

            <p>
                <strong>Order Status:</strong>
                ${status}
            </p>

            <br>

            <p>
                Thank you for choosing
                <strong>Org-Khana</strong> 🌱
            </p>

        </div>

    `;


    try {

        await sendEmail(
            user.email,
            statusInfo.subject,
            html
        );

        console.log(
            `Order ${status} email sent to ${user.email}`
        );

    } catch (error) {

        console.log(
            `Order ${status} email error:`,
            error
        );

    }

};


module.exports = sendOrderStatusEmail;
const sendEmail = require("./sendEmail");

const sendCouponGeneratedEmail = async (user, coupon) => {

    let couponReason = "You have earned a new coupon!";

    if (coupon.couponType === "loyalty") {

        couponReason =
            `Congratulations! You completed ${coupon.purchaseMilestone} delivered purchases.`;

    }

    if (coupon.couponType === "monthly-spending") {

        couponReason =
            "Congratulations! You have spent Rs. 2500 or more this month.";

    }

    if (coupon.couponType === "special") {

        couponReason =
            `Congratulations! You successfully used ${coupon.usedCouponMilestone} coupons.`;

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
                Org-Khana 🌱
            </h1>

            <h2>
                🎟️ Congratulations! You Earned a Coupon
            </h2>

            <p>
                Hello ${user.username},
            </p>

            <p>
                ${couponReason}
            </p>

            <hr>

            <h3>Coupon Details</h3>

            <p>
                <strong>Coupon Code:</strong>
                ${coupon.code}
            </p>

            <p>
                <strong>Discount:</strong>
                ${coupon.discountValue}% OFF
            </p>

            <p>
                <strong>Minimum Purchase:</strong>
                Rs. ${coupon.minPurchaseAmount || 0}
            </p>

            <p>
                <strong>Valid Until:</strong>
                ${new Date(
                    coupon.expiryDate
                ).toLocaleDateString()}
            </p>

            <br>

            <p>
                You can use this coupon during checkout.
            </p>

            <p>
                Thank you for shopping with
                <strong>Org-Khana</strong> 🌱
            </p>

        </div>

    `;


    try {

        await sendEmail(
            user.email,
            "🎟️ You Earned a New Coupon - Org-Khana",
            html
        );

        console.log(
            `Coupon email sent to ${user.email}`
        );

    } catch (error) {

        console.log(
            "Coupon email error:",
            error
        );

    }

};

module.exports = sendCouponGeneratedEmail;
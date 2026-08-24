const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {

    const { data, error } = await resend.emails.send({

       from: "Org-Khana <noreply@adishbabukarki.com.np>",

        to: [to],

        subject,

        html

    });

    if (error) {

        console.log("Resend Email Error:", error);

        throw new Error(error.message);

    }

    console.log("Email sent successfully:", data);

    return data;
};

module.exports = sendEmail;
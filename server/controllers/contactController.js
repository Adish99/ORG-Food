const Contact = require("../models/Contact");

const createContactController = async (req, res) => {

    try {

        const {

            name,

            email,

            subject,

            message

        } = req.body;

        const contact = await Contact.create({

            name,

            email,

            subject,

            message

        });

        return res.status(201).json({

            message: "Message sent successfully.",

            contact

        });

    } catch (error) {

        console.log("Create Contact Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    createContactController

};
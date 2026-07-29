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

const getAllContactController = async (req, res) => {

    try {

        const contacts = await Contact.find()

            .sort({ createdAt: -1 });

        return res.status(200).json({

            message: "Messages fetched successfully.",

            contacts

        });

    } catch (error) {

        console.log("Get Contact Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

const updateContactStatusController = async (req, res) => {

    try {

        const { id } = req.params;

        const contact = await Contact.findById(id);

        if (!contact) {

            return res.status(404).json({

                message: "Message not found."

            });

        }

        contact.status = "Read";

        await contact.save();

        return res.status(200).json({

            message: "Message marked as read.",

            contact

        });

    } catch (error) {

        console.log("Update Contact Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

const deleteContactController = async (req, res) => {

    try {

        const { id } = req.params;

        const contact = await Contact.findById(id);

        if (!contact) {

            return res.status(404).json({

                message: "Message not found."

            });

        }

        await Contact.findByIdAndDelete(id);

        return res.status(200).json({

            message: "Message deleted successfully."

        });

    } catch (error) {

        console.log("Delete Contact Error:", error);

        return res.status(500).json({

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    createContactController,
    getAllContactController,
    updateContactStatusController,
    deleteContactController

};
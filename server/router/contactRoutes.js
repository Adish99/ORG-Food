const express = require("express");

const {

    createContactController

} = require("../controllers/contactController");

const router = express.Router();

router.post("/", createContactController);

module.exports = router;
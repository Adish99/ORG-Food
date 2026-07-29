const express = require("express");
const authMiddleware=require("../middleware/authMiddleware");
const adminMiddleware=require("../middleware/adminMiddleware");

const {

    createContactController,
    getAllContactController,
    updateContactStatusController,
    deleteContactController

} = require("../controllers/contactController");

const router = express.Router();
//Customer
router.route("/").post(createContactController);

//Admin
router.route("/admin").get(authMiddleware,adminMiddleware, getAllContactController);
router.route("/admin/:id").put(authMiddleware,adminMiddleware,updateContactStatusController);
router.route("/admin/:id").delete(authMiddleware,adminMiddleware,deleteContactController);


module.exports = router;
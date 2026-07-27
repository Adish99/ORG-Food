const express=require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardStatsController } = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const router=express.Router();

//Routes
router.route("/admin/dashboard").get( authMiddleware,adminMiddleware,getDashboardStatsController);

module.exports=router;
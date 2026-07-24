const express=require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getDashboardStatsController } = require("../controllers/adminController");
const router=express.Router();

//Routes
router.route("/admin/dashboard").get(authMiddleware, getDashboardStatsController);

module.exports=router;
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.get("/users", adminController.getUsers);
router.get("/departments", adminController.getDepartments);
router.post("/departments", adminController.createDepartment);
router.post("/officials", adminController.registerOfficial);

module.exports = router;

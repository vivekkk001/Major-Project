const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.post("/login", adminController.adminLogin);       // ✅ Must be defined
router.get("/users", adminController.getUsers);          // ✅ Must be defined
router.get("/departments", adminController.getDepartments);
router.post("/departments", adminController.createDepartment);
router.post("/officials", adminController.registerOfficial);

module.exports = router;

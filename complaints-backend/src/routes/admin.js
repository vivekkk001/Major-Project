const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin");

router.post("/login", adminController.adminLogin);             // Admin login
router.get("/citizens", adminController.getCitizens);          // Get citizens
router.put("/citizens/:email", adminController.updateCitizen); // Update citizen
router.delete("/citizens/:email", adminController.deleteCitizen); // Delete citizen

router.get("/all-complaints", adminController.getAllComplaints); // Get complaints
router.put("/complaints/:id", adminController.updateComplaint);  // Update complaint
router.delete("/complaints/:id", adminController.deleteComplaint);

module.exports = router;

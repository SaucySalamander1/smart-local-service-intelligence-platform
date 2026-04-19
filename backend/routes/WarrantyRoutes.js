const express = require("express");
const router = express.Router();

const {
  createWarranty,
  getWarranty
} = require("../controllers/warrantyController");

// CREATE
router.post("/", createWarranty);

// GET
router.get("/", getWarranty);

module.exports = router;


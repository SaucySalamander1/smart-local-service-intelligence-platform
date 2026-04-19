const express = require("express");
const router = express.Router();

router.post("/estimate", (req, res) => {
  const { service, distance, urgency, visitType } = req.body;

  let base = service === "Cleaning" ? 500 : 800;

  let distanceCost = distance * 20;
  let urgencyCost = urgency === "urgent" ? 200 : 0;
  let visitCost = visitType === "home" ? 100 : 0;

  let total = base + distanceCost + urgencyCost + visitCost;

  res.json({ total });
});

module.exports = router;
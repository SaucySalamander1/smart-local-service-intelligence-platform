const express = require('express');
const router = express.Router();

// -------- FEATURE 1: COST ESTIMATION --------
router.post('/estimate', (req, res) => {
    const { service, urgency } = req.body;

    const base_price = {
        plumbing: 500,
        electrical: 700,
        ac: 1000
    };

    const urgency_multiplier = {
        normal: 1,
        urgent: 1.5,
        emergency: 2
    };

    const cost = base_price[service] * urgency_multiplier[urgency];

    res.json({ estimated_cost: cost });
});


// -------- FEATURE 2: COST BREAKDOWN --------
router.post('/breakdown', (req, res) => {
    const { service, urgency, extraParts } = req.body;

    let labor = 0;
    let parts = 0;

    // service base cost
    if (service === "plumbing") labor = 500;
    if (service === "electrical") labor = 700;
    if (service === "ac") labor = 1000;

    // urgency multiplier
    let urgencyCharge = 0;
    if (urgency === "urgent") urgencyCharge = 150;
    if (urgency === "emergency") urgencyCharge = 300;

    // extra parts (user option)
    parts = extraParts ? 200 : 0;

    const total = labor + parts + urgencyCharge;

    res.json({
        labor,
        parts,
        urgency: urgencyCharge,
        total
    });
});


// -------- FEATURE 3: REVIEW SYSTEM --------
let reviews = [];

router.post('/review', (req, res) => {
    reviews.push(req.body);
    res.json({ message: "Review added" });
});

router.get('/reviews', (req, res) => {
    res.json(reviews);
});

module.exports = router;
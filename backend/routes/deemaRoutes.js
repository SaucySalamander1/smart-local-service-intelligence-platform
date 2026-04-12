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
    const { urgency } = req.body;

    let labor = 300;
    let parts = 200;
    let urgency_charge = 0;

    if (urgency === "urgent") urgency_charge = 150;
    if (urgency === "emergency") urgency_charge = 300;

    res.json({
        labor,
        parts,
        urgency: urgency_charge,
        total: labor + parts + urgency_charge
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
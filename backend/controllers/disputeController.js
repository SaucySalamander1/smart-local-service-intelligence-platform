const Dispute = require("../models/Dispute");
const { state } = require("../config/db");

const disputeCache = [];

exports.createDispute = async (req, res) => {
  const { serviceId, type, description, expectedResolution, amount } = req.body;
  const evidence = req.file ? `/uploads/disputes/${req.file.filename}` : req.body.evidence || null;
  const disputeData = {
    serviceId,
    type,
    description,
    expectedResolution,
    amount: amount ? Number(amount) : 0,
    evidence,
    timeline: [{ status: "Submitted", date: new Date().toISOString() }],
    status: "Submitted",
    providerNotes: "",
    adminNotes: "",
  };

  if (state.connected) {
    try {
      const dispute = await Dispute.create(disputeData);
      return res.json(dispute);
    } catch (err) {
      console.error("CREATE DISPUTE DB ERROR:", err.message);
    }
  }

  const fallbackDispute = {
    id: `local-${Date.now()}`,
    ...disputeData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  disputeCache.unshift(fallbackDispute);
  res.json(fallbackDispute);
};

exports.getDisputes = async (req, res) => {
  if (state.connected) {
    try {
      const data = await Dispute.find().sort({ createdAt: -1 });
      return res.json(data);
    } catch (err) {
      console.error("GET DISPUTES DB ERROR:", err.message);
    }
  }

  console.warn("Returning in-memory dispute fallback data");
  res.json(disputeCache);
};

exports.getDisputeById = async (req, res) => {
  if (state.connected) {
    try {
      const dispute = await Dispute.findById(req.params.id);
      if (!dispute) {
        return res.status(404).json({ error: "Dispute not found" });
      }
      return res.json(dispute);
    } catch (err) {
      console.error("GET DISPUTE DB ERROR:", err.message);
    }
  }

  const dispute = disputeCache.find((d) => d.id === req.params.id || d._id === req.params.id);
  if (!dispute) {
    return res.status(404).json({ error: "Dispute not found" });
  }
  res.json(dispute);
};

exports.updateDisputeStatus = async (req, res) => {
  const { status, adminNotes, providerNotes } = req.body;

  if (state.connected) {
    try {
      const dispute = await Dispute.findById(req.params.id);
      if (!dispute) {
        return res.status(404).json({ error: "Dispute not found" });
      }

      if (status) dispute.status = status;
      if (adminNotes) dispute.adminNotes = adminNotes;
      if (providerNotes) dispute.providerNotes = providerNotes;

      dispute.timeline.push({
        status: dispute.status,
        date: new Date().toISOString(),
        note: adminNotes || providerNotes || "",
      });

      await dispute.save();
      return res.json(dispute);
    } catch (err) {
      console.error("UPDATE DISPUTE DB ERROR:", err.message);
    }
  }

  const dispute = disputeCache.find((d) => d.id === req.params.id || d._id === req.params.id);
  if (!dispute) {
    return res.status(404).json({ error: "Dispute not found" });
  }

  if (status) dispute.status = status;
  if (adminNotes) dispute.adminNotes = adminNotes;
  if (providerNotes) dispute.providerNotes = providerNotes;

  dispute.timeline.push({
    status: dispute.status,
    date: new Date().toISOString(),
    note: adminNotes || providerNotes || "",
  });

  dispute.updatedAt = new Date().toISOString();
  res.json(dispute);
};
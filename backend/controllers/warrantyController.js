const Warranty = require("../models/Warranty");
const { state } = require("../config/db");

const warrantyCache = [];

exports.createWarranty = async (req, res) => {
  const { serviceId, warrantyType, coverageBasis, provider, duration, coveredIssues, exclusions, expiry, startDate } = req.body;
  const warrantyData = {
    serviceId,
    warrantyType,
    coverageBasis,
    provider,
    duration,
    coveredIssues,
    exclusions,
    startDate,
    expiry,
    status: new Date(expiry) > new Date() ? "Active" : "Expired",
  };

  if (state.connected) {
    try {
      const warranty = await Warranty.create(warrantyData);
      return res.json(warranty);
    } catch (err) {
      console.error("CREATE WARRANTY DB ERROR:", err.message);
    }
  }

  const fallbackWarranty = {
    _id: `local-${Date.now()}`,
    ...warrantyData,
    claimCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  warrantyCache.unshift(fallbackWarranty);
  res.json(fallbackWarranty);
};

exports.getWarranty = async (req, res) => {
  if (state.connected) {
    try {
      console.log("GET WARRANTY HIT");
      const data = await Warranty.find().sort({ createdAt: -1 });
      console.log("DATA:", data);
      return res.json(data);
    } catch (err) {
      console.error("GET WARRANTY DB ERROR:", err.message);
    }
  }

  console.warn("Returning in-memory warranty fallback data");
  res.json(warrantyCache);
};

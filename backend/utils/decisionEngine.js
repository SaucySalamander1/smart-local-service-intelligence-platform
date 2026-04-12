const getThreatLevel = (score) => {
  if (score >= 8) return "HIGH";
  if (score >= 4) return "MEDIUM";
  return "LOW";
};

const buildResponse = (categoryData, threatLevel) => {
  return {
    threatLevel,
    solutions: categoryData.solutions[threatLevel.toLowerCase()]
  };
};

module.exports = {
  getThreatLevel,
  buildResponse
};
const riskSignals = {
  plumbing: {
    keywords: {
      leak: { signal: "continuous", weight: 2 },
      dripping: { signal: "continuous", weight: 1 },
      burst: { signal: "pressure", weight: 5 },
      flooding: { signal: "volume", weight: 5 },
      overflow: { signal: "volume", weight: 4 },
      clog: { signal: "blockage", weight: 2 },
      slow: { signal: "blockage", weight: 1 },
      smell: { signal: "contamination", weight: 3 },
      dirty: { signal: "contamination", weight: 2 },
      pipe: { signal: "pipe_damage", weight: 2 },
      tap: { signal: "fixture_issue", weight: 1 },
      sink: { signal: "fixture_issue", weight: 1 }
    }
  },

  electrical: {
    keywords: {
      spark: { signal: "electric", weight: 5 },
      burning: { signal: "heat", weight: 5 },
      smell: { signal: "heat", weight: 4 },
      shock: { signal: "electric", weight: 5 },
      flicker: { signal: "instability", weight: 2 },
      short: { signal: "electric", weight: 4 },
      wire: { signal: "exposed", weight: 3 },
      switch: { signal: "contact_issue", weight: 2 },
      socket: { signal: "contact_issue", weight: 2 },
      power: { signal: "instability", weight: 2 }
    }
  },

  gas: {
    keywords: {
      smell: { signal: "gas", weight: 5 },
      leak: { signal: "gas", weight: 5 },
      hissing: { signal: "pressure", weight: 5 },
      dizziness: { signal: "toxic", weight: 5 },
      headache: { signal: "toxic", weight: 4 }
    }
  },

  structural: {
    keywords: {
      crack: { signal: "damage", weight: 3 },
      collapse: { signal: "failure", weight: 5 },
      bending: { signal: "stress", weight: 3 },
      loose: { signal: "instability", weight: 2 },
      wall: { signal: "structure", weight: 2 },
      ceiling: { signal: "structure", weight: 2 }
    }
  },

  appliance: {
    keywords: {
      noise: { signal: "mechanical", weight: 2 },
      vibration: { signal: "mechanical", weight: 3 },
      overheating: { signal: "heat", weight: 5 },
      notworking: { signal: "failure", weight: 3 },
      fridge: { signal: "appliance", weight: 2 },
      fan: { signal: "appliance", weight: 2 }
    }
  }
};

module.exports = riskSignals;
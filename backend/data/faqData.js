// backend/data/faqData.js

const faqData = {
  electrical: {
    keywords: [
      "fan", "switch", "power", "electric", "spark", "light", "socket", 
      "wire", "short", "breaker", "circuit", "lamp", "charger", "appliance"
    ],
    faqs: [
      { question: "Is there a burning smell?", impact: { threat: 3, confidence: 10 } },
      { question: "Is the device completely not working?", impact: { threat: 2, confidence: 8 } },
      { question: "Did the power suddenly go off?", impact: { threat: 2, confidence: 6 } },
      { question: "Are there sparks or smoke from the socket?", impact: { threat: 3, confidence: 10 } },
      { question: "Has the breaker tripped recently?", impact: { threat: 2, confidence: 7 } },
      { question: "Are wires exposed or frayed?", impact: { threat: 3, confidence: 9 } },
      { question: "Is the appliance overheating?", impact: { threat: 3, confidence: 9 } },
      { question: "Are lights flickering or dimming?", impact: { threat: 2, confidence: 7 } }
    ],
    solutions: {
      low: ["Check power connection", "Check switch", "Replace fuse if needed", "Ensure plugs are secure"],
      medium: ["Inspect wiring carefully", "Call a certified electrician for inspection", "Avoid DIY for complex wiring"],
      high: ["Turn off main power immediately", "Evacuate area if necessary", "Call electrician urgently", "Keep away from water"]
    },
    precautions: [
      "Never touch exposed wires",
      "Turn off main power before inspections",
      "Keep water away from electrical points",
      "Do not overload sockets"
    ]
  },

  plumbing: {
    keywords: [
      "water", "leak", "pipe", "tap", "drain", "flood", "clog", 
      "sink", "toilet", "valve", "faucet", "sewage", "overflow"
    ],
    faqs: [
      { question: "Is water leaking continuously?", impact: { threat: 3, confidence: 10 } },
      { question: "Is the pipe broken?", impact: { threat: 2, confidence: 8 } },
      { question: "Is water backing up in drains?", impact: { threat: 2, confidence: 7 } },
      { question: "Is the leak near electrical appliances?", impact: { threat: 3, confidence: 10 } },
      { question: "Is the toilet overflowing?", impact: { threat: 2, confidence: 8 } },
      { question: "Is water pressure too low?", impact: { threat: 1, confidence: 6 } },
      { question: "Are there unusual odors from drains?", impact: { threat: 2, confidence: 7 } }
    ],
    solutions: {
      low: ["Tighten tap", "Use seal tape", "Check washers", "Clear minor clogs"],
      medium: ["Replace pipe section", "Unclog drain carefully", "Inspect for leaks under sink"],
      high: ["Shut off water supply", "Call plumber immediately", "Avoid electrical contact", "Evacuate if flooding"]
    },
    precautions: [
      "Do not touch water near electrical appliances",
      "Shut off main water if major leak",
      "Wear gloves when handling sewage or contaminated water",
      "Ensure proper drainage to prevent flooding"
    ]
  },

  appliance: {
    keywords: [
      "fridge", "oven", "ac", "washing machine", "microwave", "heater", 
      "dryer", "dishwasher", "fan", "stove", "iron", "blender"
    ],
    faqs: [
      { question: "Is the appliance not turning on?", impact: { threat: 2, confidence: 8 } },
      { question: "Is there unusual noise or smell?", impact: { threat: 2, confidence: 8 } },
      { question: "Is the appliance leaking water or fluid?", impact: { threat: 3, confidence: 10 } },
      { question: "Has the appliance been overheating?", impact: { threat: 3, confidence: 9 } },
      { question: "Are there error lights or codes?", impact: { threat: 2, confidence: 7 } },
      { question: "Has the appliance tripped the breaker?", impact: { threat: 3, confidence: 9 } }
    ],
    solutions: {
      low: ["Check power supply", "Check fuse or plug", "Ensure appliance is on stable surface"],
      medium: ["Reset appliance", "Clean filters or vents", "Check manual for troubleshooting steps"],
      high: ["Call certified technician", "Unplug appliance immediately if unsafe", "Do not attempt complex repairs yourself"]
    },
    precautions: [
      "Unplug appliance before maintenance",
      "Keep water away from electrical parts",
      "Do not insert hands into moving parts",
      "Do not overload sockets or circuits"
    ]
  },

  general: {
    keywords: ["broken", "not working", "problem", "issue", "help", "damage", "failure", "malfunction"],
    faqs: [
      { question: "Can you describe the issue more clearly?", impact: { threat: 1, confidence: 5 } },
      { question: "Has this happened before?", impact: { threat: 1, confidence: 5 } },
      { question: "Are there any immediate dangers?", impact: { threat: 2, confidence: 7 } },
      { question: "Is anyone affected or injured?", impact: { threat: 3, confidence: 9 } }
    ],
    solutions: {
      low: ["Try basic troubleshooting", "Check manuals or instructions", "Observe problem carefully"],
      medium: ["Seek professional help if uncertain", "Take necessary precautions"],
      high: ["Contact professional immediately", "Avoid risk", "Evacuate if necessary"]
    },
    precautions: [
      "Do not ignore warning signs",
      "Avoid DIY if unsure",
      "Keep emergency numbers handy",
      "Ensure safe environment before troubleshooting"
    ]
  },

  dailyLife: {
    keywords: [
      "internet", "wifi", "network", "computer", "phone", "door", "lock", 
      "key", "stove", "gas", "cooking", "gas leak", "appliance", "remote", "heating"
    ],
    faqs: [
      { question: "Is the device connected to power?", impact: { threat: 1, confidence: 5 } },
      { question: "Is the network stable?", impact: { threat: 1, confidence: 5 } },
      { question: "Is there a gas smell near stove?", impact: { threat: 3, confidence: 10 } },
      { question: "Is the door lock jammed?", impact: { threat: 2, confidence: 7 } },
      { question: "Is the device showing error messages?", impact: { threat: 2, confidence: 7 } },
      { question: "Are there connectivity drops frequently?", impact: { threat: 1, confidence: 6 } }
    ],
    solutions: {
      low: ["Restart device", "Check cables and plugs", "Ensure doors/windows operate smoothly"],
      medium: ["Reset device settings", "Replace faulty parts if possible", "Check gas connections"],
      high: ["Call technician", "Evacuate if gas leak", "Do not attempt unsafe fixes", "Call emergency services if needed"]
    },
    precautions: [
      "Turn off gas if leak suspected",
      "Do not force jammed locks",
      "Keep devices away from water",
      "Avoid DIY with gas/electric issues"
    ]
  },

  safety: {
    keywords: [
      "fire", "smoke", "flood", "injury", "cut", "burn", "accident", 
      "collapse", "hazard", "danger", "chemical"
    ],
    faqs: [
      { question: "Is anyone injured?", impact: { threat: 3, confidence: 10 } },
      { question: "Is fire or smoke present?", impact: { threat: 3, confidence: 10 } },
      { question: "Is there a risk of flood or water damage?", impact: { threat: 2, confidence: 8 } },
      { question: "Are hazardous chemicals involved?", impact: { threat: 3, confidence: 10 } },
      { question: "Is structural damage visible?", impact: { threat: 3, confidence: 10 } }
    ],
    solutions: {
      low: ["Take basic precautions", "Stay alert", "Observe surroundings"],
      medium: ["Call local emergency support", "Evacuate if needed", "Secure area"],
      high: ["Call emergency services immediately", "Evacuate immediately", "Do not touch hazards", "Assist injured safely"]
    },
    precautions: [
      "Keep calm and avoid panic",
      "Evacuate unsafe areas quickly",
      "Avoid direct contact with fire, chemicals, or water hazards",
      "Have first aid ready"
    ]
  }
};

module.exports = faqData;
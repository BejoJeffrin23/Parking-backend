const mongoose = require("mongoose");

const privacyPolicySchema = new mongoose.Schema({
  details :{
    type: String
  },
  published: {
    type: Boolean,
    default: true,
  },
  createdBy: String,
  updatedBy: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
  },
});

const PrivacyPolicy = mongoose.model("PrivacyPolicy", privacyPolicySchema);

module.exports = PrivacyPolicy;

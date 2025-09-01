const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: String,
  email: String,
  education: String,
  skills: [String],
  projects: [
    {
      title: String,
      description: String,
      link: String,
    }
  ],
  work: [
    {
      company: String,
      role: String,
      duration: String,
    }
  ],
  links: {
    github: String,
    linkedin: String,
    portfolio: String,
  }
});

module.exports = mongoose.model("Profile", profileSchema);

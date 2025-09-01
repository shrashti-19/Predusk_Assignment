const express = require("express");
const Profile = require("../model/Profile");
const router = express.Router();

// Get projects by skill
router.get("/projects", async (req, res) => {
  try {
    const { skill } = req.query;
    if (!skill) return res.status(400).json({ error: "Skill is required" });

    const profiles = await Profile.find({ skills: { $regex: skill, $options: "i" } });
    const projects = profiles.flatMap(profile => profile.projects);

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get top skills (frequency across profiles)
router.get("/skills/top", async (req, res) => {
  try {
    const profiles = await Profile.find();
    const skillCount = {};

    profiles.forEach(p => {
      p.skills.forEach(skill => {
        skillCount[skill] = (skillCount[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillCount)
      .sort((a, b) => b[1] - a[1])
      .map(([skill, count]) => ({ skill, count }));

    res.json(topSkills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search profile by keyword
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query param q is required" });

    const profiles = await Profile.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { skills: { $regex: q, $options: "i" } },
        { "projects.title": { $regex: q, $options: "i" } },
        { "projects.description": { $regex: q, $options: "i" } }
      ]
    });

    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

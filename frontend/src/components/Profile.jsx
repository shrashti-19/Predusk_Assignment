import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Profile.css";

const API = "http://localhost:5000/api"; // change later when backend is deployed

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchSkill, setSearchSkill] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [topSkills, setTopSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [skillsError, setSkillsError] = useState(null);

  // Load first profile
  useEffect(() => {
    axios.get(`${API}/profiles`)
      .then(res => {
        setProfile(res.data[0]); // get first profile
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load profile data");
        setLoading(false);
      });
  }, []);

  // Load top skills
  useEffect(() => {
    const fetchTopSkills = async () => {
      setLoadingSkills(true);
      try {
        const response = await axios.get(`${API}/query/skills/top`);
        setTopSkills(response.data);
      } catch (err) {
        console.error(err);
        setSkillsError("Failed to load top skills");
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchTopSkills();
  }, []);

  // Search projects by skill
  const handleSearchProjects = async (e) => {
    e.preventDefault();
    if (!searchSkill.trim()) return;

    setSearching(true);
    setSearchError(null);
    
    try {
      const response = await axios.get(`${API}/query/projects?skill=${encodeURIComponent(searchSkill)}`);
      setSearchResults(response.data);
    } catch (err) {
      console.error(err);
      setSearchError("Failed to search projects");
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchSkill("");
    setSearchResults([]);
    setSearchError(null);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div style={{ textAlign: "center", color: "#ff6b6b", fontSize: "1.2rem" }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>My Profile</h1>

      {/* Search Projects Section - Moved to Top */}
      <div className="search-section">
        <h3>Search Projects by Skill</h3>
        <form onSubmit={handleSearchProjects} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              value={searchSkill}
              onChange={(e) => setSearchSkill(e.target.value)}
              placeholder="Enter a skill (e.g., React, Node.js, Python...)"
              className="search-input"
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={searching || !searchSkill.trim()}
            >
              {searching ? "Searching..." : "Search"}
            </button>
            {searchSkill && (
              <button 
                type="button" 
                onClick={clearSearch}
                className="clear-button"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {searchError && (
          <div className="search-error">
            {searchError}
          </div>
        )}

        {searchResults.length > 0 && (
          <div className="search-results">
            <h4>Search Results ({searchResults.length} projects found)</h4>
            <div className="projects-grid">
              {searchResults.map((project, index) => (
                <div key={index} className="project-card search-result-card">
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  {project.skills && (
                    <div className="project-skills">
                      {project.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="project-link"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {searchSkill && searchResults.length === 0 && !searching && !searchError && (
          <div className="no-results">
            No projects found for skill "{searchSkill}"
          </div>
        )}
      </div>

      {/* Top Skills Section */}
      <div className="top-skills-section">
        <h3>Top Skills Across All Projects</h3>
        
        {loadingSkills && (
          <div className="skills-loading">Loading top skills...</div>
        )}
        
        {skillsError && (
          <div className="skills-error">{skillsError}</div>
        )}
        
        {topSkills.length > 0 && (
          <div className="top-skills-container">
            {topSkills.map((skillData, index) => (
              <div key={index} className="top-skill-item">
                <div className="skill-name">{skillData.skill}</div>
                <div className="skill-count">{skillData.count} projects</div>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    style={{ 
                      width: `${(skillData.count / Math.max(...topSkills.map(s => s.count))) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Section - Centered */}
      {profile && (
        <div className="profile-section">
          <div className="profile-info">
            <p><span>Name:</span> {profile.name}</p>
            <p><span>Email:</span> {profile.email}</p>
            <p><span>Education:</span> {profile.education}</p>
            <p>
              <span>Skills:</span>
              <div className="skills-container">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </p>
          </div>

          <div className="projects">
            <h3>My Projects</h3>
            <div className="projects-grid">
              {profile.projects.map((project, index) => (
                <div key={index} className="project-card">
                  <h4>{project.title}</h4>
                  <p>{project.description}</p>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="project-link"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
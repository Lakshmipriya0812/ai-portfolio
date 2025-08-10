import express from 'express';
import { 
  getPortfolioData, 
  getProjectsByTechnology, 
  getSkillsByCategory, 
  getExperienceByCompany, 
  searchPortfolio 
} from '../services/portfolioData.js';

const router = express.Router();

// GET /api/portfolio - Get all portfolio data
router.get('/', async (req, res) => {
  try {
    const data = getPortfolioData();
    
    res.json({
      success: true,
      data: {
        profile: data.profile,
        projects: data.projects,
        skills: data.skills,
        experience: data.experience
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching portfolio data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch portfolio data',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/portfolio/profile - Get profile information
router.get('/profile', async (req, res) => {
  try {
    const data = getPortfolioData();
    
    res.json({
      success: true,
      data: data.profile,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch profile',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/portfolio/projects - Get all projects
router.get('/projects', async (req, res) => {
  try {
    const { technology, limit, category } = req.query;
    let projects = getPortfolioData().projects;
    
    // Apply filters if provided
    if (technology) {
      projects = getProjectsByTechnology(technology);
    }
    
    if (category) {
      projects = projects.filter(p => 
        p.description.toLowerCase().includes(category.toLowerCase())
      );
    }
    
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum)) {
        projects = projects.slice(0, limitNum);
      }
    }
    
    res.json({
      success: true,
      data: projects,
      count: projects.length,
      filters: { technology, limit, category },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch projects',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/portfolio/projects/:id - Get specific project
router.get('/projects/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const projects = getPortfolioData().projects;
    const project = projects.find(p => p.id === id);
    
    if (!project) {
      return res.status(404).json({
        error: 'Project not found',
        message: `No project found with ID: ${id}`,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: project,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch project',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/portfolio/skills - Get all skills
router.get('/skills', async (req, res) => {
  try {
    const { category, proficiency } = req.query;
    let skills = getPortfolioData().skills;
    
    // Apply filters if provided
    if (category) {
      skills = getSkillsByCategory(category);
    }
    
    if (proficiency) {
      skills = skills.filter(s => s.proficiency === proficiency);
    }
    
    res.json({
      success: true,
      data: skills,
      count: skills.length,
      filters: { category, proficiency },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch skills',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/portfolio/experience - Get all experience
router.get('/experience', async (req, res) => {
  try {
    const { company, duration } = req.query;
    let experience = getPortfolioData().experience;
    
    // Apply filters if provided
    if (company) {
      experience = getExperienceByCompany(company);
    }
    
    if (duration) {
      experience = experience.filter(e => 
        e.duration.toLowerCase().includes(duration.toLowerCase())
      );
    }
    
    res.json({
      success: true,
      data: experience,
      count: experience.length,
      filters: { company, duration },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch experience',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/portfolio/search - Search across all portfolio data
router.get('/search', async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Search query is required',
        message: 'Please provide a search query using the "q" parameter',
        timestamp: new Date().toISOString()
      });
    }
    
    const results = searchPortfolio(query);
    
    res.json({
      success: true,
      query,
      results: {
        projects: results.projects,
        skills: results.skills,
        experience: results.experience
      },
      counts: {
        projects: results.projects.length,
        skills: results.skills.length,
        experience: results.experience.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error searching portfolio:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to search portfolio',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/portfolio/technologies - Get all unique technologies
router.get('/technologies', async (req, res) => {
  try {
    const data = getPortfolioData();
    const technologies = new Set();
    
    // Collect all technologies from projects
    data.projects.forEach(project => {
      project.technologies.forEach(tech => technologies.add(tech));
    });
    
    // Collect all skills
    data.skills.forEach(skill => {
      skill.skills.forEach(s => technologies.add(s));
    });
    
    // Collect all technologies from experience
    data.experience.forEach(exp => {
      exp.technologies.forEach(tech => technologies.add(tech));
    });
    
    const technologyList = Array.from(technologies).sort();
    
    res.json({
      success: true,
      data: technologyList,
      count: technologyList.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching technologies:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch technologies',
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/portfolio/stats - Get portfolio statistics
router.get('/stats', async (req, res) => {
  try {
    const data = getPortfolioData();
    
    // Calculate statistics
    const stats = {
      totalProjects: data.projects.length,
      totalSkills: data.skills.reduce((acc, skill) => acc + skill.skills.length, 0),
      totalExperience: data.experience.length,
      skillCategories: data.skills.length,
      technologies: new Set(),
      averageProjectTechnologies: 0
    };
    
    // Collect all technologies
    data.projects.forEach(project => {
      project.technologies.forEach(tech => stats.technologies.add(tech));
    });
    
    stats.technologies = Array.from(stats.technologies);
    stats.averageProjectTechnologies = data.projects.length > 0 
      ? (data.projects.reduce((acc, p) => acc + p.technologies.length, 0) / data.projects.length).toFixed(1)
      : 0;
    
    res.json({
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch stats',
      timestamp: new Date().toISOString()
    });
  }
});

export default router;

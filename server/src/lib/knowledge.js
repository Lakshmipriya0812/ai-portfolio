import { readFileSync } from 'fs';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_PATH = join(__dirname, '../../data/knowledge.json');

export function loadKnowledgeBase() {
  if (!existsSync(DATA_PATH)) {
    throw new Error(`Knowledge base not found at ${DATA_PATH}`);
  }
  const raw = readFileSync(DATA_PATH, 'utf-8');
  const json = JSON.parse(raw);
  validateSchema(json);
  return normalizeKnowledge(json);
}

function validateSchema(json) {
  const requiredTop = ['about', 'skills', 'projects', 'education', 'fun', 'experience', 'contact'];
  for (const key of requiredTop) {
    if (!(key in json)) {
      throw new Error(`knowledge.json missing required key: ${key}`);
    }
  }
}

function normalizeKnowledge(json) {
  const documents = [];

  if (json.about) {
    documents.push({
      id: 'about:main',
      type: 'about',
      title: 'About Me',
      content: typeof json.about === 'string' ? json.about : JSON.stringify(json.about),
      metadata: { section: 'about' }
    });
  }

  if (json.skills) {
    const { technicalSkills, softSkills, designTools, aiTools } = json.skills;
  
    // Technical skills categories
    if (technicalSkills?.categories) {
      documents.push({
        id: 'skills:technical',
        type: 'skills',
        title: technicalSkills.title || 'Technical Skills',
        content: '', // We'll skip flat content here
        metadata: { section: 'technicalSkills', categories: technicalSkills.categories }
      });
    }
  
    // Soft skills
    if (softSkills?.skills) {
      documents.push({
        id: 'skills:soft',
        type: 'skills',
        title: softSkills.title || 'Soft Skills',
        content: softSkills.skills.join(', '),
        metadata: { section: 'softSkills', skills: softSkills.skills }
      });
    }
  
    // Design tools
    if (designTools?.skills) {
      documents.push({
        id: 'skills:designTools',
        type: 'skills',
        title: designTools.title || 'Design Tools',
        content: designTools.skills.join(', '),
        metadata: { section: 'designTools', skills: designTools.skills }
      });
    }
  
    // AI tools
    if (aiTools?.skills) {
      documents.push({
        id: 'skills:aiTools',
        type: 'skills',
        title: aiTools.title || 'AI Tools',
        content: aiTools.skills.join(', '),
        metadata: { section: 'aiTools', skills: aiTools.skills }
      });
    }
  } else if (Array.isArray(json.skills)) {
    // fallback for old flat skills array
    documents.push({
      id: 'skills:all',
      type: 'skills',
      title: 'Technical Skills',
      content: json.skills.join(', '),
      metadata: { section: 'skills', skills: json.skills }
    });
  }
  
  

  if (Array.isArray(json.projects)) {
    for (let i = 0; i < json.projects.length; i++) {
      const p = json.projects[i];
      const content = [p.title, p.description, Array.isArray(p.technologies) ? p.technologies.join(', ') : '', p.role, p.outcomes]
        .filter(Boolean)
        .join('\n');
      documents.push({
        id: `project:${i}`,
        type: 'project',
        title: p.title || `Project ${i + 1}`,
        content: content || JSON.stringify(p),
        metadata: { section: 'projects', ...p }
      });
    }
  }

  if (Array.isArray(json.education)) {
    for (let i = 0; i < json.education.length; i++) {
      const e = json.education[i];
      const content = [e.institution, e.degree, e.field, e.period, e.highlights]
        .filter(Boolean)
        .join('\n');
      documents.push({
        id: `education:${i}`,
        type: 'education',
        title: e.institution || `Education ${i + 1}`,
        content: content || JSON.stringify(e),
        metadata: { section: 'education', ...e }
      });
    }
  }

  if (Array.isArray(json.experience)) {
    for (let i = 0; i < json.experience.length; i++) {
      const exp = json.experience[i];
      const content = [
        exp.role,
        exp.company,
        exp.period,
        exp.location,
        Array.isArray(exp.highlights) ? exp.highlights.join('\n') : ''
      ].filter(Boolean).join('\n');
  
      documents.push({
        id: `experience:${i}`,
        type: 'experience',
        title: exp.role || `Experience ${i + 1}`,
        content: content || JSON.stringify(exp),
        metadata: { section: 'experience', ...exp }
      });
    }
  }
  
  if (json.contact) {
    const contact = json.contact;
    const content = [
      contact.email,
      contact.phone,
      contact.LinkedIn,
      contact.GitHub
    ].filter(Boolean).join('\n');
  
    documents.push({
      id: `contact:main`,
      type: 'contact',
      title: 'Contact',
      content: content,
      metadata: { section: 'contact', ...contact }
    });
  }
  
  if (json.fun) {
    const funContent = typeof json.fun === 'string' ? json.fun : JSON.stringify(json.fun);
    documents.push({
      id: 'fun:main',
      type: 'fun',
      title: 'Fun & Hobbies',
      content: funContent,
      metadata: { section: 'fun' }
    });
  }
  

  return documents;
}

export function ensureStorageDirs(storageDir) {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }
}



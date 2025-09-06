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

  if (Array.isArray(json.skills)) {
    for (let i = 0; i < json.skills.length; i++) {
      const skill = json.skills[i];
      documents.push({
        id: `skill:${i}`,
        type: 'skill',
        title: skill?.name || 'Skill',
        content: typeof skill === 'string' ? skill : JSON.stringify(skill),
        metadata: { section: 'skills' }
      });
    }
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



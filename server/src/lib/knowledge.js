import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATA_PATH = join(__dirname, '../../data/knowledge.json');

// ------------------ Load Knowledge Base ------------------

export function loadKnowledgeBase() {
  if (!existsSync(DATA_PATH)) {
    throw new Error(`Knowledge base not found at ${DATA_PATH}`);
  }

  const raw = readFileSync(DATA_PATH, 'utf-8');
  const json = JSON.parse(raw);

  validateSchema(json);
  return normalizeKnowledge(json);
}

// ------------------ Validation ------------------

function validateSchema(json) {
  const requiredTop = ['about', 'skills', 'projects', 'education', 'fun', 'experience', 'contact'];
  for (const key of requiredTop) {
    if (!(key in json)) {
      throw new Error(`knowledge.json missing required key: ${key}`);
    }
  }
}

// ------------------ Normalize Knowledge ------------------

function normalizeKnowledge(json) {
  const documents = [];

  addAbout(documents, json.about);
  addSkills(documents, json.skills);
  addProjects(documents, json.projects);
  addExperience(documents, json.experience);
  addContact(documents, json.contact);
  addFun(documents, json.fun);

  return documents;
}

// ------------------ Section Handlers ------------------

function addAbout(documents, about) {
  if (!about) return;
  documents.push({
    id: 'about:main',
    type: 'about',
    title: 'About Me',
    content: typeof about === 'string' ? about : JSON.stringify(about),
    metadata: { section: 'about' }
  });
}

function addSkills(documents, skills) {
  if (!skills) return;

  const { technicalSkills, softSkills, designTools, aiTools } = skills;

  if (technicalSkills?.categories) {
    documents.push({
      id: 'skills:technical',
      type: 'skills',
      title: technicalSkills.title || 'Technical Skills',
      content: '',
      metadata: { section: 'technicalSkills', categories: technicalSkills.categories }
    });
  }

  if (softSkills?.skills) addFlatSkills(documents, 'soft', 'Soft Skills', softSkills.skills);
  if (designTools?.skills) addFlatSkills(documents, 'designTools', 'Design Tools', designTools.skills);
  if (aiTools?.skills) addFlatSkills(documents, 'aiTools', 'AI Tools', aiTools.skills);

  if (Array.isArray(skills) && skills.length) {
    addFlatSkills(documents, 'all', 'Skills', skills);
  }
}

function addFlatSkills(documents, idSuffix, title, skillsArray) {
  documents.push({
    id: `skills:${idSuffix}`,
    type: 'skills',
    title,
    content: skillsArray.join(', '),
    metadata: { section: idSuffix, skills: skillsArray }
  });
}

function addProjects(documents, projects) {
  if (!Array.isArray(projects)) return;
  projects.forEach((p, i) => {
    const content = [p.title, p.description, arrayToString(p.technologies), p.role, p.outcomes]
      .filter(Boolean).join('\n');

    documents.push({
      id: `project:${i}`,
      type: 'project',
      title: p.title || `Project ${i + 1}`,
      content: content || JSON.stringify(p),
      metadata: { section: 'projects', ...p }
    });
  });
}

function addExperience(documents, experience) {
  if (!Array.isArray(experience)) return;
  experience.forEach((exp, i) => {
    const content = [exp.role, exp.company, exp.period, exp.location, arrayToString(exp.highlights)]
      .filter(Boolean).join('\n');

    documents.push({
      id: `experience:${i}`,
      type: 'experience',
      title: exp.role || `Experience ${i + 1}`,
      content,
      metadata: {
        section: 'experience',
        role: exp.role || '',
        company: exp.company || '',
        period: exp.period || '',
        location: exp.location || '',
        highlights: Array.isArray(exp.highlights) ? exp.highlights : []
      }
    });
  });
}

function addContact(documents, contact) {
  if (!contact) return;
  const content = [contact.email, contact.phone, contact.LinkedIn, contact.GitHub].filter(Boolean).join('\n');

  documents.push({
    id: `contact:main`,
    type: 'contact',
    title: 'Contact',
    content,
    metadata: { section: 'contact', ...contact }
  });
}

function addFun(documents, fun) {
  if (!fun) return;
  const content = typeof fun === 'string' ? fun : JSON.stringify(fun);

  documents.push({
    id: 'fun:main',
    type: 'fun',
    title: 'Fun & Hobbies',
    content,
    metadata: { section: 'fun' }
  });
}

// ------------------ Helpers ------------------

function arrayToString(arr) {
  if (!arr) return '';
  return Array.isArray(arr) ? arr.join(', ') : String(arr);
}

// ------------------ Storage ------------------

export function ensureStorageDirs(storageDir) {
  if (!existsSync(storageDir)) {
    mkdirSync(storageDir, { recursive: true });
  }
}
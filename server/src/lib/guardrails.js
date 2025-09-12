export function enforceGuardrails(results, { minScore = 0.25 } = {}) {
  if (!results || results.length === 0) {
    return {
      allowed: false,
      reason: 'no_results',
      message: "I can answer questions about my portfolio (projects, skills, education, experience, fun, contact)."
    };
  }
  if (results[0].score < minScore) {
    return {
      allowed: false,
      reason: 'low_confidence',
      message: "I couldn't find a confident match in my portfolio for that. Try rephrasing?"
    };
  }
  return { allowed: true };
}

// ------------------ Compose Answers ------------------

export function composeAnswer(results) {
  const sections = {};

  // Group results by type
  for (const { doc } of results) {
    const type = doc.type || doc.metadata?.section || 'info';
    if (!sections[type]) sections[type] = [];
    sections[type].push(formatDocumentForDisplay(doc));
  }

  const output = [];
  for (const [type, docs] of Object.entries(sections)) {
    const header = type === 'experience' ? 'Experience\n\n' :
                   type === 'project' ? 'Projects\n\n' : '';
    output.push(header + docs.join('\n\n---\n\n'));
  }

  return output.join('\n\n');
}

// ------------------ Format Document for Display ------------------

function formatDocumentForDisplay(doc) {
  const type = doc.type || doc.metadata?.section;
  const meta = doc.metadata || {};
  const title = doc.title || 'Information';
  const content = doc.content || '';

  switch (type) {
    case 'project': {
      const name = meta.name || meta.title || title;
      const description = meta.description || parseContentDescription(content);
      const technologies = formatArray(meta.technologies);
      const highlights = Array.isArray(meta.highlights) ? meta.highlights : [];
      const github = meta.github;
      const demo = meta.demo || meta.demoVideo;

      const lines = [`Project: ${name}`];
      if (description) lines.push(description);
      if (technologies) lines.push(`Technologies: ${technologies}`);
      if (highlights.length) {
        lines.push('Highlights:');
        lines.push(...highlights.map(h => `  • ${h}`));
      }
      if (github) lines.push(`GitHub: ${github}`);
      if (demo) lines.push(`Demo: ${demo}`);

      return lines.join('\n');
    }

    case 'experience': {
      const role = meta.role || title;
      const company = meta.company || '';
      const period = meta.period || '';
      const highlights = Array.isArray(meta.highlights) ? meta.highlights : [];

      const lines = [`Experience: ${role}${company ? ` @ ${company}` : ''}${period ? ` (${period})` : ''}`];
      if (highlights.length) {
        lines.push('Highlights:');
        lines.push(...highlights.map(h => `  • ${h}`));
      }
      return lines.join('\n');
    }

    case 'education': {
      const institution = meta.institution || title;
      const degree = meta.degree ? `, ${meta.degree}` : '';
      const field = meta.field ? `, ${meta.field}` : '';
      const period = meta.period ? ` (${meta.period})` : '';
      return `🎓 Education: ${institution}${degree}${field}${period}`;
    }

    case 'contact': {
      const email = meta.email ? `Email: ${meta.email}` : '';
      const phone = meta.phone ? `Phone: ${meta.phone}` : '';
      const linkedin = meta.LinkedIn ? `LinkedIn: ${meta.LinkedIn}` : '';
      const github = meta.GitHub ? `GitHub: ${meta.GitHub}` : '';
      return ['Contact', email, phone, linkedin, github].filter(Boolean).join('\n');
    }

    case 'skill': {
      const name = meta.name || title;
      return `Skill: ${name}`;
    }

    case 'skills': {
      const skillsList = extractSkills(doc, meta);
      return `Skills:\n${skillsList.join(', ')}`;
    }

    case 'fun': {
      const bullets = content.split(/(?<=[.!?])\s+/).map(b => b.trim()).filter(Boolean);
      return `Fun & Hobbies\n${bullets.map(b => `  • ${b}`).join('\n')}`;
    }

    case 'about': {
      return `${title}\n${content}`;
    }

    default:
      return `${title}\n\n${content}`;
  }
}

// ------------------ Helpers ------------------

function parseContentDescription(content) {
  if (!content || typeof content !== 'string') return '';
  try {
    const parsed = JSON.parse(content);
    return parsed?.description || '';
  } catch (_) {
    return content;
  }
}

function formatArray(arr) {
  if (!arr) return '';
  if (Array.isArray(arr)) return arr.join(', ');
  if (typeof arr === 'string') return arr;
  return '';
}

function extractSkills(doc, meta) {
  if (Array.isArray(meta.categories)) {
    return meta.categories.flatMap(cat => cat.skills || []);
  }
  if (Array.isArray(meta.skills)) return meta.skills;

  if (typeof doc.content === 'string') {
    try {
      const parsed = JSON.parse(doc.content);
      if (Array.isArray(parsed?.skills)) return parsed.skills;
    } catch (_) {
      return doc.content.split(/\s*,\s*|\n+/).map(s => s.trim()).filter(Boolean);
    }
  }
  return [];
}

// ------------------ Structured Format ------------------

export function formatStructured(doc) {
  const type = doc.type || doc.metadata?.section || 'info';
  const meta = doc.metadata || {};
  const base = { type, title: doc.title || meta.title || '', source: meta.section || type };
  switch (type) {
    case 'project':
      return {
        ...base,
        name: meta.name || base.title || '',
        description: meta.description || '',
        technologies: Array.isArray(meta.technologies)
          ? meta.technologies
          : typeof meta.technologies === 'string'
            ? meta.technologies.split(/\s*,\s*/)
            : [],
        highlights: Array.isArray(meta.highlights) ? meta.highlights : [],
        github: meta.github || '',
        demo: meta.demo || meta.demoVideo || ''
      };
    case 'experience':
      return {
        ...base,
        role: meta.role || '',
        company: meta.company || '',
        period: meta.period || '',
        highlights: Array.isArray(meta.highlights) ? meta.highlights : []
      };
    case 'education':
      return {
        ...base,
        institution: meta.institution || '',
        degree: meta.degree || '',
        field: meta.field || '',
        period: meta.period || ''
      };
    case 'contact':
      return {
        ...base,
        email: meta.email || '',
        phone: meta.phone || '',
        linkedin: meta.LinkedIn || '',
        github: meta.GitHub || ''
      };

    case 'skill':
      return { ...base, name: meta.name || base.title || (typeof doc.content === 'string' ? doc.content : '') };

    case 'skills': {
      const skills = extractSkills(doc, meta);
      return { ...base, categories: meta.categories || [], skills };
    }

    default:
      return { ...base, text: doc.content || '' };
  }
}
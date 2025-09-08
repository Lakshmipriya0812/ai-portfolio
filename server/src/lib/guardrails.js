export function enforceGuardrails(results, { minScore = 0.35 } = {}) {
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

export function composeAnswer(results) {
  return results
    .map(({ doc }) => {
      const formatted = formatDocumentForDisplay(doc);
      const source = doc.metadata?.section || doc.type || 'info';
      return `${formatted}\n\n(source: ${source})`;
    })
    .join('\n\n---\n\n'); 
}

function formatDocumentForDisplay(doc) {
  const type = doc.type || (doc.metadata && doc.metadata.section);
  const meta = doc.metadata || {};
  const title = doc.title || 'Information';
  const content = doc.content || '';

  switch (type) {
    case 'project': {
      const name = meta.name || meta.title || title;
      const technologies = Array.isArray(meta.technologies)
        ? meta.technologies.join(', ')
        : (typeof meta.technologies === 'string' ? meta.technologies : '');
      const highlights = Array.isArray(meta.highlights) ? meta.highlights : [];
    

      const github = meta.github;
      const demo = meta.demo || meta.demoVideo;

      let description = meta.description;
      if (!description && typeof content === 'string') {
        try {
          const parsed = JSON.parse(content);
          if (parsed?.description) {
            description = parsed.description;
          }
        } catch (_) {}

      }
    
      const lines = [];
    
      lines.push(`🚀 Project: ${name}`);
      if (description) lines.push(description);
    
      if (technologies) lines.push(`💻 Technologies: ${technologies}`);
      if (highlights.length) {
        lines.push('✨ Highlights:');
        for (const h of highlights) lines.push(`  • ${h}`);
      }

      if (github) lines.push(`🔗 GitHub: ${github}`);
      if (demo) lines.push(`▶️ Demo: ${demo}`);

    
      return lines.filter(Boolean).join('\n');
    }

    case 'skill': {
      const name = meta.name || title;
      return `🛠 Skill: ${name}`;
    }

    case 'skills': {
      return `🛠 Skills:\n${content}`;
    }

    case 'education': {
      const institution = meta.institution || title;
      const degree = meta.degree ? `, ${meta.degree}` : '';
      const field = meta.field ? `, ${meta.field}` : '';
      const period = meta.period ? ` (${meta.period})` : '';
      return `🎓 Education: ${institution}${degree}${field}${period}`;
    }

    case 'experience': {
      const role = meta.role || title;
      const company = meta.company ? ` @ ${meta.company}` : '';
      const period = meta.period ? ` (${meta.period})` : '';
      const highlights = Array.isArray(meta.highlights) ? meta.highlights : [];
      const lines = [];

      lines.push(`💼 Experience: ${role}${company}${period}`);
      if (highlights.length) {
        lines.push('✨ Highlights:');
        for (const h of highlights) lines.push(`  • ${h}`);
      }

      return lines.join('\n');
    }

    case 'contact': {
      const email = meta.email ? `✉️ Email: ${meta.email}` : '';
      const phone = meta.phone ? `📞 Phone: ${meta.phone}` : '';
      const linkedin = meta.LinkedIn ? `🔗 LinkedIn: ${meta.LinkedIn}` : '';
      const github = meta.GitHub ? `🐙 GitHub: ${meta.GitHub}` : '';
      return ['📬 Contact', email, phone, linkedin, github].filter(Boolean).join('\n');
    }

    case 'about': {
      return `ℹ️ ${title}\n${content}`;
    }

    case 'fun': {
      const bullets = content.split(/(?<=[.!?])\s+/).map(b => b.trim()).filter(Boolean);
      return `🎉 Fun & Hobbies\n${bullets.map(b => `  • ${b}`).join('\n')}`;
    }

    default: {
      return `${title}\n\n${content}`;
    }
  }
}

export function formatStructured(doc) {
  const type = doc.type || (doc.metadata && doc.metadata.section) || 'info';
  const meta = doc.metadata || {};
  const base = { type, title: doc.title || meta.title || '', source: meta.section || type };
  switch (type) {
    case 'project':
      return {
        ...base,
        name: meta.name || base.title || '',
        description: meta.description || '',
        technologies: Array.isArray(meta.technologies) ? meta.technologies : (typeof meta.technologies === 'string' ? meta.technologies.split(/\s*,\s*/) : []),
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
    case 'skill': {
      const name = meta.name || base.title || (typeof doc.content === 'string' ? doc.content : '');
      return { ...base, name };
    }
    case 'skills': {
      let skills = [];
      if (Array.isArray(meta.skills)) skills = meta.skills;
      else if (typeof doc.content === 'string') {
        try {
          const parsed = JSON.parse(doc.content);
          if (Array.isArray(parsed?.skills)) skills = parsed.skills;
        } catch (_) {
          skills = doc.content.split(/\s*,\s*|\n+/).map(s => s.trim()).filter(Boolean);
        }
      }
      return { ...base, skills };
    }
    default:
      return { ...base, text: doc.content || '' };
  }
}

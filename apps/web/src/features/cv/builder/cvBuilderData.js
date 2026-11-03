export const sectionDefinitions = [
  { id: 'summary', label: 'Hakkımda' },
  { id: 'experience', label: 'Deneyim' },
  { id: 'education', label: 'Eğitim' },
  { id: 'projects', label: 'Projeler' },
  { id: 'certificates', label: 'Sertifikalar' },
];

export const templateDefinitions = [
  { id: 'sade', name: 'Sade', description: 'Tek sütunlu, klasik ve okunabilir' },
  { id: 'modern', name: 'Modern', description: 'Renkli başlıklar ve belirgin bölüm ayrımı' },
];

function text(value) {
  return value == null ? '' : String(value).trim();
}

function item(id, title, subtitle, startDate, endDate, description, link = '') {
  return { id, title: text(title), subtitle: text(subtitle), startDate: text(startDate), endDate: text(endDate), description: text(description), link: text(link) };
}

export function createCvDraft({ person, career, experiences, educations, projects, certificates }) {
  return {
    template: 'sade',
    fullName: [person.firstName, person.lastName].filter(Boolean).join(' '),
    title: text(career.title || career.targetTitle),
    email: text(person.email),
    phone: text(person.phone),
    location: text(person.location),
    linkedIn: text(career.linkedInUrl),
    gitHub: text(career.gitHubUrl),
    portfolio: text(career.portfolioUrl),
    summary: text(career.summary),
    sections: sectionDefinitions.map(({ id }) => ({ id, visible: true })),
    experience: experiences.map((record) => item(record.id, record.position, [record.company, record.location].filter(Boolean).join(' · '), record.startDate, record.endDate, record.description)),
    education: educations.map((record) => item(record.id, record.institution, [record.degree, record.fieldOfStudy].filter(Boolean).join(' · '), record.startDate, record.endDate, record.description)),
    projects: projects.map((record) => item(record.id, record.name, [record.role, ...(record.technologies || [])].filter(Boolean).join(' · '), record.startDate, record.endDate, record.description, record.projectUrl || record.codeUrl)),
    certificates: certificates.map((record) => item(record.id, record.name, record.issuer, record.issueDate, record.expiryDate, '', record.verificationUrl)),
  };
}

export function normalizeSavedDraft(saved, fallback) {
  const content = saved?.content;
  if (!content || typeof content !== 'object' || !Array.isArray(content.sections)) {
    return fallback;
  }
  const sectionIds = sectionDefinitions.map((section) => section.id);
  const savedSections = content.sections.filter((section) => sectionIds.includes(section.id));
  const missingSections = sectionIds.filter((id) => !savedSections.some((section) => section.id === id));
  return {
    ...fallback,
    ...content,
    template: templateDefinitions.some((template) => template.id === saved.template) ? saved.template : 'sade',
    sections: [...savedSections, ...missingSections.map((id) => ({ id, visible: true }))],
    experience: Array.isArray(content.experience) ? content.experience : fallback.experience,
    education: Array.isArray(content.education) ? content.education : fallback.education,
    projects: Array.isArray(content.projects) ? content.projects : fallback.projects,
    certificates: Array.isArray(content.certificates) ? content.certificates : fallback.certificates,
  };
}

export function formatCvDate(value) {
  if (!value) {
    return '';
  }
  const date = new Date(`${value.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(date);
}

export function formatCvPeriod(entry) {
  const start = formatCvDate(entry.startDate);
  const end = formatCvDate(entry.endDate);
  if (!start) {
    return end;
  }
  return `${start} – ${end || 'Devam ediyor'}`;
}

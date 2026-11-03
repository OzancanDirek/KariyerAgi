import { formatCvPeriod, sectionDefinitions } from './cvBuilderData.js';

function CvEntries({ entries }) {
  if (!entries.length) {
    return <p className="cv-empty">Bu bölüme henüz bilgi eklenmedi.</p>;
  }
  return <div className="cv-entry-list">{entries.map((entry) => <article className="cv-entry" key={entry.id}>
    <div className="cv-entry-heading"><strong>{entry.title || 'Başlık girilmedi'}</strong><span>{formatCvPeriod(entry)}</span></div>
    {entry.subtitle && <p className="cv-entry-subtitle">{entry.subtitle}</p>}
    {entry.description && <p className="cv-entry-description">{entry.description}</p>}
    {entry.link && <p className="cv-entry-link">{entry.link}</p>}
  </article>)}</div>;
}

export function CvDocument({ draft }) {
  const sections = Object.fromEntries(sectionDefinitions.map((section) => [section.id, section]));
  return <article id="cv-print-document" className={`cv-document cv-document--${draft.template}`} aria-label="CV önizlemesi">
    <header className="cv-document-header">
      <h1>{draft.fullName || 'Ad Soyad'}</h1>
      {draft.title && <p className="cv-document-title">{draft.title}</p>}
      <div className="cv-document-contact">{[draft.email, draft.phone, draft.location].filter(Boolean).map((value) => <span key={value}>{value}</span>)}</div>
      <div className="cv-document-links">{[draft.linkedIn, draft.gitHub, draft.portfolio].filter(Boolean).map((value) => <span key={value}>{value}</span>)}</div>
    </header>
    {draft.sections.filter((section) => section.visible).map(({ id }) => {
      if (id === 'summary' && !draft.summary) {
        return null;
      }
      const entries = id === 'summary' ? null : draft[id];
      if (entries && entries.length === 0) {
        return null;
      }
      return <section className="cv-document-section" key={id}>
        <h2>{sections[id].label}</h2>
        {id === 'summary' ? <p className="cv-entry-description">{draft.summary}</p> : <CvEntries entries={entries} />}
      </section>;
    })}
  </article>;
}

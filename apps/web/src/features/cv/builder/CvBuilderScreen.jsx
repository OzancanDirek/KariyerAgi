import { useEffect, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowUp, Eye, EyeOff, FileDown, FileText, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { profileApi } from '../../profile/api/profileApi.js';
import { careerProfileApi } from '../../profile/api/careerProfileApi.js';
import { experienceApi } from '../../profile/api/experienceApi.js';
import { educationApi } from '../../profile/api/educationApi.js';
import { projectApi } from '../../profile/api/projectApi.js';
import { certificateApi } from '../../profile/api/certificateApi.js';
import { cvDraftApi } from '../api/cvDraftApi.js';
import { CvDocument } from './CvDocument.jsx';
import { createCvDraft, normalizeSavedDraft, sectionDefinitions, templateDefinitions } from './cvBuilderData.js';
import './cvBuilder.css';

const inputClass = 'mt-1 w-full rounded-lg border border-[#D6DEE9] bg-white px-3 py-2.5 text-sm text-[#202938] outline-none focus:border-[#2F8F83] focus:ring-2 focus:ring-[#2F8F83]/15';

function Field({ label, value, onChange, multiline = false, type = 'text' }) {
  return <label className="block text-sm font-medium text-[#344054]">{label}{multiline
    ? <textarea className={`${inputClass} min-h-24 resize-y`} value={value || ''} onChange={(event) => onChange(event.target.value)} />
    : <input className={inputClass} value={value || ''} type={type} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function EntryEditor({ sectionId, entries, updateEntry, removeEntry, addEntry }) {
  return <div className="space-y-4">
    {entries.map((entry, index) => <div key={entry.id} className="rounded-xl border border-[#E3E7ED] bg-[#FAFBFC] p-4">
      <div className="mb-3 flex items-center justify-between gap-3"><span className="text-xs font-bold uppercase tracking-wide text-[#5276A7]">Kayıt {index + 1}</span><button type="button" onClick={() => removeEntry(sectionId, entry.id)} className="rounded-lg p-2 text-[#B42318] hover:bg-red-50" aria-label={`${entry.title || 'Kayıt'} CV'den kaldır`}><Trash2 size={17} /></button></div>
      <div className="grid gap-3 sm:grid-cols-2"><Field label={sectionId === 'experience' ? 'Pozisyon' : sectionId === 'education' ? 'Okul' : sectionId === 'projects' ? 'Proje adı' : 'Sertifika adı'} value={entry.title} onChange={(value) => updateEntry(sectionId, entry.id, 'title', value)} /><Field label={sectionId === 'experience' ? 'Şirket ve konum' : sectionId === 'education' ? 'Derece ve bölüm' : sectionId === 'projects' ? 'Rol ve teknolojiler' : 'Veren kurum'} value={entry.subtitle} onChange={(value) => updateEntry(sectionId, entry.id, 'subtitle', value)} /></div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label={sectionId === 'certificates' ? 'Veriliş tarihi' : 'Başlangıç tarihi'} type="date" value={entry.startDate} onChange={(value) => updateEntry(sectionId, entry.id, 'startDate', value)} /><Field label={sectionId === 'certificates' ? 'Geçerlilik tarihi' : 'Bitiş tarihi'} type="date" value={entry.endDate} onChange={(value) => updateEntry(sectionId, entry.id, 'endDate', value)} /></div>
      {sectionId !== 'certificates' && <div className="mt-3"><Field label="Açıklama" multiline value={entry.description} onChange={(value) => updateEntry(sectionId, entry.id, 'description', value)} /></div>}
      {(sectionId === 'projects' || sectionId === 'certificates') && <div className="mt-3"><Field label="Bağlantı" value={entry.link} onChange={(value) => updateEntry(sectionId, entry.id, 'link', value)} /></div>}
    </div>)}
    <button type="button" onClick={() => addEntry(sectionId)} className="inline-flex items-center gap-2 rounded-lg border border-[#CEDAE8] px-3 py-2 text-sm font-semibold text-[#243B64] hover:bg-[#F4F7FA]"><Plus size={16} />Yalnızca bu CV’ye kayıt ekle</button>
  </div>;
}

export function CvBuilderScreen({ runAuthenticated, onBack }) {
  const [draft, setDraft] = useState(null);
  const [original, setOriginal] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draftName, setDraftName] = useState('Yeni CV');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let active = true;
    runAuthenticated(async (token) => {
      const [person, career, experiences, educations, projects, certificates, saved] = await Promise.all([
        profileApi.getProfile(token), careerProfileApi.getCareerProfile(token), experienceApi.list(token),
        educationApi.list(token), projectApi.list(token), certificateApi.list(token), cvDraftApi.list(token),
      ]);
      return { person, career, experiences, educations, projects, certificates, saved };
    }).then((data) => {
      if (active) {
        setOriginal(data);
        const fallback = createCvDraft(data);
        setSavedDrafts(data.saved);
        if (data.saved.length > 0) {
          setDraft(normalizeSavedDraft(data.saved[0], fallback));
          setSelectedId(data.saved[0].id);
          setDraftName(data.saved[0].name);
        } else {
          setDraft(fallback);
        }
      }
    }).catch((failure) => {
      if (active) {
        setError(failure.message);
      }
    }).finally(() => {
      if (active) {
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [runAuthenticated]);

  function updateField(name, value) {
    setDirty(true);
    setSaveMessage('');
    setDraft((current) => ({ ...current, [name]: value }));
  }

  function updateEntry(sectionId, entryId, name, value) {
    setDirty(true);
    setSaveMessage('');
    setDraft((current) => ({ ...current, [sectionId]: current[sectionId].map((entry) => entry.id === entryId ? { ...entry, [name]: value } : entry) }));
  }

  function addEntry(sectionId) {
    setDirty(true);
    setSaveMessage('');
    const entry = { id: crypto.randomUUID(), title: '', subtitle: '', startDate: '', endDate: '', description: '', link: '' };
    setDraft((current) => ({ ...current, [sectionId]: [...current[sectionId], entry] }));
  }

  function removeEntry(sectionId, entryId) {
    setDirty(true);
    setSaveMessage('');
    setDraft((current) => ({ ...current, [sectionId]: current[sectionId].filter((entry) => entry.id !== entryId) }));
  }

  function toggleSection(id) {
    setDirty(true);
    setSaveMessage('');
    setDraft((current) => ({ ...current, sections: current.sections.map((section) => section.id === id ? { ...section, visible: !section.visible } : section) }));
  }

  function moveSection(index, direction) {
    const next = index + direction;
    if (next < 0 || next >= draft.sections.length) {
      return;
    }
    setDirty(true);
    setSaveMessage('');
    setDraft((current) => {
      const sections = [...current.sections];
      [sections[index], sections[next]] = [sections[next], sections[index]];
      return { ...current, sections };
    });
  }

  function selectDraft(id) {
    if (dirty && !window.confirm('Kaydedilmemiş değişiklikler kaybolacak. Devam edilsin mi?')) {
      return;
    }
    const saved = savedDrafts.find((item) => item.id === id);
    if (!saved) {
      return;
    }
    setDraft(normalizeSavedDraft(saved, createCvDraft(original)));
    setSelectedId(saved.id);
    setDraftName(saved.name);
    setDirty(false);
    setSaveMessage('');
  }

  function startNewDraft() {
    if (dirty && !window.confirm('Kaydedilmemiş değişiklikler kaybolacak. Yeni CV açılsın mı?')) {
      return;
    }
    setDraft(createCvDraft(original));
    setSelectedId(null);
    setDraftName('Yeni CV');
    setDirty(false);
    setSaveMessage('');
  }

  async function saveDraft() {
    if (!draftName.trim()) {
      setSaveMessage('CV için bir ad gir.');
      return;
    }
    setSaving(true);
    setSaveMessage('');
    try {
      const details = { name: draftName.trim(), template: draft.template, content: draft };
      const saved = await runAuthenticated((token) => selectedId
        ? cvDraftApi.update(token, selectedId, details)
        : cvDraftApi.create(token, details));
      setSavedDrafts((current) => [saved, ...current.filter((item) => item.id !== saved.id)]);
      setSelectedId(saved.id);
      setDraftName(saved.name);
      setDirty(false);
      setSaveMessage('CV taslağı kaydedildi.');
    } catch (failure) {
      setSaveMessage(failure.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteDraft() {
    if (!selectedId || !window.confirm('Bu CV taslağı silinsin mi? Profil bilgilerin etkilenmez.')) {
      return;
    }
    try {
      await runAuthenticated((token) => cvDraftApi.remove(token, selectedId));
      setSavedDrafts((current) => current.filter((item) => item.id !== selectedId));
      setDraft(createCvDraft(original));
      setSelectedId(null);
      setDraftName('Yeni CV');
      setDirty(false);
      setSaveMessage('CV taslağı silindi.');
    } catch (failure) {
      setSaveMessage(failure.message);
    }
  }

  if (loading) {
    return <main className="mx-auto max-w-7xl p-8 text-sm text-[#667085]">CV oluşturucu yükleniyor...</main>;
  }
  if (error) {
    return <main className="mx-auto max-w-7xl p-8"><p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p><button type="button" onClick={onBack} className="mt-4 text-sm font-semibold text-[#5276A7]">Profilime dön</button></main>;
  }
  if (!draft) {
    return null;
  }

  const sectionLabels = Object.fromEntries(sectionDefinitions.map((section) => [section.id, section.label]));
  return <main className="cv-builder mx-auto max-w-7xl px-5 py-8 text-[#202938] sm:px-8">
    <button type="button" onClick={onBack} className="cv-builder-back inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#5276A7] hover:bg-white"><ArrowLeft size={17} />Profilime dön</button>
    <div className="cv-builder-toolbar mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm">
      <div><span className="text-xs font-bold uppercase tracking-[0.14em] text-[#2F8F83]">Modül 03 · AI CV Merkezi</span><h1 className="mt-1 text-2xl font-bold text-[#243B64]">CV Oluşturucu</h1><p className="mt-2 text-sm text-[#667085]">Bilgilerin profilinden alındı. Buradaki düzenlemeler profil kayıtlarını değiştirmez.</p></div>
      <div className="flex flex-wrap gap-2"><button type="button" onClick={() => { if (window.confirm('Bu CV’deki düzenlemeler profil verileriyle değiştirilsin mi?')) { setDraft(createCvDraft(original)); setDirty(true); setSaveMessage(''); } }} className="inline-flex items-center gap-2 rounded-xl border border-[#D6DEE9] px-4 py-2.5 text-sm font-semibold text-[#52627A] hover:bg-[#F7F8FA]"><RotateCcw size={16} />Profilden sıfırla</button><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-xl bg-[#243B64] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1B2D4E]"><FileDown size={17} />PDF olarak kaydet</button></div>
    </div>
    <div className="cv-builder-grid mt-6 grid items-start gap-6 xl:grid-cols-[minmax(0,370px)_minmax(0,1fr)]">
      <div className="cv-editor-pane space-y-5">
        <section className="rounded-2xl border border-[#E3E7ED] bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-2"><h2 className="font-semibold text-[#243B64]">CV taslaklarım</h2><button type="button" onClick={startNewDraft} className="inline-flex items-center gap-1 text-sm font-semibold text-[#2F8F83]"><Plus size={16} />Yeni CV</button></div>
          {savedDrafts.length > 0 && <label className="mt-3 block text-sm text-[#52627A]">Kayıtlı CV’yi aç<select value={selectedId || ''} onChange={(event) => selectDraft(event.target.value)} className={inputClass}><option value="" disabled>CV seç</option>{savedDrafts.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>}
          <Field label="CV adı" value={draftName} onChange={(value) => { setDraftName(value); setDirty(true); setSaveMessage(''); }} />
          <div className="mt-3 flex flex-wrap gap-2"><button type="button" disabled={saving} onClick={saveDraft} className="inline-flex items-center gap-2 rounded-lg bg-[#243B64] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"><Save size={16} />{saving ? 'Kaydediliyor...' : selectedId ? 'Değişiklikleri kaydet' : 'CV taslağını kaydet'}</button>{selectedId && <button type="button" onClick={deleteDraft} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Taslağı sil</button>}</div>
          {saveMessage && <p role="status" className="mt-2 text-sm text-[#52627A]">{saveMessage}</p>}
          {dirty && <p className="mt-2 text-xs text-[#A15A12]">Kaydedilmemiş değişiklikler var.</p>}
        </section>
        <section className="rounded-2xl border border-[#E3E7ED] bg-white p-5 shadow-sm"><h2 className="font-semibold text-[#243B64]">Şablon seç</h2><div className="mt-3 grid gap-2">{templateDefinitions.map((template) => <button key={template.id} type="button" aria-pressed={draft.template === template.id} onClick={() => updateField('template', template.id)} className={`w-full rounded-xl border-2 p-4 text-left ${draft.template === template.id ? 'border-[#243B64] bg-[#F4F7FA]' : 'border-[#E3E7ED] bg-white'}`}><span className="inline-flex items-center gap-2 font-semibold text-[#243B64]"><FileText size={18} />{template.name}</span><span className="mt-1 block text-xs text-[#667085]">{template.description}</span></button>)}</div></section>
        <section className="rounded-2xl border border-[#E3E7ED] bg-white p-5 shadow-sm"><h2 className="font-semibold text-[#243B64]">Bölümler</h2><p className="mt-1 text-xs text-[#667085]">Sırayı değiştir veya yalnızca bu CV’de gizle.</p><div className="mt-4 space-y-2">{draft.sections.map((section, index) => <div key={section.id} className="flex items-center gap-2 rounded-lg border border-[#E3E7ED] px-3 py-2 text-sm"><button type="button" onClick={() => setActiveSection(section.id)} className="min-w-0 flex-1 truncate text-left font-medium text-[#243B64]">{sectionLabels[section.id]}</button><button type="button" onClick={() => toggleSection(section.id)} className="p-1 text-[#5276A7]" aria-label={`${sectionLabels[section.id]} bölümünü ${section.visible ? 'gizle' : 'göster'}`}>{section.visible ? <Eye size={17} /> : <EyeOff size={17} />}</button><button type="button" disabled={index === 0} onClick={() => moveSection(index, -1)} className="p-1 text-[#5276A7] disabled:opacity-30" aria-label={`${sectionLabels[section.id]} bölümünü yukarı taşı`}><ArrowUp size={16} /></button><button type="button" disabled={index === draft.sections.length - 1} onClick={() => moveSection(index, 1)} className="p-1 text-[#5276A7] disabled:opacity-30" aria-label={`${sectionLabels[section.id]} bölümünü aşağı taşı`}><ArrowDown size={16} /></button></div>)}</div></section>
        <section className="rounded-2xl border border-[#E3E7ED] bg-white p-5 shadow-sm"><div className="mb-4 flex flex-wrap gap-2"><button type="button" onClick={() => setActiveSection('personal')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeSection === 'personal' ? 'bg-[#243B64] text-white' : 'bg-[#F4F7FA] text-[#52627A]'}`}>İletişim</button>{draft.sections.map((section) => <button key={section.id} type="button" onClick={() => setActiveSection(section.id)} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeSection === section.id ? 'bg-[#243B64] text-white' : 'bg-[#F4F7FA] text-[#52627A]'}`}>{sectionLabels[section.id]}</button>)}</div>
          {activeSection === 'personal' && <div className="space-y-3"><Field label="Ad Soyad" value={draft.fullName} onChange={(value) => updateField('fullName', value)} /><Field label="Mesleki unvan" value={draft.title} onChange={(value) => updateField('title', value)} /><Field label="E-posta" value={draft.email} onChange={(value) => updateField('email', value)} /><Field label="Telefon" value={draft.phone} onChange={(value) => updateField('phone', value)} /><Field label="Konum" value={draft.location} onChange={(value) => updateField('location', value)} /><Field label="LinkedIn" value={draft.linkedIn} onChange={(value) => updateField('linkedIn', value)} /><Field label="GitHub" value={draft.gitHub} onChange={(value) => updateField('gitHub', value)} /><Field label="Portfolyo" value={draft.portfolio} onChange={(value) => updateField('portfolio', value)} /></div>}
          {activeSection === 'summary' && <Field label="Kısa özet" multiline value={draft.summary} onChange={(value) => updateField('summary', value)} />}
          {activeSection !== 'personal' && activeSection !== 'summary' && <EntryEditor sectionId={activeSection} entries={draft[activeSection]} updateEntry={updateEntry} removeEntry={removeEntry} addEntry={addEntry} />}
        </section>
      </div>
      <section className="cv-preview-pane min-w-0 rounded-2xl border border-[#E3E7ED] bg-[#E9EDF2] p-4 shadow-sm sm:p-7"><div className="cv-preview-heading mb-4 flex items-center justify-between gap-3"><h2 className="font-semibold text-[#243B64]">Canlı önizleme</h2><span className="text-xs text-[#667085]">A4 · PDF çıktısında yalnızca CV görünür</span></div><div className="cv-paper-frame"><CvDocument draft={draft} /></div><p className="cv-preview-note mt-3 text-xs text-[#667085]">PDF olarak kaydet düğmesi tarayıcının yazdırma penceresini açar. Hedef olarak “PDF olarak kaydet” seç.</p></section>
    </div>
  </main>;
}

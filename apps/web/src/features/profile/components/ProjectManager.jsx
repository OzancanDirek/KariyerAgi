import { ExternalLink, Github, Pencil, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../../shared/ui/Modal.jsx';
import { Button } from '../../../shared/ui/Button.jsx';
import { fieldClass } from './profileFormStyles.js';
import { visibleProfileRecords } from './profileRecordPreview.js';
import { useCandidateRecords } from '../hooks/useCandidateRecords.js';
import { projectApi } from '../api/projectApi.js';

const empty = { name: '', description: '', role: '', technologiesText: '', projectUrl: '', codeUrl: '', startDate: '', endDate: '' };

function toPayload(form) {
  return {
    name: form.name,
    description: form.description || null,
    role: form.role || null,
    technologies: form.technologiesText.split(',').map((value) => value.trim()).filter(Boolean),
    projectUrl: form.projectUrl || null,
    codeUrl: form.codeUrl || null,
    startDate: form.startDate || null,
    endDate: form.endDate || null,
  };
}

export function ProjectManager({ runAuthenticated, previewLimit, onShowAll }) {
  const { items, loading, error, editing, form, setForm, saving, deleting, open, close, save, remove } =
    useCandidateRecords(projectApi, runAuthenticated, empty, toPayload);

  function openProject(item) {
    open(item);
    if (item) {
      setForm((current) => ({ ...current, technologiesText: (item.technologies || []).join(', ') }));
    }
  }

  return <>
    <div className="mb-2 flex justify-end"><button type="button" onClick={() => openProject()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#243B64] hover:underline"><Plus size={16} />Proje Ekle</button></div>
    {loading && <p role="status" className="text-sm text-[#667085]">Projeler yükleniyor...</p>}
    {error && !editing && <p role="alert" className="mb-3 text-sm text-[#B42318]">{error}</p>}
    {!loading && !error && items.length === 0 && <p className="rounded-xl border border-dashed border-[#D8DEE8] bg-[#FAFBFC] px-4 py-8 text-center text-sm text-[#8894A6]">Henüz proje eklenmedi.</p>}
    <div className="space-y-3">{visibleProfileRecords(items, previewLimit).map((item) => <article key={item.id} className="rounded-xl border border-[#E3E7ED] bg-[#F8F9FB] p-4">
      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="text-sm font-semibold text-[#243B64]">{item.name}</h3>{item.role && <p className="mt-1 text-xs text-[#5276A7]">{item.role}</p>}</div><div className="flex gap-1"><button type="button" onClick={() => openProject(item)} aria-label="Projeyi düzenle" className="rounded-lg p-2 text-[#5276A7] hover:bg-white"><Pencil size={15} /></button><button type="button" disabled={deleting === item.id} onClick={() => { if (window.confirm('Bu projeyi silmek istiyor musun?')) { remove(item.id); } }} aria-label="Projeyi sil" className="rounded-lg p-2 text-[#B42318] hover:bg-white"><Trash2 size={15} /></button></div></div>
      {item.description && <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-[#667085]">{item.description}</p>}
      {item.technologies?.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{item.technologies.map((technology) => <span key={technology} className="rounded-md bg-[#EDF3FA] px-2 py-1 text-xs text-[#31527F]">{technology}</span>)}</div>}
      {(item.projectUrl || item.codeUrl) && <div className="mt-3 flex flex-wrap gap-4 text-xs font-semibold text-[#31527F]">{item.projectUrl && <a href={item.projectUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline"><ExternalLink size={14} />Projeyi aç</a>}{item.codeUrl && <a href={item.codeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline"><Github size={14} />Kodu aç</a>}</div>}
    </article>)}</div>
    {onShowAll && items.length > 0 && <div className="mt-4 border-t border-[#EDF0F4] pt-3 text-center"><button type="button" onClick={onShowAll} className="text-sm font-semibold text-[#31527F] hover:underline">Tümünü gör ({items.length}) →</button></div>}
    <Modal isOpen={Boolean(editing)} onClose={close} title={editing === 'new' ? 'Proje ekle' : 'Projeyi düzenle'} maxWidth="xl">
      <form onSubmit={save} className="space-y-4">
        {error && <p role="alert" className="text-sm text-[#B42318]">{error}</p>}
        <label className="block text-sm font-medium">Proje adı *<input className={fieldClass} required maxLength={200} value={form.name || ''} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
        <label className="block text-sm font-medium">Açıklama<textarea className={`${fieldClass} min-h-24 resize-y`} maxLength={5000} value={form.description || ''} onChange={(event) => setForm({ ...form, description: event.target.value })} /></label>
        <label className="block text-sm font-medium">Projede rolün<input className={fieldClass} maxLength={150} value={form.role || ''} onChange={(event) => setForm({ ...form, role: event.target.value })} /></label>
        <label className="block text-sm font-medium">Teknolojiler<input className={fieldClass} value={form.technologiesText || ''} onChange={(event) => setForm({ ...form, technologiesText: event.target.value })} placeholder="React, .NET, PostgreSQL" /><span className="mt-1 block text-xs text-[#77849A]">Virgülle ayır; en fazla 20 teknoloji.</span></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Başlangıç tarihi<input type="date" className={fieldClass} value={form.startDate || ''} onChange={(event) => setForm({ ...form, startDate: event.target.value })} /></label><label className="text-sm font-medium">Bitiş tarihi<input type="date" className={fieldClass} min={form.startDate || undefined} value={form.endDate || ''} onChange={(event) => setForm({ ...form, endDate: event.target.value })} /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Proje bağlantısı<input type="url" className={fieldClass} maxLength={300} value={form.projectUrl || ''} onChange={(event) => setForm({ ...form, projectUrl: event.target.value })} placeholder="https://..." /></label><label className="block text-sm font-medium">Kod bağlantısı<input type="url" className={fieldClass} maxLength={300} value={form.codeUrl || ''} onChange={(event) => setForm({ ...form, codeUrl: event.target.value })} placeholder="https://..." /></label></div>
        <div className="flex justify-end"><Button type="submit" isLoading={saving}>Kaydet</Button></div>
      </form>
    </Modal>
  </>;
}

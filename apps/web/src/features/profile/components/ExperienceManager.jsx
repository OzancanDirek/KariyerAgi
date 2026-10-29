import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../../shared/ui/Modal.jsx';
import { Button } from '../../../shared/ui/Button.jsx';
import { fieldClass } from './profileFormStyles.js';
import { experienceApi } from '../api/experienceApi.js';
import { useCandidateRecords } from '../hooks/useCandidateRecords.js';
import { visibleProfileRecords } from './profileRecordPreview.js';

const empty = { position: '', company: '', employmentType: '', workModel: '', location: '', startDate: '', endDate: '', description: '' };
const employmentTypes = [['tam_zamanli', 'Tam zamanlı'], ['yari_zamanli', 'Yarı zamanlı'], ['staj', 'Staj'], ['serbest', 'Serbest'], ['gonullu', 'Gönüllü'], ['proje_bazli', 'Proje bazlı']];
const workModels = [['uzaktan', 'Uzaktan'], ['hibrit', 'Hibrit'], ['ofis', 'Ofis']];

function showDate(value) {
  if (!value) {
    return 'Devam ediyor';
  }
  return new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

export function ExperienceManager({ runAuthenticated, previewLimit, onShowAll }) {
  const { items, loading, error, editing, form, setForm, saving, deleting, open, close, save, remove } =
    useCandidateRecords(experienceApi, runAuthenticated, empty, (value) => ({
      ...value,
      employmentType: value.employmentType || null,
      workModel: value.workModel || null,
      endDate: value.endDate || null,
    }));

  return <>
    <div className="mb-2 flex justify-end"><button type="button" onClick={() => open()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#243B64] hover:underline"><Plus size={16} />Deneyim Ekle</button></div>
    {loading && <p role="status" className="text-sm text-[#667085]">Deneyimler yükleniyor...</p>}
    {error && !editing && <p role="alert" className="mb-3 text-sm text-[#B42318]">{error}</p>}
    {!loading && !error && items.length === 0 && <p className="rounded-xl border border-dashed border-[#D8DEE8] bg-[#FAFBFC] px-4 py-8 text-center text-sm text-[#8894A6]">Henüz deneyim eklenmedi.</p>}
    <div className="space-y-3">{visibleProfileRecords(items, previewLimit).map((item) => <article key={item.id} className="rounded-xl border border-[#E3E7ED] bg-[#F8F9FB] p-4">
      <div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-[#243B64]">{item.position}</h3><p className="mt-1 text-sm text-[#5276A7]">{item.company}{item.location ? ` · ${item.location}` : ''}</p><p className="mt-1 text-xs text-[#77849A]">{showDate(item.startDate)} – {showDate(item.endDate)}</p></div><div className="flex gap-1"><button type="button" onClick={() => open(item)} aria-label="Deneyimi düzenle" className="rounded-lg p-2 text-[#5276A7] hover:bg-white"><Pencil size={15} /></button><button type="button" disabled={deleting === item.id} onClick={() => { if (window.confirm('Bu deneyimi silmek istiyor musun?')) { remove(item.id); } }} aria-label="Deneyimi sil" className="rounded-lg p-2 text-[#B42318] hover:bg-white"><Trash2 size={15} /></button></div></div>
      {(item.employmentType || item.workModel) && <p className="mt-2 text-xs text-[#667085]">{[employmentTypes.find(([value]) => value === item.employmentType)?.[1], workModels.find(([value]) => value === item.workModel)?.[1]].filter(Boolean).join(' · ')}</p>}
      {item.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#667085]">{item.description}</p>}
    </article>)}</div>
    {onShowAll && items.length > 0 && <div className="mt-4 border-t border-[#EDF0F4] pt-3 text-center"><button type="button" onClick={onShowAll} className="text-sm font-semibold text-[#31527F] hover:underline">Tümünü gör ({items.length}) →</button></div>}
    <Modal isOpen={Boolean(editing)} onClose={close} title={editing === 'new' ? 'Deneyim ekle' : 'Deneyimi düzenle'} maxWidth="xl">
      <form onSubmit={save} className="space-y-4">
        {error && <p role="alert" className="text-sm text-[#B42318]">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Pozisyon *<input className={fieldClass} required maxLength={150} value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} /></label><label className="text-sm font-medium">Şirket *<input className={fieldClass} required maxLength={150} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Çalışma tipi<select className={fieldClass} value={form.employmentType || ''} onChange={(e) => setForm({ ...form, employmentType: e.target.value })}><option value="">Seçiniz</option>{employmentTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="text-sm font-medium">Çalışma modeli<select className={fieldClass} value={form.workModel || ''} onChange={(e) => setForm({ ...form, workModel: e.target.value })}><option value="">Seçiniz</option>{workModels.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
        <label className="block text-sm font-medium">Konum<input className={fieldClass} maxLength={150} value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Başlangıç tarihi *<input type="date" className={fieldClass} required value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label><label className="text-sm font-medium">Bitiş tarihi<input type="date" className={fieldClass} min={form.startDate || undefined} value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label></div>
        <label className="block text-sm font-medium">Açıklama<textarea className={`${fieldClass} min-h-28 resize-y`} maxLength={5000} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <div className="flex justify-end"><Button type="submit" isLoading={saving}>Kaydet</Button></div>
      </form>
    </Modal>
  </>;
}

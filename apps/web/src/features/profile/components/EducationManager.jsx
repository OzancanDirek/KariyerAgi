import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../../shared/ui/Modal.jsx';
import { Button } from '../../../shared/ui/Button.jsx';
import { fieldClass } from './profileFormStyles.js';
import { educationApi } from '../api/educationApi.js';
import { useCandidateRecords } from '../hooks/useCandidateRecords.js';
import { visibleProfileRecords } from './profileRecordPreview.js';
import { SearchableSelect } from './SearchableSelect.jsx';

const otherSchool = 'DİĞER KURUM / LİSE';
const otherDepartment = 'DİĞER BÖLÜM';
const empty = { institution: '', institutionOther: '', degree: '', fieldOfStudy: '', fieldOfStudyOther: '', startDate: '', endDate: '', gradeAverage: '', gradeScale: '', description: '' };
const degrees = [['lise', 'Lise'], ['onlisans', 'Ön lisans'], ['lisans', 'Lisans'], ['yuksek_lisans', 'Yüksek lisans'], ['doktora', 'Doktora'], ['diger', 'Diğer']];

function toPayload(value) {
  const gradeAverage = value.gradeAverage === '' || value.gradeAverage === null
    ? null
    : Number(String(value.gradeAverage).replace(',', '.'));
  if (gradeAverage !== null && !Number.isFinite(gradeAverage)) {
    throw new Error('Not ortalaması için geçerli bir sayı girin.');
  }
  return {
    institution: value.institution === otherSchool ? value.institutionOther : value.institution,
    degree: value.degree || null,
    fieldOfStudy: value.fieldOfStudy === otherDepartment ? value.fieldOfStudyOther || null : value.fieldOfStudy || null,
    startDate: value.startDate || null,
    endDate: value.endDate || null,
    gradeAverage,
    gradeScale: value.gradeScale === '' || value.gradeScale === null ? null : Number(value.gradeScale),
    description: value.description || null,
  };
}

function showDate(value) {
  if (!value) {
    return 'Devam ediyor';
  }
  return new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

export function EducationManager({ runAuthenticated, previewLimit, onShowAll }) {
  const { items, loading, error, editing, form, setForm, saving, deleting, open, close, save, remove } =
    useCandidateRecords(educationApi, runAuthenticated, empty, toPayload);
  const [universityPrograms, setUniversityPrograms] = useState(null);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    if (editing && !universityPrograms) {
      import('../data/universityPrograms.json').then((module) => {
        setUniversityPrograms(module.default);
      }).catch(() => {
        setCatalogError('Okul ve bölüm listesi yüklenemedi. Sayfayı yenileyip tekrar deneyin.');
      });
    }
  }, [editing, universityPrograms]);

  const universities = Object.keys(universityPrograms || {});
  const schoolKey = universities.find((name) => name.localeCompare(form.institution, 'tr', { sensitivity: 'base' }) === 0);
  const schoolKnown = Boolean(schoolKey);
  const departments = universityPrograms?.[schoolKey] || [];
  const departmentKnown = departments.some((name) => name.localeCompare(form.fieldOfStudy || '', 'tr', { sensitivity: 'base' }) === 0);

  function selectSchool(value) {
    setForm({ ...form, institution: value, institutionOther: '', fieldOfStudy: '', fieldOfStudyOther: '' });
  }

  return <>
    <div className="mb-2 flex justify-end"><button type="button" onClick={() => open()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#243B64] hover:underline"><Plus size={16} />Eğitim Ekle</button></div>
    {loading && <p role="status" className="text-sm text-[#667085]">Eğitimler yükleniyor...</p>}
    {error && !editing && <p role="alert" className="mb-3 text-sm text-[#B42318]">{error}</p>}
    {!loading && !error && items.length === 0 && <p className="rounded-xl border border-dashed border-[#D8DEE8] bg-[#FAFBFC] px-4 py-8 text-center text-sm text-[#8894A6]">Henüz eğitim eklenmedi.</p>}
    <div className="space-y-3">{visibleProfileRecords(items, previewLimit).map((item) => <article key={item.id} className="rounded-xl border border-[#E3E7ED] bg-[#F8F9FB] p-4">
      <div className="flex items-start justify-between gap-3"><div><h3 className="text-sm font-semibold text-[#243B64]">{item.institution}</h3><p className="mt-1 text-sm text-[#5276A7]">{[degrees.find(([value]) => value === item.degree)?.[1], item.fieldOfStudy].filter(Boolean).join(' · ')}</p>{(item.startDate || item.endDate) && <p className="mt-1 text-xs text-[#77849A]">{item.startDate ? showDate(item.startDate) : 'Başlangıç belirtilmedi'} – {showDate(item.endDate)}</p>}{item.gradeAverage != null && <p className="mt-1 text-xs text-[#77849A]">Not ortalaması: {item.gradeAverage} / {item.gradeScale}</p>}</div><div className="flex gap-1"><button type="button" onClick={() => open(item)} aria-label="Eğitimi düzenle" className="rounded-lg p-2 text-[#5276A7] hover:bg-white"><Pencil size={15} /></button><button type="button" disabled={deleting === item.id} onClick={() => { if (window.confirm('Bu eğitim kaydını silmek istiyor musun?')) { remove(item.id); } }} aria-label="Eğitimi sil" className="rounded-lg p-2 text-[#B42318] hover:bg-white"><Trash2 size={15} /></button></div></div>
      {item.description && <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#667085]">{item.description}</p>}
    </article>)}</div>
    {onShowAll && items.length > 0 && <div className="mt-4 border-t border-[#EDF0F4] pt-3 text-center"><button type="button" onClick={onShowAll} className="text-sm font-semibold text-[#31527F] hover:underline">Tümünü gör ({items.length}) →</button></div>}
    <Modal isOpen={Boolean(editing)} onClose={close} title={editing === 'new' ? 'Eğitim ekle' : 'Eğitimi düzenle'} maxWidth="xl">
      <form onSubmit={save} className="space-y-4">
        {error && <p role="alert" className="text-sm text-[#B42318]">{error}</p>}
        {catalogError && <p role="alert" className="text-sm text-[#B42318]">{catalogError}</p>}
        <SearchableSelect label="Kurum" required value={form.institution} options={[...universities, otherSchool]} onChange={selectSchool} disabled={!universityPrograms} placeholder={universityPrograms ? 'Üniversite seçiniz' : 'Üniversiteler yükleniyor...'} />
        {(form.institution === otherSchool || (form.institution && !schoolKnown)) && <label className="block text-sm font-medium">Kurum adı<input className={fieldClass} required maxLength={200} value={form.institution === otherSchool ? form.institutionOther : form.institution} onChange={(e) => setForm({ ...form, [form.institution === otherSchool ? 'institutionOther' : 'institution']: e.target.value })} placeholder="Lise veya listede olmayan kurum" /></label>}
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Derece<select className={fieldClass} value={form.degree || ''} onChange={(e) => setForm({ ...form, degree: e.target.value })}><option value="">Seçiniz</option>{degrees.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><div><SearchableSelect label="Bölüm" value={form.fieldOfStudy} options={departments.length ? [...departments, otherDepartment] : [otherDepartment]} onChange={(value) => setForm({ ...form, fieldOfStudy: value, fieldOfStudyOther: '' })} disabled={!form.institution} placeholder={form.institution ? 'Bölüm seçiniz' : 'Önce kurum seçiniz'} /></div></div>
        {(form.fieldOfStudy === otherDepartment || (form.fieldOfStudy && !departmentKnown)) && <label className="block text-sm font-medium">Bölüm adı<input className={fieldClass} maxLength={200} value={form.fieldOfStudy === otherDepartment ? form.fieldOfStudyOther : form.fieldOfStudy} onChange={(e) => setForm({ ...form, [form.fieldOfStudy === otherDepartment ? 'fieldOfStudyOther' : 'fieldOfStudy']: e.target.value })} placeholder="Listede olmayan bölüm" /></label>}
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Başlangıç tarihi<input type="date" className={fieldClass} value={form.startDate || ''} onChange={(e) => setForm({ ...form, startDate: e.target.value })} /></label><label className="text-sm font-medium">Bitiş tarihi<input type="date" className={fieldClass} min={form.startDate || undefined} value={form.endDate || ''} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Not ölçeği<select className={fieldClass} value={form.gradeScale ?? ''} onChange={(e) => setForm({ ...form, gradeScale: e.target.value, gradeAverage: e.target.value ? form.gradeAverage : '' })}><option value="">Seçiniz</option><option value="4">4</option><option value="5">5</option><option value="100">100</option></select></label><label className="text-sm font-medium">Not ortalaması<input type="number" step="0.01" min="0" max={form.gradeScale || undefined} disabled={!form.gradeScale} className={fieldClass} value={form.gradeAverage ?? ''} onChange={(e) => setForm({ ...form, gradeAverage: e.target.value })} /></label></div>
        <label className="block text-sm font-medium">Açıklama<textarea className={`${fieldClass} min-h-28 resize-y`} maxLength={2000} value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
        <div className="flex justify-end"><Button type="submit" isLoading={saving}>Kaydet</Button></div>
      </form>
    </Modal>
  </>;
}

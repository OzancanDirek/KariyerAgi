import { useState } from 'react';
import { Download, ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../../../shared/ui/Modal.jsx';
import { Button } from '../../../shared/ui/Button.jsx';
import { fieldClass } from './profileFormStyles.js';
import { CertificateDropzone } from './CertificateDropzone.jsx';
import { CertificateThumbnail } from './CertificateThumbnail.jsx';
import { certificateApi } from '../api/certificateApi.js';
import { useCandidateRecords } from '../hooks/useCandidateRecords.js';
import { visibleProfileRecords } from './profileRecordPreview.js';

const empty = { name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', verificationUrl: '', file: null };

function toPayload(form) {
  if (form.file && (form.file.size > 10 * 1024 * 1024 || !/\.(pdf|jpe?g|png)$/i.test(form.file.name))) {
    throw new Error('PDF, JPG veya PNG biçiminde en fazla 10 MB dosya seçin.');
  }
  return {
    name: form.name,
    issuer: form.issuer,
    issueDate: form.issueDate || null,
    expiryDate: form.expiryDate || null,
    credentialId: form.credentialId || null,
    verificationUrl: form.verificationUrl || null,
  };
}

function showDate(value) {
  if (!value) {
    return null;
  }
  return new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

export function CertificateManager({ runAuthenticated, previewLimit, onShowAll }) {
  const afterSave = async (record, form) => {
    if (!form.file) {
      return record;
    }
    return runAuthenticated((token) => certificateApi.uploadDocument(token, record.id, form.file));
  };
  const { items, loading, error, editing, form, setForm, saving, deleting, open, close, save, remove } =
    useCandidateRecords(certificateApi, runAuthenticated, empty, toPayload, afterSave);
  const [documentError, setDocumentError] = useState('');
  const [downloading, setDownloading] = useState(null);

  async function download(item) {
    setDownloading(item.id);
    setDocumentError('');
    try {
      const blob = await runAuthenticated((token) => certificateApi.downloadDocument(token, item.id));
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = item.documentFileName || 'sertifika';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (failure) {
      setDocumentError(failure.message);
    } finally {
      setDownloading(null);
    }
  }

  return <>
    <div className="mb-2 flex justify-end"><button type="button" onClick={() => open()} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#243B64] hover:underline"><Plus size={16} />Sertifika Ekle</button></div>
    {loading && <p role="status" className="text-sm text-[#667085]">Sertifikalar yükleniyor...</p>}
    {error && !editing && <p role="alert" className="mb-3 text-sm text-[#B42318]">{error}</p>}
    {documentError && <p role="alert" className="mb-3 text-sm text-[#B42318]">{documentError}</p>}
    {!loading && !error && items.length === 0 && <p className="rounded-xl border border-dashed border-[#D8DEE8] bg-[#FAFBFC] px-4 py-8 text-center text-sm text-[#8894A6]">Henüz sertifika eklenmedi.</p>}
    <div className="space-y-3">{visibleProfileRecords(items, previewLimit).map((item) => <article key={item.id} className="rounded-2xl border border-[#E1E7EF] bg-white px-4 py-4 shadow-[0_2px_8px_rgba(32,41,56,0.04)]">
      <div className="flex items-start gap-3">
        <CertificateThumbnail certificate={item} runAuthenticated={runAuthenticated} />
        <div className="min-w-0 flex-1"><h3 className="text-sm font-bold leading-5 text-[#243B64]">{item.name}</h3><p className="mt-0.5 text-sm text-[#5276A7]">{item.issuer}</p></div>
        <div className="flex shrink-0 gap-1"><button type="button" onClick={() => open(item)} aria-label="Sertifikayı düzenle" title="Düzenle" className="rounded-lg p-2 text-[#5276A7] hover:bg-[#F1F5FA]"><Pencil size={16} /></button><button type="button" disabled={deleting === item.id} onClick={() => { if (window.confirm('Bu sertifikayı ve yüklenen belgesini silmek istiyor musun?')) { remove(item.id); } }} aria-label="Sertifikayı sil" title="Sertifikayı sil" className="rounded-lg p-2 text-[#B42318] hover:bg-[#FFF1EF]"><Trash2 size={16} /></button></div>
      </div>
      {(item.issueDate || item.expiryDate || item.credentialId) && <p className="mt-3 pl-[76px] text-xs leading-5 text-[#77849A]">{[item.issueDate && `Veriliş: ${showDate(item.issueDate)}`, item.expiryDate && `Geçerlilik: ${showDate(item.expiryDate)}`, item.credentialId && `No: ${item.credentialId}`].filter(Boolean).join(' · ')}</p>}
      {(item.verificationUrl || item.hasDocument) && <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#EDF0F4] pt-3 pl-[76px] text-xs font-semibold">
        {item.verificationUrl && <a href={item.verificationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[#31527F] hover:bg-[#F1F5FA]"><ExternalLink size={14} />Doğrula</a>}
        {item.hasDocument && <button type="button" disabled={downloading === item.id} onClick={() => download(item)} title={item.documentFileName || 'Belgeyi indir'} className="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-[#F0F5FB] px-2.5 py-1.5 text-[#31527F] hover:bg-[#E6EEF8] disabled:opacity-50"><Download size={14} /><span className="max-w-40 truncate">Belgeyi indir</span></button>}
      </div>}
    </article>)}</div>
    {onShowAll && items.length > 0 && <div className="mt-4 border-t border-[#EDF0F4] pt-3 text-center"><button type="button" onClick={onShowAll} className="text-sm font-semibold text-[#31527F] hover:underline">Tümünü gör ({items.length}) →</button></div>}
    <Modal isOpen={Boolean(editing)} onClose={close} title={editing === 'new' ? 'Sertifika ekle' : 'Sertifikayı düzenle'} subtitle="Sertifika bilgilerini ve varsa belgeni profilinde paylaş." maxWidth="xl">
      <form onSubmit={save} className="space-y-5">
        {error && <p role="alert" className="rounded-lg bg-[#FFF2F0] px-3 py-2 text-sm text-[#B42318]">{error}</p>}
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Sertifika adı *<input className={fieldClass} required maxLength={200} value={form.name || ''} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Örn. AWS Cloud Practitioner" /></label><label className="block text-sm font-medium">Veren kurum *<input className={fieldClass} required maxLength={200} value={form.issuer || ''} onChange={(event) => setForm({ ...form, issuer: event.target.value })} placeholder="Örn. Amazon Web Services" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium">Veriliş tarihi<input type="date" className={fieldClass} value={form.issueDate || ''} onChange={(event) => setForm({ ...form, issueDate: event.target.value })} /></label><label className="text-sm font-medium">Geçerlilik bitiş tarihi<input type="date" className={fieldClass} min={form.issueDate || undefined} value={form.expiryDate || ''} onChange={(event) => setForm({ ...form, expiryDate: event.target.value })} /></label></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="block text-sm font-medium">Sertifika numarası<input className={fieldClass} maxLength={100} value={form.credentialId || ''} onChange={(event) => setForm({ ...form, credentialId: event.target.value })} /></label><label className="block text-sm font-medium">Doğrulama bağlantısı<input type="url" className={fieldClass} maxLength={300} value={form.verificationUrl || ''} onChange={(event) => setForm({ ...form, verificationUrl: event.target.value })} placeholder="https://..." /></label></div>
        <CertificateDropzone file={form.file} existingFileName={form.documentFileName} disabled={saving} onChange={(file) => setForm((current) => ({ ...current, file }))} />
        <div className="flex justify-end border-t border-[#EDF0F4] pt-4"><Button type="submit" isLoading={saving}>Kaydet</Button></div>
      </form>
    </Modal>
  </>;
}

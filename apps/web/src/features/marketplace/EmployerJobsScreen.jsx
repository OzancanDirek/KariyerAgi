import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, CheckCircle2, CircleHelp, Download, ExternalLink, FileText, MinusCircle, Plus, SearchX, Users, X } from 'lucide-react';
import { companyApi } from './companyApi.js';
import { jobApi } from './jobApi.js';

const emptyJob = {
  companyId: '', title: '', description: '', location: '', workModel: 'hibrit',
  employmentType: 'tam_zamanli', status: 'taslak', applicationDeadline: '',
};

const labels = {
  taslak: 'Taslak', yayinda: 'Yayında', kapali: 'Kapalı',
  uzaktan: 'Uzaktan', hibrit: 'Hibrit', ofis: 'Ofis',
  tam_zamanli: 'Tam zamanlı', yari_zamanli: 'Yarı zamanlı',
  staj: 'Staj', sozlesmeli: 'Sözleşmeli',
  gonderildi: 'Gönderildi', inceleniyor: 'İnceleniyor', mulakat: 'Mülakat', teklif: 'Teklif', reddedildi: 'Reddedildi', geri_cekildi: 'Geri çekildi',
};

function dateLabel(value) {
  if (!value) {
    return 'Belirtilmedi';
  }
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(new Date(value));
}

function toForm(job) {
  return {
    companyId: job.companyId,
    title: job.title,
    description: job.description,
    location: job.location ?? '',
    workModel: job.workModel,
    employmentType: job.employmentType,
    status: job.status,
    applicationDeadline: job.applicationDeadline ? job.applicationDeadline.slice(0, 10) : '',
  };
}

function toRequest(form) {
  return {
    ...form,
    location: form.location.trim() || null,
    applicationDeadline: form.applicationDeadline
      ? new Date(`${form.applicationDeadline}T23:59:59`).toISOString()
      : null,
  };
}

function JobForm({ companies, initialJob, onSave, onCancel, saving }) {
  const [form, setForm] = useState(() => initialJob ? toForm(initialJob) : {
    ...emptyJob, companyId: companies[0]?.id ?? '',
  });
  const selectedCompany = companies.find((company) => company.id === form.companyId);
  const canPublish = selectedCompany?.verificationStatus === 'onaylandi';

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    onSave(toRequest(form));
  }

  return <form onSubmit={submit} className="space-y-5 rounded-3xl border border-[#DFE6EE] bg-white p-6 shadow-sm sm:p-8">
    <div className="flex items-center justify-between gap-3">
      <div><p className="text-xs font-bold uppercase tracking-widest text-[#2F8F83]">İşveren alanı</p><h2 className="mt-2 text-2xl font-bold text-[#243B64]">{initialJob ? 'İlanı düzenle' : 'Yeni ilan oluştur'}</h2></div>
      <button type="button" onClick={onCancel} className="inline-flex items-center gap-2 text-sm font-semibold text-[#52627A]"><ArrowLeft size={17} /> İlanlara dön</button>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-semibold text-[#334155]">Şirket *
        <select required disabled={Boolean(initialJob)} value={form.companyId} onChange={(event) => setField('companyId', event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8E0EA] bg-white px-4 py-3 disabled:bg-[#F4F6F8]">
          {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
        </select>
      </label>
      <label className="block text-sm font-semibold text-[#334155]">İlan durumu *
        <select value={form.status} onChange={(event) => setField('status', event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8E0EA] bg-white px-4 py-3">
          <option value="taslak">Taslak</option>
          <option value="yayinda" disabled={!canPublish}>Yayında</option>
          <option value="kapali">Kapalı</option>
        </select>
      </label>
    </div>
    {!canPublish && <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Şirket onaylanana kadar ilanı taslak olarak kaydedebilirsin.</p>}
    <label className="block text-sm font-semibold text-[#334155]">Pozisyon adı *
      <input required minLength={5} maxLength={160} value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="Örneğin: Yazılım Geliştirici" className="mt-2 w-full rounded-xl border border-[#D8E0EA] px-4 py-3" />
    </label>
    <label className="block text-sm font-semibold text-[#334155]">İlan açıklaması *
      <textarea required minLength={50} maxLength={10000} rows={8} value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Pozisyonun sorumluluklarını ve aranan nitelikleri yazın." className="mt-2 w-full rounded-xl border border-[#D8E0EA] px-4 py-3" />
      <span className="mt-1 block text-xs font-normal text-[#718096]">En az 50 karakter · {form.description.length}/10000</span>
    </label>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-semibold text-[#334155]">Çalışma modeli *
        <select value={form.workModel} onChange={(event) => setField('workModel', event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8E0EA] bg-white px-4 py-3"><option value="uzaktan">Uzaktan</option><option value="hibrit">Hibrit</option><option value="ofis">Ofis</option></select>
      </label>
      <label className="block text-sm font-semibold text-[#334155]">İstihdam türü *
        <select value={form.employmentType} onChange={(event) => setField('employmentType', event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8E0EA] bg-white px-4 py-3"><option value="tam_zamanli">Tam zamanlı</option><option value="yari_zamanli">Yarı zamanlı</option><option value="staj">Staj</option><option value="sozlesmeli">Sözleşmeli</option></select>
      </label>
      <label className="block text-sm font-semibold text-[#334155]">Konum
        <input maxLength={150} value={form.location} onChange={(event) => setField('location', event.target.value)} placeholder="Örneğin: İstanbul" className="mt-2 w-full rounded-xl border border-[#D8E0EA] px-4 py-3" />
      </label>
      <label className="block text-sm font-semibold text-[#334155]">Son başvuru tarihi
        <input type="date" min={form.status === 'yayinda' ? new Date().toISOString().slice(0, 10) : undefined} value={form.applicationDeadline} onChange={(event) => setField('applicationDeadline', event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8E0EA] px-4 py-3" />
      </label>
    </div>
    <div className="flex flex-wrap gap-3 border-t border-[#E8EDF3] pt-5">
      <button type="submit" disabled={saving || !form.companyId} className="rounded-xl bg-[#243B64] px-6 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Kaydediliyor...' : initialJob ? 'Değişiklikleri kaydet' : 'İlanı kaydet'}</button>
      <button type="button" onClick={onCancel} className="rounded-xl border border-[#D8E0EA] px-6 py-3 font-semibold text-[#52627A]">Vazgeç</button>
    </div>
  </form>;
}

const nextApplicationStatuses = {
  gonderildi: ['inceleniyor', 'reddedildi'],
  inceleniyor: ['mulakat', 'reddedildi'],
  mulakat: ['teklif', 'reddedildi'],
};

function MatchCriteriaPanel({ criteria, onDraft, onSave, busy }) {
  const [items, setItems] = useState(criteria?.criteria ?? []);
  useEffect(() => { setItems(criteria?.criteria ?? []); }, [criteria]);
  function change(index, field, value) {
    setItems((current) => current.map((item, position) => position === index ? { ...item, [field]: value } : item));
  }
  const total = items.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  return <div className="mt-6 rounded-2xl border border-[#D8E0EA] bg-[#F8FAFC] p-5">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-[#243B64]">İlan değerlendirme ölçütleri</h3><p className="mt-1 text-sm text-[#718096]">Yapay zekânın önerilerini inceleyip düzenle. Kaydedilen ölçütler başvuru uyumunda kullanılır.</p></div><button type="button" disabled={busy} onClick={onDraft} className="rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64] disabled:opacity-50">{busy ? 'Hazırlanıyor...' : 'İlandan ölçüt öner'}</button></div>
    {items.length > 0 && <div className="mt-4 space-y-3">{items.map((item, index) => <div key={index} className="grid gap-2 rounded-xl bg-white p-3 sm:grid-cols-[1fr_1.5fr_90px_auto_auto]">
      <input aria-label={`Ölçüt ${index + 1} adı`} maxLength={100} value={item.title} onChange={(event) => change(index, 'title', event.target.value)} className="rounded-lg border border-[#D8E0EA] px-3 py-2 text-sm" />
      <input aria-label={`Ölçüt ${index + 1} açıklaması`} maxLength={500} value={item.description} onChange={(event) => change(index, 'description', event.target.value)} className="rounded-lg border border-[#D8E0EA] px-3 py-2 text-sm" />
      <input aria-label={`Ölçüt ${index + 1} ağırlığı`} type="number" min="1" max="100" value={item.weight} onChange={(event) => change(index, 'weight', Number(event.target.value))} className="rounded-lg border border-[#D8E0EA] px-3 py-2 text-sm" />
      <label className="flex items-center gap-1 text-xs text-[#52627A]"><input type="checkbox" checked={item.required} onChange={(event) => change(index, 'required', event.target.checked)} /> Gerekli</label>
      <button type="button" aria-label={`${item.title} ölçütünü kaldır`} onClick={() => setItems((current) => current.filter((_, position) => position !== index))} className="text-sm font-semibold text-red-700">Kaldır</button>
    </div>)}<div className="flex flex-wrap items-center justify-between gap-3"><p className={`text-sm ${total === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>Toplam ağırlık: {total}/100 · {items.length}/8 ölçüt</p><div className="flex gap-2"><button type="button" disabled={items.length >= 8} onClick={() => setItems((current) => [...current, { title: '', description: '', weight: 1, required: false }])} className="rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64] disabled:opacity-50">Ölçüt ekle</button><button type="button" disabled={busy || total !== 100 || items.length < 4} onClick={() => onSave(items)} className="rounded-lg bg-[#243B64] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Ölçütleri kaydet</button></div></div></div>}
    {!items.length && <p className="mt-4 text-sm text-[#718096]">Henüz ölçüt kaydedilmedi. Bir taslak oluşturup onaylayabilirsin.</p>}
  </div>;
}

function ApplicationsPanel({ job, applications, loading, savingStatus, onStatusChange, onInspect, onBack, matches }) {
  return <section className="rounded-3xl border border-[#DFE6EE] bg-white p-6 shadow-sm sm:p-8">
    <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-[#5276A7]"><ArrowLeft size={17} /> İlanlara dön</button>
    <h2 className="mt-5 text-2xl font-bold text-[#243B64]">{job.title} · Başvurular</h2>
    <p className="mt-2 text-sm text-[#718096]">Adayları inceleyip başvuru aşamasını ilerletebilirsin.</p>
    {loading ? <p className="mt-8 text-[#718096]">Başvurular yükleniyor...</p>
      : applications.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-[#D8E0EA] p-8 text-center text-[#718096]">Bu ilana henüz başvuru yapılmadı.</div>
        : <div className="mt-6 space-y-4">{applications.map((application, index) => {
          const options = nextApplicationStatuses[application.status] ?? [];
          return <article key={application.id} className="rounded-2xl border border-[#DFE6EE] bg-[#F8FAFC] p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-[#243B64]">{application.candidateName?.trim() || `Başvuru #${applications.length - index}`}</h3>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#52627A]">{labels[application.status] ?? application.status}</span>
            </div>
            <p className="mt-2 text-sm font-semibold text-[#2F8F83]">{matches[application.id] ? `İlan uyumu %${matches[application.id].score}` : application.cvFileId ? "Henüz değerlendirilmedi" : "CV yok · manuel inceleme"}</p>
            <p className="mt-2 text-sm text-[#718096]">{dateLabel(application.createdAt)} · {application.cvFileId ? 'CV seçildi' : 'CV eklenmedi'}</p>
            <p className="mt-3 whitespace-pre-wrap text-sm text-[#334155]">{application.coverLetter || 'Ön yazı eklenmedi.'}</p>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#DFE6EE] pt-4">
              {application.status !== 'geri_cekildi' && <button type="button" onClick={() => onInspect(application.id)} className="inline-flex items-center gap-2 rounded-lg bg-[#243B64] px-4 py-2 text-sm font-semibold text-white"><FileText size={16} /> Başvuruyu incele</button>}
              {options.map((status) => <button key={status} type="button" disabled={savingStatus === application.id}
                onClick={() => onStatusChange(application.id, status)}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold disabled:opacity-50 ${status === 'reddedildi' ? 'border-red-200 text-red-700' : 'border-[#CAD7E7] text-[#243B64]'}`}>
                {savingStatus === application.id ? 'Kaydediliyor...' : labels[status]}
              </button>)}
            </div>
          </article>;
        })}</div>}
  </section>;
}

const matchVerdicts = {
  matched: { label: 'Eşleşiyor', Icon: CheckCircle2, classes: 'border-emerald-200 bg-emerald-50 text-emerald-800', accent: 'border-l-emerald-400' },
  partial: { label: 'Kısmen eşleşiyor', Icon: MinusCircle, classes: 'border-amber-200 bg-amber-50 text-amber-800', accent: 'border-l-amber-400' },
  not_found: { label: 'CV’de kanıt yok', Icon: SearchX, classes: 'border-rose-200 bg-rose-50 text-rose-800', accent: 'border-l-rose-400' },
  cannot_determine: { label: 'Belirlenemedi', Icon: CircleHelp, classes: 'border-slate-200 bg-slate-100 text-slate-700', accent: 'border-l-slate-300' },
};

function MatchResult({ match, criteria }) {
  const requiredByTitle = new Map(criteria?.criteria.map((criterion) => [criterion.title, criterion.required]) ?? []);
  const score = Math.min(100, Math.max(0, Number(match.score) || 0));

  return <div className="mt-5 space-y-5">
    <div className="rounded-2xl border border-[#DCE6F1] bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-bold uppercase tracking-widest text-[#64809E]">Genel ilan uyumu</p><p className="mt-1 text-4xl font-bold tracking-tight text-[#243B64]">%{score}</p></div>
        <span className="rounded-full border border-[#C8DFDA] bg-[#EAF6F2] px-3 py-1.5 text-xs font-semibold text-[#24776D]">İnceleme desteği</span>
      </div>
      <div role="progressbar" aria-label="İlan uyumu" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#E7EDF4]"><div className="h-full rounded-full bg-[#2F8F83]" style={{ width: `${score}%` }} /></div>
      <p className="mt-3 text-xs leading-5 text-[#718096]">CV’deki kanıtlar, ilan için kaydedilen ölçütlerle karşılaştırıldı.</p>
    </div>
    <div>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2"><h4 className="font-bold text-[#243B64]">Ölçütlere göre değerlendirme</h4><span className="text-xs text-[#8290A3]">{match.evidence.length} ölçüt</span></div>
      <div className="space-y-3">{match.evidence.map((item, index) => {
        const verdict = matchVerdicts[item.verdict] ?? matchVerdicts.cannot_determine;
        const VerdictIcon = verdict.Icon;
        return <article key={`${item.title}-${index}`} className={`rounded-xl border border-l-4 border-[#DFE6EE] bg-white p-4 sm:p-5 ${verdict.accent}`}>
          <div className="flex flex-wrap items-start justify-between gap-3"><h5 className="min-w-0 flex-1 font-semibold leading-6 text-[#243B64]">{item.title}</h5><span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${verdict.classes}`}><VerdictIcon size={14} aria-hidden="true" />{verdict.label}</span></div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs"><span className="rounded-md bg-[#F1F5F9] px-2.5 py-1 font-semibold text-[#52627A]">{item.weight} puan ağırlık</span><span className="rounded-md bg-[#F1F5F9] px-2.5 py-1 text-[#52627A]">{requiredByTitle.get(item.title) ? 'Temel ölçüt' : 'Tercih'}</span></div>
          <p className="mt-3 border-t border-[#EDF1F5] pt-3 text-sm leading-6 text-[#52627A]">{item.evidence || 'CV’de bu ölçüt için açıklayıcı kanıt bulunamadı.'}</p>
        </article>;
      })}</div>
    </div>
  </div>;
}

function ApplicantDialog({ detail, loading, error, cvLoading, onLoadCv, onDownloadCv, onClose, match, matchBusy, onEvaluate, criteriaReady, criteria }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172640]/70 px-4 py-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { onClose(); } }}>
    <section role="dialog" aria-modal="true" aria-labelledby="applicant-title" className="max-h-full w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#DFE6EE] bg-white px-6 py-5 sm:px-8"><div><p className="text-xs font-bold uppercase tracking-widest text-[#2F8F83]">Aday başvurusu</p><h2 id="applicant-title" className="mt-1 text-2xl font-bold text-[#243B64]">{detail?.candidateName || 'Başvuru detayı'}</h2></div><button type="button" aria-label="Kapat" onClick={onClose} className="rounded-lg p-2 text-[#52627A] hover:bg-[#F1F5F9]"><X size={22} /></button></div>
      {error && <p role="alert" className="mx-6 mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {loading ? <p className="p-8 text-[#718096]">Aday bilgileri yükleniyor...</p> : detail && <div className="space-y-6 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wide text-[#8290A3]">Pozisyon ve konum</p><p className="mt-1 font-semibold text-[#243B64]">{detail.title || 'Unvan belirtilmedi'}</p><p className="text-sm text-[#52627A]">{detail.location || 'Konum belirtilmedi'}</p></div><div><p className="text-xs font-semibold uppercase tracking-wide text-[#8290A3]">İletişim</p>{detail.email && <a className="mt-1 block break-all font-semibold text-[#5276A7]" href={`mailto:${detail.email}`}>{detail.email}</a>}{detail.phone && <a className="block text-sm text-[#52627A]" href={`tel:${detail.phone}`}>{detail.phone}</a>}{!detail.email && !detail.phone && <p className="mt-1 text-sm text-[#718096]">İletişim bilgisi bulunmuyor.</p>}</div></div>
        {detail.summary && <div><h3 className="font-bold text-[#243B64]">Hakkında</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#52627A]">{detail.summary}</p></div>}
        <div><h3 className="font-bold text-[#243B64]">Ön yazı</h3><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#52627A]">{detail.coverLetter || 'Ön yazı eklenmedi.'}</p></div>
        {(detail.linkedInUrl || detail.gitHubUrl || detail.portfolioUrl) && <div className="flex flex-wrap gap-3">{[['LinkedIn', detail.linkedInUrl], ['GitHub', detail.gitHubUrl], ['Portfolyo', detail.portfolioUrl]].filter(([, url]) => /^https:\/\//i.test(url || '')).map(([label, url]) => <a key={label} href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-[#5276A7]">{label}<ExternalLink size={14} /></a>)}</div>}
        <div className="rounded-2xl border border-[#DFE6EE] bg-[#F8FAFC] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-[#243B64]">İlan uyumu</h3><p className="mt-1 text-sm text-[#718096]">Yalnızca bu başvuruya eklenen CV ve onaylı ilan ölçütleri değerlendirilir. ATS okunabilirlik puanından ayrıdır.</p></div>{detail.cvFileName && criteriaReady && !match && <button type="button" disabled={matchBusy} onClick={onEvaluate} className="rounded-lg bg-[#243B64] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{matchBusy ? 'Değerlendiriliyor...' : 'CV’yi ölçütlere göre değerlendir'}</button>}</div>
          {match ? <MatchResult match={match} criteria={criteria} /> : <p className="mt-3 text-sm text-[#718096]">{criteriaReady ? 'Henüz değerlendirilmedi.' : 'Önce ilan ölçütlerini kaydedin.'}</p>}
          <p className="mt-3 text-xs text-[#718096]">Bu puan otomatik karar vermez. CV’de kanıt bulunmaması becerinin olmadığı anlamına gelmez.</p></div>
        <div className="rounded-2xl border border-[#DFE6EE] bg-[#F8FAFC] p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-bold text-[#243B64]">Başvuru CV’si</h3><p className="mt-1 text-sm text-[#718096]">{detail.cvFileName || 'Bu başvuruya CV eklenmedi.'}</p></div>{detail.cvFileName && <div className="flex gap-2">{detail.cvContentType === 'application/pdf' && <button type="button" disabled={cvLoading} onClick={onLoadCv} className="rounded-lg bg-[#243B64] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{cvLoading ? 'Açılıyor...' : 'CV’yi görüntüle'}</button>}<button type="button" disabled={cvLoading} onClick={onDownloadCv} className="inline-flex items-center gap-2 rounded-lg border border-[#CAD7E7] px-4 py-2 text-sm font-semibold text-[#243B64]"><Download size={16} /> İndir</button></div>}</div></div>
      </div>}
    </section>
  </div>;
}

function CvPreviewDialog({ url, fileName, onDownload, onClose }) {
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#101B30]/85 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { onClose(); } }}>
    <section role="dialog" aria-modal="true" aria-labelledby="cv-preview-title" className="flex h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-[#DFE6EE] px-5 py-4 sm:px-7"><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-widest text-[#2F8F83]">Başvuru CV’si</p><h2 id="cv-preview-title" className="truncate text-lg font-bold text-[#243B64]">{fileName}</h2></div><div className="flex shrink-0 items-center gap-2"><button type="button" onClick={onDownload} className="inline-flex items-center gap-2 rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64]"><Download size={16} /> <span className="hidden sm:inline">İndir</span></button><button type="button" aria-label="CV önizlemesini kapat" onClick={onClose} className="rounded-lg p-2 text-[#52627A] hover:bg-[#F1F5F9]"><X size={22} /></button></div></header>
      <iframe title={`${fileName} önizlemesi`} src={url} className="min-h-0 w-full flex-1 bg-[#EEF2F7]" />
    </section>
  </div>;
}

export function EmployerJobsScreen({ runAuthenticated }) {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [savingStatus, setSavingStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [archiveTarget, setArchiveTarget] = useState(null);
  const [applicantId, setApplicantId] = useState(null);
  const [applicantDetail, setApplicantDetail] = useState(null);
  const [applicantError, setApplicantError] = useState('');
  const [applicantLoading, setApplicantLoading] = useState(false);
  const [cvUrl, setCvUrl] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [criteria, setCriteria] = useState(null);
  const [criteriaBusy, setCriteriaBusy] = useState(false);
  const [matches, setMatches] = useState({});
  const [matchBusy, setMatchBusy] = useState(false);

  useEffect(() => () => { if (cvUrl) { URL.revokeObjectURL(cvUrl); } }, [cvUrl]);

  async function inspectApplicant(id) {
    setApplicantId(id);
    setApplicantDetail(null);
    setApplicantError('');
    setApplicantLoading(true);
    setCvUrl(null);
    setPreviewOpen(false);
    try {
      const [detail, match] = await Promise.all([
        runAuthenticated((token) => jobApi.applicantDetail(token, id)),
        runAuthenticated((token) => jobApi.applicationMatch(token, id)),
      ]);
      setApplicantDetail(detail);
      if (match) {
        setMatches((current) => ({ ...current, [id]: match }));
      }
    } catch (cause) {
      setApplicantError(cause.message);
    } finally {
      setApplicantLoading(false);
    }
  }

  async function loadApplicantCv(download = false) {
    setCvLoading(true);
    setApplicantError('');
    try {
      const blob = await runAuthenticated((token) => jobApi.applicantCv(token, applicantId));
      const url = URL.createObjectURL(blob);
      if (download) {
        const link = document.createElement('a');
        link.href = url;
        link.download = applicantDetail.cvFileName || 'cv.pdf';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } else {
        setCvUrl(url);
        setPreviewOpen(true);
      }
    } catch (cause) {
      setApplicantError(cause.message);
    } finally {
      setCvLoading(false);
    }
  }

  const load = useCallback(async () => {
    const [companyItems, jobItems] = await Promise.all([
      runAuthenticated((token) => companyApi.mine(token)),
      runAuthenticated((token) => jobApi.mine(token)),
    ]);
    setCompanies(companyItems);
    setJobs(jobItems);
  }, [runAuthenticated]);

  useEffect(() => {
    let active = true;
    Promise.all([
      runAuthenticated((token) => companyApi.mine(token)),
      runAuthenticated((token) => jobApi.mine(token)),
    ]).then(([companyItems, jobItems]) => {
      if (active) {
        setCompanies(companyItems);
        setJobs(jobItems);
      }
    }).catch((cause) => {
      if (active) {
        setError(cause.message);
      }
    }).finally(() => {
      if (active) {
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [runAuthenticated]);

  function openForm(job = null) {
    setActiveJob(job);
    setView('form');
    setError('');
    setMessage('');
  }

  async function save(details) {
    setSaving(true);
    setError('');
    try {
      if (activeJob) {
        await runAuthenticated((token) => jobApi.update(token, activeJob.id, details));
      } else {
        await runAuthenticated((token) => jobApi.create(token, details));
      }
      await load();
      setView('list');
      setMessage(activeJob ? 'İlan güncellendi.' : 'İlan kaydedildi.');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSaving(false);
    }
  }

  async function archive() {
    if (!archiveTarget) {
      return;
    }
    setError('');
    try {
      await runAuthenticated((token) => jobApi.archive(token, archiveTarget.id));
      setJobs((items) => items.filter((item) => item.id !== archiveTarget.id));
      setArchiveTarget(null);
      setMessage('İlan arşivlendi.');
    } catch (cause) {
      setError(cause.message);
    }
  }

  async function openApplications(job) {
    setActiveJob(job);
    setApplications([]);
    setView('applications');
    setLoadingApplications(true);
    setError('');
    try {
      const [items, savedCriteria, savedMatches] = await Promise.all([
        runAuthenticated((token) => jobApi.applications(token, job.id)),
        runAuthenticated((token) => jobApi.matchCriteria(token, job.id)),
        runAuthenticated((token) => jobApi.jobMatches(token, job.id)),
      ]);
      setApplications(items);
      setCriteria(savedCriteria);
      setMatches(Object.fromEntries(savedMatches.map((result) => [result.applicationId, result])));
    } catch (cause) {
      setError(cause.message);
    } finally {
      setLoadingApplications(false);
    }
  }

  async function openCriteria(job) {
    setActiveJob(job);
    setCriteria(null);
    setView('criteria');
    setError('');
    setMessage('');
    setCriteriaBusy(true);
    try {
      setCriteria(await runAuthenticated((token) => jobApi.matchCriteria(token, job.id)));
    } catch (cause) {
      setError(cause.message);
    } finally {
      setCriteriaBusy(false);
    }
  }

  async function draftCriteria() {
    setCriteriaBusy(true);
    setError('');
    try {
      setCriteria(await runAuthenticated((token) => jobApi.draftMatchCriteria(token, activeJob.id)));
    } catch (cause) {
      setError(cause.message);
    } finally {
      setCriteriaBusy(false);
    }
  }

  async function saveCriteria(items) {
    setCriteriaBusy(true);
    setError('');
    try {
      setCriteria(await runAuthenticated((token) => jobApi.saveMatchCriteria(token, activeJob.id, items)));
      setMatches({});
      setMessage('İlan ölçütleri kaydedildi. Önceki eşleşmeler yeni sürüm için yeniden değerlendirilir.');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setCriteriaBusy(false);
    }
  }

  async function evaluateApplicant() {
    setMatchBusy(true);
    setApplicantError('');
    try {
      const result = await runAuthenticated((token) => jobApi.evaluateApplication(token, applicantId));
      setMatches((current) => ({ ...current, [applicantId]: result }));
    } catch (cause) {
      setApplicantError(cause.message);
    } finally {
      setMatchBusy(false);
    }
  }

  async function updateApplicationStatus(id, status) {
    setSavingStatus(id);
    setError('');
    try {
      const updated = await runAuthenticated((token) => jobApi.updateApplicationStatus(token, id, status));
      setApplications((items) => items.map((item) => item.id === id ? { ...item, ...updated } : item));
      setMessage('Başvuru aşaması güncellendi.');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSavingStatus(null);
    }
  }

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <div className="rounded-[28px] bg-[#243B64] p-7 text-white sm:p-9"><div className="flex items-center gap-3 text-[#9AD8CE]"><BriefcaseBusiness size={25} /><span className="text-sm font-bold uppercase tracking-widest">İşveren alanı</span></div><h1 className="mt-5 text-3xl font-bold">İş ilanlarım</h1><p className="mt-3 max-w-2xl text-[#D3DEEF]">Şirketin için ilan oluştur, yayımla ve gelen başvuruları takip et.</p></div>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {message && <p role="status" className="mt-6 rounded-xl bg-emerald-50 p-4 text-emerald-800">{message}</p>}
    {view === 'form' ? <div className="mt-7"><JobForm key={activeJob?.id ?? 'new'} companies={companies} initialJob={activeJob} onSave={save} onCancel={() => setView('list')} saving={saving} /></div>
      : view === 'criteria' ? <section className="mt-7 rounded-3xl border border-[#DFE6EE] bg-white p-6 shadow-sm sm:p-8">
        <button type="button" onClick={() => setView('list')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#5276A7]"><ArrowLeft size={17} /> İlanlara dön</button>
        <h2 className="mt-5 text-2xl font-bold text-[#243B64]">{activeJob.title} · Değerlendirme ölçütleri</h2>
        <p className="mt-2 text-sm text-[#718096]">Bu ilanın başvurularını değerlendirmeden önce ölçütleri burada belirleyebilirsin.</p>
        <MatchCriteriaPanel key={activeJob.id} criteria={criteria} busy={criteriaBusy} onDraft={draftCriteria} onSave={saveCriteria} />
      </section>
        : view === 'applications' ? <div className="mt-7"><ApplicationsPanel job={activeJob} applications={applications} loading={loadingApplications} savingStatus={savingStatus} onStatusChange={updateApplicationStatus} onInspect={inspectApplicant} onBack={() => setView('list')} matches={matches} /></div>
        : <section className="mt-7 rounded-3xl border border-[#DFE6EE] bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold text-[#243B64]">Yayımladığın ve taslak ilanların</h2><p className="mt-1 text-sm text-[#718096]">{loading ? 'Yükleniyor...' : `${jobs.length} ilan`}</p></div><button type="button" disabled={companies.length === 0} onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white disabled:opacity-50"><Plus size={18} /> Yeni ilan</button></div>
          {!loading && companies.length === 0 && <p className="mt-6 rounded-xl bg-amber-50 p-4 text-amber-800">İlan oluşturmadan önce Şirketim ekranından bir şirket eklemelisin.</p>}
          {!loading && jobs.length === 0 && <div className="mt-7 rounded-2xl border border-dashed border-[#D8E0EA] p-10 text-center text-[#718096]">Henüz ilan oluşturmadın. İlk ilanını taslak olarak hazırlayabilir veya onaylı şirketin için yayımlayabilirsin.</div>}
          <div className="mt-6 grid gap-4">{jobs.map((job) => <article key={job.id} className="rounded-2xl border border-[#DFE6EE] bg-[#F8FAFC] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-[#243B64]">{job.title}</h3><span className={`rounded-full px-3 py-1 text-xs font-semibold ${job.status === 'yayinda' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#E9EEF5] text-[#52627A]'}`}>{labels[job.status] ?? job.status}</span></div><p className="mt-2 text-sm text-[#52627A]">{job.companyName || companies.find((company) => company.id === job.companyId)?.name} · {labels[job.workModel]} · {labels[job.employmentType]}{job.location ? ` · ${job.location}` : ''}</p><p className="mt-1 text-xs text-[#8794A8]">Oluşturulma: {dateLabel(job.createdAt)} · Son başvuru: {dateLabel(job.applicationDeadline)}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => openApplications(job)} className="inline-flex items-center gap-1 rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64]"><Users size={16} /> Başvurular</button><button type="button" onClick={() => openCriteria(job)} className="rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64]">Ölçütler</button><button type="button" onClick={() => openForm(job)} className="rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64]">Düzenle</button><button type="button" onClick={() => setArchiveTarget(job)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Arşivle</button></div></div><p className="mt-4 line-clamp-2 whitespace-pre-wrap text-sm text-[#52627A]">{job.description}</p></article>)}</div>
        </section>}
    {archiveTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172640]/60 px-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) { setArchiveTarget(null); } }}><div role="dialog" aria-modal="true" aria-labelledby="archive-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 id="archive-title" className="text-xl font-bold text-[#243B64]">İlanı arşivle</h2><p className="mt-3 text-sm text-[#52627A]">“{archiveTarget.title}” ilanı listelerden kaldırılacak. Kaydı veritabanında korunacak.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setArchiveTarget(null)} className="rounded-xl border border-[#D8E0EA] px-4 py-2 font-semibold text-[#52627A]">Vazgeç</button><button type="button" onClick={archive} className="rounded-xl bg-red-700 px-4 py-2 font-semibold text-white">Arşivle</button></div></div></div>}
    {applicantId && <ApplicantDialog detail={applicantDetail} loading={applicantLoading} error={applicantError} cvLoading={cvLoading} onLoadCv={() => loadApplicantCv()} onDownloadCv={() => loadApplicantCv(true)} match={matches[applicantId]} matchBusy={matchBusy} onEvaluate={evaluateApplicant} criteriaReady={Boolean(criteria?.version)} criteria={criteria} onClose={() => { setApplicantId(null); setCvUrl(null); setPreviewOpen(false); }} />}
    {previewOpen && cvUrl && <CvPreviewDialog url={cvUrl} fileName={applicantDetail?.cvFileName || 'CV'} onDownload={() => loadApplicantCv(true)} onClose={() => setPreviewOpen(false)} />}
  </main>;
}

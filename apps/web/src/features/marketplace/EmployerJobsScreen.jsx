import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, Plus, Users } from 'lucide-react';
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
  gonderildi: 'Gönderildi', geri_cekildi: 'Geri çekildi',
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

function ApplicationsPanel({ job, applications, loading, onBack }) {
  return <section className="rounded-3xl border border-[#DFE6EE] bg-white p-6 shadow-sm sm:p-8">
    <button type="button" onClick={onBack} className="inline-flex items-center gap-2 text-sm font-semibold text-[#5276A7]"><ArrowLeft size={17} /> İlanlara dön</button>
    <h2 className="mt-5 text-2xl font-bold text-[#243B64]">{job.title} · Başvurular</h2>
    <p className="mt-2 text-sm text-[#718096]">Başvuru tarihi, durum ve adayın gönderdiği ön yazı burada görüntülenir.</p>
    {loading ? <p className="mt-8 text-[#718096]">Başvurular yükleniyor...</p> : applications.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-[#D8E0EA] p-8 text-center text-[#718096]">Bu ilana henüz başvuru yapılmadı.</div> : <div className="mt-6 space-y-4">{applications.map((application, index) => <article key={application.id} className="rounded-2xl border border-[#DFE6EE] bg-[#F8FAFC] p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-[#243B64]">{application.candidateName?.trim() || `Başvuru #${applications.length - index}`}</h3><span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#52627A]">{labels[application.status] ?? application.status}</span></div><p className="mt-2 text-sm text-[#718096]">{dateLabel(application.createdAt)} · {application.cvFileId ? 'CV seçildi' : 'CV eklenmedi'}</p><p className="mt-3 whitespace-pre-wrap text-sm text-[#334155]">{application.coverLetter || 'Ön yazı eklenmedi.'}</p></article>)}</div>}
  </section>;
}

export function EmployerJobsScreen({ runAuthenticated }) {
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeJob, setActiveJob] = useState(null);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [archiveTarget, setArchiveTarget] = useState(null);

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
      setApplications(await runAuthenticated((token) => jobApi.applications(token, job.id)));
    } catch (cause) {
      setError(cause.message);
    } finally {
      setLoadingApplications(false);
    }
  }

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <div className="rounded-[28px] bg-[#243B64] p-7 text-white sm:p-9"><div className="flex items-center gap-3 text-[#9AD8CE]"><BriefcaseBusiness size={25} /><span className="text-sm font-bold uppercase tracking-widest">İşveren alanı</span></div><h1 className="mt-5 text-3xl font-bold">İş ilanlarım</h1><p className="mt-3 max-w-2xl text-[#D3DEEF]">Şirketin için ilan oluştur, yayımla ve gelen başvuruları takip et.</p></div>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {message && <p role="status" className="mt-6 rounded-xl bg-emerald-50 p-4 text-emerald-800">{message}</p>}
    {view === 'form' ? <div className="mt-7"><JobForm key={activeJob?.id ?? 'new'} companies={companies} initialJob={activeJob} onSave={save} onCancel={() => setView('list')} saving={saving} /></div>
      : view === 'applications' ? <div className="mt-7"><ApplicationsPanel job={activeJob} applications={applications} loading={loadingApplications} onBack={() => setView('list')} /></div>
        : <section className="mt-7 rounded-3xl border border-[#DFE6EE] bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-bold text-[#243B64]">Yayımladığın ve taslak ilanların</h2><p className="mt-1 text-sm text-[#718096]">{loading ? 'Yükleniyor...' : `${jobs.length} ilan`}</p></div><button type="button" disabled={companies.length === 0} onClick={() => openForm()} className="inline-flex items-center gap-2 rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white disabled:opacity-50"><Plus size={18} /> Yeni ilan</button></div>
          {!loading && companies.length === 0 && <p className="mt-6 rounded-xl bg-amber-50 p-4 text-amber-800">İlan oluşturmadan önce Şirketim ekranından bir şirket eklemelisin.</p>}
          {!loading && jobs.length === 0 && <div className="mt-7 rounded-2xl border border-dashed border-[#D8E0EA] p-10 text-center text-[#718096]">Henüz ilan oluşturmadın. İlk ilanını taslak olarak hazırlayabilir veya onaylı şirketin için yayımlayabilirsin.</div>}
          <div className="mt-6 grid gap-4">{jobs.map((job) => <article key={job.id} className="rounded-2xl border border-[#DFE6EE] bg-[#F8FAFC] p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-[#243B64]">{job.title}</h3><span className={`rounded-full px-3 py-1 text-xs font-semibold ${job.status === 'yayinda' ? 'bg-emerald-100 text-emerald-800' : 'bg-[#E9EEF5] text-[#52627A]'}`}>{labels[job.status] ?? job.status}</span></div><p className="mt-2 text-sm text-[#52627A]">{job.companyName || companies.find((company) => company.id === job.companyId)?.name} · {labels[job.workModel]} · {labels[job.employmentType]}{job.location ? ` · ${job.location}` : ''}</p><p className="mt-1 text-xs text-[#8794A8]">Oluşturulma: {dateLabel(job.createdAt)} · Son başvuru: {dateLabel(job.applicationDeadline)}</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => openApplications(job)} className="inline-flex items-center gap-1 rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64]"><Users size={16} /> Başvurular</button><button type="button" onClick={() => openForm(job)} className="rounded-lg border border-[#CAD7E7] px-3 py-2 text-sm font-semibold text-[#243B64]">Düzenle</button><button type="button" onClick={() => setArchiveTarget(job)} className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-700">Arşivle</button></div></div><p className="mt-4 line-clamp-2 whitespace-pre-wrap text-sm text-[#52627A]">{job.description}</p></article>)}</div>
        </section>}
    {archiveTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#172640]/60 px-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setArchiveTarget(null); }}><div role="dialog" aria-modal="true" aria-labelledby="archive-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><h2 id="archive-title" className="text-xl font-bold text-[#243B64]">İlanı arşivle</h2><p className="mt-3 text-sm text-[#52627A]">“{archiveTarget.title}” ilanı listelerden kaldırılacak. Kaydı veritabanında korunacak.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setArchiveTarget(null)} className="rounded-xl border border-[#D8E0EA] px-4 py-2 font-semibold text-[#52627A]">Vazgeç</button><button type="button" onClick={archive} className="rounded-xl bg-red-700 px-4 py-2 font-semibold text-white">Arşivle</button></div></div></div>}
  </main>;
}

import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Eye, Filter, Search, Sparkles, Users } from 'lucide-react';
import { jobApi } from './jobApi.js';
import { ApplicantDialog, CvPreviewDialog } from './ApplicantDialogs.jsx';

const statusLabels = {
  gonderildi: 'Yeni başvuru', inceleniyor: 'İnceleniyor', mulakat: 'Mülakat aşamasında',
  teklif: 'Teklif aşaması', reddedildi: 'Reddedildi', geri_cekildi: 'Geri çekildi',
};
const nextStatuses = {
  gonderildi: ['inceleniyor', 'reddedildi'],
  inceleniyor: ['mulakat', 'reddedildi'],
  mulakat: ['teklif', 'reddedildi'],
};
const statusColors = {
  gonderildi: 'border-blue-200 bg-blue-50 text-blue-700',
  inceleniyor: 'border-amber-200 bg-amber-50 text-amber-800',
  mulakat: 'border-violet-200 bg-violet-50 text-violet-800',
  teklif: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  reddedildi: 'border-rose-200 bg-rose-50 text-rose-700',
  geri_cekildi: 'border-slate-200 bg-slate-50 text-slate-600',
};

function formatDate(value) {
  if (!value) {
    return 'Tarih belirtilmedi';
  }
  return new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(new Date(value));
}

function CandidateRow({ application, match, saving, onStatusChange, onInspect }) {
  const name = application.candidateName?.trim() || 'Aday';
  const matched = match?.evidence?.filter((item) => item.verdict === 'matched') ?? [];
  const options = nextStatuses[application.status] ?? [];
  return <tr className="border-t border-[#E7ECF2] align-top transition-colors hover:bg-[#FAFCFE]">
    <td className="px-5 py-5"><div className="flex min-w-48 items-start gap-3"><span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#243B64] text-sm font-bold text-white">{name.charAt(0).toLocaleUpperCase('tr-TR')}</span><div><p className="font-bold text-[#243B64]">{name}</p><p className="mt-1 text-xs text-[#7B8AA1]">{application.cvFileId ? 'CV eklendi' : 'CV eklenmedi'}</p></div></div></td>
    <td className="px-5 py-5"><p className="min-w-40 font-semibold text-[#29384F]">{application.jobTitle}</p><p className="mt-1 text-xs text-[#8795A9]">{formatDate(application.createdAt)}</p></td>
    <td className="px-5 py-5">{match ? <div><span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-bold ${match.score >= 70 ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}><Sparkles size={14} /> %{Math.min(100, Math.max(0, Number(match.score) || 0))}</span><p className="mt-1 text-[11px] text-[#8290A3]">Öneri puanı</p></div> : <span className="text-xs text-[#8290A3]">{application.cvFileId ? 'Değerlendirilmedi' : 'CV yok'}</span>}</td>
    <td className="px-5 py-5">{matched.length ? <div className="flex max-w-64 flex-wrap gap-1.5">{matched.slice(0, 2).map((item, index) => <span key={`${item.title}-${index}`} className="max-w-48 truncate rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800" title={item.title}>{item.title}</span>)}{matched.length > 2 && <span className="px-1 py-1 text-xs text-[#718096]">+{matched.length - 2}</span>}</div> : <span className="text-xs text-[#8290A3]">{match ? 'Tam eşleşen ölçüt yok' : 'Değerlendirme bekleniyor'}</span>}</td>
    <td className="px-5 py-5">{options.length ? <select aria-label={`${name} başvuru aşaması`} value={application.status} disabled={saving} onChange={(event) => onStatusChange(application.id, event.target.value)} className={`max-w-48 rounded-xl border px-3 py-2 text-xs font-semibold disabled:opacity-50 ${statusColors[application.status] ?? statusColors.gonderildi}`}><option value={application.status}>{statusLabels[application.status] ?? application.status}</option>{options.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select> : <span className={`inline-block rounded-xl border px-3 py-2 text-xs font-semibold ${statusColors[application.status] ?? statusColors.gonderildi}`}>{statusLabels[application.status] ?? application.status}</span>}</td>
    <td className="px-5 py-5"><button type="button" onClick={() => onInspect(application)} className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl border border-[#D8E2ED] bg-[#F3F6F9] px-3 py-2 text-sm font-semibold text-[#243B64] hover:bg-[#E8EEF5]"><Eye size={16} /> CV ve detay</button></td>
  </tr>;
}

export function EmployerCandidatesScreen({ runAuthenticated }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [matches, setMatches] = useState({});
  const [criteria, setCriteria] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [jobFilter, setJobFilter] = useState(() => new URLSearchParams(window.location.hash.split('?')[1] ?? '').get('job') ?? 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [matchBusy, setMatchBusy] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvUrl, setCvUrl] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savingStatus, setSavingStatus] = useState(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const employerJobs = await runAuthenticated((token) => jobApi.mine(token));
        const results = await Promise.all(employerJobs.map(async (job) => {
          const [items, jobMatches, jobCriteria] = await Promise.all([
            runAuthenticated((token) => jobApi.applications(token, job.id)),
            runAuthenticated((token) => jobApi.jobMatches(token, job.id)),
            runAuthenticated((token) => jobApi.matchCriteria(token, job.id)),
          ]);
          return { job, items, jobMatches, jobCriteria };
        }));
        if (active) {
          setJobs(employerJobs);
          setApplications(results.flatMap(({ job, items }) => items.map((item) => ({ ...item, jobTitle: job.title, jobId: job.id }))));
          setMatches(Object.fromEntries(results.flatMap(({ jobMatches }) => jobMatches.map((match) => [match.applicationId, match]))));
          setCriteria(Object.fromEntries(results.map(({ job, jobCriteria }) => [job.id, jobCriteria])));
        }
      } catch (cause) {
        if (active) {
          setError(cause.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    load();
    return () => { active = false; };
  }, [runAuthenticated]);

  useEffect(() => () => { if (cvUrl) { URL.revokeObjectURL(cvUrl); } }, [cvUrl]);

  const visible = useMemo(() => applications.filter((item) => {
    return (jobFilter === 'all' || item.jobId === jobFilter)
      && (statusFilter === 'all' || item.status === statusFilter)
      && (!search.trim() || `${item.candidateName ?? ''} ${item.jobTitle}`.toLocaleLowerCase('tr-TR').includes(search.trim().toLocaleLowerCase('tr-TR')));
  }).sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt)), [applications, jobFilter, statusFilter, search]);

  async function inspect(application) {
    setSelected(application);
    setDetail(null);
    setDetailError('');
    setDetailLoading(true);
    try {
      const candidate = await runAuthenticated((token) => jobApi.applicantDetail(token, application.id));
      setDetail(candidate);
    } catch (cause) {
      setDetailError(cause.message);
    } finally {
      setDetailLoading(false);
    }
  }

  async function updateStatus(id, status) {
    setSavingStatus(id);
    setError('');
    try {
      const updated = await runAuthenticated((token) => jobApi.updateApplicationStatus(token, id, status));
      setApplications((current) => current.map((item) => item.id === id ? { ...item, ...updated } : item));
      setMessage('Başvuru aşaması güncellendi.');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setSavingStatus(null);
    }
  }

  async function evaluate() {
    setMatchBusy(true);
    setDetailError('');
    try {
      const match = await runAuthenticated((token) => jobApi.evaluateApplication(token, selected.id));
      setMatches((current) => ({ ...current, [selected.id]: match }));
    } catch (cause) {
      setDetailError(cause.message);
    } finally {
      setMatchBusy(false);
    }
  }

  async function loadCv(download = false) {
    setCvLoading(true);
    setDetailError('');
    try {
      const blob = await runAuthenticated((token) => jobApi.applicantCv(token, selected.id));
      const url = URL.createObjectURL(blob);
      if (download) {
        const link = document.createElement('a');
        link.href = url;
        link.download = detail?.cvFileName || 'cv.pdf';
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      } else {
        setCvUrl(url);
        setPreviewOpen(true);
      }
    } catch (cause) {
      setDetailError(cause.message);
    } finally {
      setCvLoading(false);
    }
  }

  return <main className="mx-auto max-w-[1500px] px-5 py-9 sm:px-8">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2F8F83]">İşveren alanı</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-[#243B64]">Aday yönetimi</h1><p className="mt-2 text-sm text-[#718096]">Şirketinin ilanlarına gelen başvuruları tek ekrandan incele ve aşamalarını yönet.</p></div><div className="rounded-xl border border-[#DDE5ED] bg-white px-4 py-3 text-sm font-semibold text-[#243B64]"><Users size={17} className="mr-2 inline text-[#2F8F83]" />{applications.length} başvuru</div></div>
    {error && <p role="alert" className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {message && <p role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p>}
    <div className="mb-5 grid gap-3 rounded-2xl border border-[#DFE6EE] bg-white p-4 shadow-sm sm:grid-cols-[minmax(180px,1fr)_minmax(150px,220px)_minmax(150px,220px)]">
      <label className="relative"><Search size={18} className="absolute left-3 top-3 text-[#8391A4]" /><span className="sr-only">Aday veya ilan ara</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Aday veya ilan ara" className="w-full rounded-xl border border-[#D8E2ED] py-2.5 pl-10 pr-3 text-sm" /></label>
      <label className="relative"><BriefcaseBusiness size={17} className="absolute left-3 top-3 text-[#8391A4]" /><span className="sr-only">İlana göre filtrele</span><select value={jobFilter} onChange={(event) => setJobFilter(event.target.value)} className="w-full rounded-xl border border-[#D8E2ED] bg-white py-2.5 pl-10 pr-3 text-sm"><option value="all">Tüm ilanlar</option>{jobs.map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select></label>
      <label className="relative"><Filter size={17} className="absolute left-3 top-3 text-[#8391A4]" /><span className="sr-only">Aşamaya göre filtrele</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full rounded-xl border border-[#D8E2ED] bg-white py-2.5 pl-10 pr-3 text-sm"><option value="all">Tüm aşamalar</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>
    <section className="overflow-hidden rounded-2xl border border-[#DFE6EE] bg-white shadow-sm"><div className="flex items-center justify-between border-b border-[#E7ECF2] px-5 py-4"><h2 className="font-bold text-[#243B64]">Başvurular</h2><span className="text-xs text-[#8290A3]">{visible.length} sonuç</span></div>
      {loading ? <p className="p-10 text-center text-sm text-[#718096]">Başvurular yükleniyor...</p> : visible.length === 0 ? <p className="p-10 text-center text-sm text-[#718096]">{applications.length ? 'Bu filtrelere uygun başvuru bulunamadı.' : 'Henüz başvuru bulunmuyor.'}</p> : <div className="overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm"><thead className="bg-[#F7F9FC] text-[11px] font-bold uppercase tracking-wider text-[#6B7890]"><tr><th scope="col" className="px-5 py-4">Aday bilgileri</th><th scope="col" className="px-5 py-4">Başvurulan ilan</th><th scope="col" className="px-5 py-4">İlan uyumu</th><th scope="col" className="px-5 py-4">Eşleşen ölçütler</th><th scope="col" className="px-5 py-4">Başvuru durumu</th><th scope="col" className="px-5 py-4">İşlemler</th></tr></thead><tbody>{visible.map((application) => <CandidateRow key={application.id} application={application} match={matches[application.id]} saving={savingStatus === application.id} onStatusChange={updateStatus} onInspect={inspect} />)}</tbody></table></div>}
    </section>
    {selected && <ApplicantDialog detail={detail} loading={detailLoading} error={detailError} cvLoading={cvLoading} onLoadCv={() => loadCv()} onDownloadCv={() => loadCv(true)} onClose={() => { setSelected(null); setCvUrl(null); setPreviewOpen(false); }} match={matches[selected.id]} matchBusy={matchBusy} onEvaluate={evaluate} criteriaReady={Boolean(criteria[selected.jobId]?.version)} criteria={criteria[selected.jobId]} />}
    {previewOpen && cvUrl && <CvPreviewDialog url={cvUrl} fileName={detail?.cvFileName || 'CV'} onDownload={() => loadCv(true)} onClose={() => setPreviewOpen(false)} />}
  </main>;
}

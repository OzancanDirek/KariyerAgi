import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, CalendarDays, CheckCircle2, MapPin, Search } from 'lucide-react';
import { cvApi } from '../profile/api/cvApi.js';
import { jobApi } from './jobApi.js';

const workModels = { uzaktan: 'Uzaktan', hibrit: 'Hibrit', ofis: 'Ofis' };
const employmentTypes = { tam_zamanli: 'Tam zamanlı', yari_zamanli: 'Yarı zamanlı', staj: 'Staj', sozlesmeli: 'Sözleşmeli' };

function formatDate(value) {
  if (!value) {
    return 'Belirtilmedi';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Belirtilmedi' : new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium' }).format(date);
}

export function CandidateJobsScreen({ runAuthenticated, onOpenCvs }) {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('jobs');
  const [cvId, setCvId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function refresh() {
    const [published, mine, files] = await Promise.all([
      runAuthenticated(jobApi.published),
      runAuthenticated(jobApi.myApplications),
      runAuthenticated(cvApi.list),
    ]);
    setJobs(published);
    setApplications(mine);
    setCvs(files);
    setCvId((current) => current || files.find((file) => file.isPrimary)?.id || files[0]?.id || '');
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      runAuthenticated(jobApi.published),
      runAuthenticated(jobApi.myApplications),
      runAuthenticated(cvApi.list),
    ]).then(([published, mine, files]) => {
      if (!active) {
        return;
      }
      setJobs(published);
      setApplications(mine);
      setCvs(files);
      setCvId(files.find((file) => file.isPrimary)?.id || files[0]?.id || '');
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

  const visibleJobs = useMemo(() => jobs.filter((job) => {
    const text = `${job.title} ${job.companyName} ${job.location ?? ''}`.toLocaleLowerCase('tr-TR');
    return text.includes(search.trim().toLocaleLowerCase('tr-TR'));
  }), [jobs, search]);
  const activeApplication = selectedJob && applications.find((item) => item.jobId === selectedJob.id && item.status !== 'geri_cekildi');

  async function apply(event) {
    event.preventDefault();
    if (!selectedJob || busy) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      const created = await runAuthenticated((token) => jobApi.apply(token, selectedJob.id, {
        cvFileId: cvId || null,
        coverLetter: coverLetter.trim() || null,
      }));
      setApplications((items) => [created, ...items]);
      setNotice('Başvurun gönderildi.');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  async function withdraw(applicationId) {
    if (busy) {
      return;
    }
    setBusy(true);
    setError('');
    try {
      await runAuthenticated((token) => jobApi.withdraw(token, applicationId));
      setApplications((items) => items.map((item) => item.id === applicationId ? { ...item, status: 'geri_cekildi' } : item));
      setNotice('Başvurun geri çekildi.');
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }

  async function openJob(job) {
    setError('');
    setNotice('');
    try {
      const current = await runAuthenticated((token) => jobApi.get(token, job.id));
      if (current.status !== 'yayinda' || (current.applicationDeadline && new Date(current.applicationDeadline) <= new Date())) {
        setJobs((items) => items.filter((item) => item.id !== job.id));
        setError('Bu ilan artık başvuru kabul etmiyor.');
        return;
      }
      setSelectedJob(current);
      setView('detail');
    } catch (cause) {
      setError(cause.message);
      await refresh().catch(() => {});
    }
  }

  return <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
    <div className="rounded-[28px] bg-[#243B64] p-7 text-white sm:p-9"><div className="flex items-center gap-3 text-[#9AD8CE]"><BriefcaseBusiness size={25} /><span className="text-sm font-bold uppercase tracking-widest">Modül 06 · İş ilanları</span></div><h1 className="mt-5 text-3xl font-bold">İş fırsatları</h1><p className="mt-3 max-w-2xl text-[#D3DEEF]">Yayımdaki ilanları incele ve uygun pozisyonlara başvur.</p></div>
    <div className="mt-7 flex flex-wrap gap-2" role="tablist" aria-label="İş ilanları görünümü"><button type="button" role="tab" aria-selected={view !== 'applications'} onClick={() => { setView('jobs'); setSelectedJob(null); setError(''); }} className={`rounded-xl px-5 py-3 font-semibold ${view !== 'applications' ? 'bg-[#243B64] text-white' : 'border border-[#D8E0EA] bg-white text-[#243B64]'}`}>İlanlar</button><button type="button" role="tab" aria-selected={view === 'applications'} onClick={() => { setView('applications'); setError(''); }} className={`rounded-xl px-5 py-3 font-semibold ${view === 'applications' ? 'bg-[#243B64] text-white' : 'border border-[#D8E0EA] bg-white text-[#243B64]'}`}>Başvurularım ({applications.filter((item) => item.status !== 'geri_cekildi').length})</button></div>
    {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}{notice && <p role="status" className="mt-5 rounded-xl bg-emerald-50 p-4 text-emerald-800">{notice}</p>}
    {loading ? <p className="mt-8 text-[#718096]">İlanlar yükleniyor...</p> : view === 'applications' ? <section className="mt-6 space-y-4">{applications.length === 0 ? <p className="rounded-2xl border border-dashed border-[#D8E0EA] bg-white p-8 text-center text-[#718096]">Henüz başvurun yok.</p> : applications.map((item) => { const job = jobs.find((entry) => entry.id === item.jobId); return <article key={item.id} className="rounded-2xl border border-[#D8E0EA] bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-[#243B64]">{job?.title || 'Arşivlenmiş veya kapanmış ilan'}</h2><p className="mt-1 text-sm text-[#64748B]">{job?.companyName || `İlan kimliği: ${item.jobId}`} · {formatDate(item.createdAt)}</p><span className="mt-3 inline-block rounded-full bg-[#EEF3F8] px-3 py-1 text-sm text-[#243B64]">{{ gonderildi: 'Gönderildi', inceleniyor: 'İnceleniyor', mulakat: 'Mülakat', teklif: 'Teklif', reddedildi: 'Reddedildi', geri_cekildi: 'Geri çekildi' }[item.status] ?? item.status}</span></div>{['gonderildi', 'inceleniyor', 'mulakat', 'teklif'].includes(item.status) && <button type="button" disabled={busy} onClick={() => withdraw(item.id)} className="rounded-xl border border-red-200 px-4 py-2 font-semibold text-red-700 disabled:opacity-50">Başvuruyu geri çek</button>}</div></article>; })}</section>
      : view === 'detail' && selectedJob ? <section className="mt-6 rounded-3xl border border-[#D8E0EA] bg-white p-6 shadow-sm sm:p-8"><button type="button" onClick={() => setView('jobs')} className="inline-flex items-center gap-2 text-sm font-semibold text-[#5276A7]"><ArrowLeft size={17} /> İlanlara dön</button><h2 className="mt-6 text-3xl font-bold text-[#243B64]">{selectedJob.title}</h2><p className="mt-2 font-semibold text-[#5276A7]">{selectedJob.companyName}</p><div className="mt-5 flex flex-wrap gap-3 text-sm text-[#52627A]"><span className="flex items-center gap-1"><MapPin size={16} />{selectedJob.location || 'Konum belirtilmedi'}</span><span>{workModels[selectedJob.workModel]}</span><span>{employmentTypes[selectedJob.employmentType]}</span><span className="flex items-center gap-1"><CalendarDays size={16} />Son başvuru: {formatDate(selectedJob.applicationDeadline)}</span></div><div className="mt-6 whitespace-pre-wrap border-t border-[#E8EDF3] pt-6 leading-7 text-[#334155]">{selectedJob.description}</div><div className="mt-8 border-t border-[#E8EDF3] pt-6">{activeApplication ? <p className="flex items-center gap-2 font-semibold text-emerald-800"><CheckCircle2 size={19} /> Bu ilana başvurdun.</p> : <form onSubmit={apply} className="space-y-4"><h3 className="text-xl font-bold text-[#243B64]">Başvur</h3>{cvs.length === 0 ? <p className="text-sm text-[#64748B]">CV eklemeden de başvurabilirsin. CV yüklemek istersen <button type="button" onClick={onOpenCvs} className="font-semibold text-[#5276A7] underline">CV Dosyalarım</button> ekranına git.</p> : <label className="block max-w-xl text-sm font-semibold text-[#334155]">CV dosyası<select value={cvId} onChange={(event) => setCvId(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8E0EA] bg-white px-4 py-3"><option value="">CV ekleme</option>{cvs.map((file) => <option key={file.id} value={file.id}>{file.fileName || file.originalFileName || 'CV dosyası'}{file.isPrimary ? ' · Birincil' : ''}</option>)}</select></label>}<label className="block text-sm font-semibold text-[#334155]">Ön yazı (isteğe bağlı)<textarea maxLength={3000} rows={5} value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D8E0EA] px-4 py-3" placeholder="Bu pozisyona neden başvurduğunu anlat." /></label><button type="submit" disabled={busy} className="rounded-xl bg-[#243B64] px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Gönderiliyor...' : 'Başvuruyu gönder'}</button></form>}</div></section>
      : <section className="mt-6"><label className="flex max-w-xl items-center gap-3 rounded-xl border border-[#D8E0EA] bg-white px-4 py-3 text-[#718096]"><Search size={19} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pozisyon, şirket veya konum ara" aria-label="İlanlarda ara" className="w-full outline-none" /></label>{visibleJobs.length === 0 ? <p className="mt-5 rounded-2xl border border-dashed border-[#D8E0EA] bg-white p-8 text-center text-[#718096]">{jobs.length === 0 ? 'Şu anda yayında iş ilanı bulunmuyor.' : 'Aramana uygun ilan bulunamadı.'}</p> : <div className="mt-5 grid gap-4">{visibleJobs.map((job) => <article key={job.id} className="rounded-2xl border border-[#D8E0EA] bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-bold text-[#243B64]">{job.title}</h2><p className="mt-1 font-semibold text-[#5276A7]">{job.companyName}</p><p className="mt-3 text-sm text-[#64748B]">{job.location || 'Konum belirtilmedi'} · {workModels[job.workModel]} · {employmentTypes[job.employmentType]}</p><p className="mt-2 text-xs text-[#8794A8]">Son başvuru: {formatDate(job.applicationDeadline)}</p></div><button type="button" onClick={() => openJob(job)} className="rounded-xl bg-[#243B64] px-5 py-3 font-semibold text-white">İlanı incele</button></div><p className="mt-4 line-clamp-3 whitespace-pre-wrap text-sm text-[#52627A]">{job.description}</p></article>)}</div>}</section>}
  </main>;
}

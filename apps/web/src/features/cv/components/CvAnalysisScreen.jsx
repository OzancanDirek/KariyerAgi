import { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, BriefcaseBusiness, CheckCircle2, FileSearch, Lightbulb, LoaderCircle, Sparkles, TriangleAlert } from 'lucide-react';
import { cvApi } from '../../profile/api/cvApi.js';
import { cvAnalysisApi } from '../api/cvAnalysisApi.js';

function Findings({ title, items, icon: Icon, tone = 'teal' }) {
  if (!items?.length) {
    return null;
  }
  return <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm">
    <h2 className="flex items-center gap-2 text-lg font-semibold text-[#243B64]"><Icon size={20} className={tone === 'red' ? 'text-[#D35B55]' : 'text-[#2F8F83]'} />{title}</h2>
    <ul className="mt-5 space-y-3 border-t border-[#E3E7ED] pt-5 text-sm leading-6 text-[#52627A]">{items.map((item, index) => <li key={`${index}-${item}`} className="flex gap-3"><span className={tone === 'red' ? 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-[#D35B55]' : 'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8F5F2] text-xs font-bold text-[#2F8F83]'}>{tone === 'red' ? '!' : '✓'}</span><span>{item}</span></li>)}</ul>
  </section>;
}

function SummaryCard({ title, content, icon: Icon }) {
  return <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm">
    <h2 className="flex items-center gap-2 font-semibold text-[#243B64]"><Icon size={19} className="text-[#5276A7]" />{title}</h2>
    <p className="mt-4 border-t border-[#E3E7ED] pt-4 text-sm leading-7 text-[#52627A]">{content}</p>
  </section>;
}

function ScoreCard({ title, score, checks, accent }) {
  if (score == null) {
    return null;
  }
  return <section className="rounded-2xl border border-[#E3E7ED] bg-white p-5 shadow-sm">
    <h2 className="text-sm font-semibold text-[#667085]">{title}</h2>
    <div className="mt-3 flex items-end gap-1"><strong className="text-4xl font-bold text-[#243B64]">{score}</strong><span className="pb-1 text-sm text-[#8A96A8]">/ 100</span></div>
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E3E7ED]"><div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: accent }} /></div>
    {checks?.length > 0 && <details className="mt-4 text-xs text-[#52627A]"><summary className="cursor-pointer font-semibold text-[#5276A7]">Puan nasıl hesaplandı?</summary><ul className="mt-3 space-y-2">{checks.map((check) => <li key={check.label} className="flex justify-between gap-2"><span>{check.passed ? '✓' : '○'} {check.label}</span><span className="shrink-0 font-semibold">{check.passed ? `+${check.points}` : '0'}</span></li>)}</ul></details>}
  </section>;
}

export function CvAnalysisScreen({ runAuthenticated, onOpenCvs }) {
  const [files, setFiles] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    runAuthenticated(cvApi.list).then((result) => {
      if (!active) {
        return;
      }
      setFiles(result);
      setSelectedId((result.find((file) => file.isPrimary) || result[0])?.id || '');
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

  useEffect(() => {
    let active = true;
    runAuthenticated(cvAnalysisApi.getQuota).then((result) => {
      if (active) {
        setQuota(result);
      }
    }).catch((failure) => {
      if (active) {
        setError(failure.message);
      }
    });
    return () => { active = false; };
  }, [runAuthenticated]);

  useEffect(() => {
    if (!selectedId) {
      setAnalysis(null);
      return;
    }
    let active = true;
    setLoading(true);
    setError('');
    runAuthenticated((token) => cvAnalysisApi.getLatest(token, selectedId)).then((result) => {
      if (active) {
        setAnalysis(result);
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
  }, [selectedId, runAuthenticated]);

  async function analyze() {
    setAnalyzing(true);
    setError('');
    try {
      const result = await runAuthenticated((token) => cvAnalysisApi.analyze(token, selectedId));
      setAnalysis(result);
      runAuthenticated(cvAnalysisApi.getQuota).then(setQuota).catch(() => {});
    } catch (failure) {
      setError(failure.message);
      if (failure.status === 429) {
        runAuthenticated(cvAnalysisApi.getQuota).then(setQuota).catch(() => {});
      }
    } finally {
      setAnalyzing(false);
    }
  }

  const selectedFile = files.find((file) => file.id === selectedId);
  return <main className="mx-auto max-w-6xl px-5 py-8 text-[#202938] sm:px-8">
    <button type="button" onClick={onOpenCvs} className="inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#5276A7] hover:bg-white"><ArrowLeft size={17} />CV dosyalarıma dön</button>
    <div className="mt-5 rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-start gap-4"><span className="rounded-xl bg-[#E8F5F2] p-3 text-[#2F8F83]"><FileSearch size={25} /></span><div><span className="text-xs font-bold uppercase tracking-widest text-[#2F8F83]">Modül 03 · AI CV Merkezi</span><h1 className="mt-1 text-2xl font-bold text-[#243B64]">CV Analiz Raporu</h1><p className="mt-2 text-sm text-[#667085]">CV’ndeki beceri, eğitim ve deneyim bilgilerini incele. Öneriler yapay zekâ değerlendirmesidir.</p></div></div>
      {error && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {files.length > 0 && <div className="mt-7 border-t border-[#E3E7ED] pt-6"><div className="flex flex-wrap items-end gap-3"><label className="min-w-64 flex-1 text-sm font-semibold text-[#243B64]">Analiz edilecek CV<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className="mt-2 w-full rounded-xl border border-[#D6DEE9] bg-white px-4 py-3 text-sm font-normal text-[#202938]">{files.map((file) => <option key={file.id} value={file.id}>{file.fileName}{file.isPrimary ? ' · Birincil' : ''}</option>)}</select></label><button type="button" disabled={!selectedId || analyzing || quota?.remaining === 0} onClick={analyze} className="inline-flex items-center gap-2 rounded-xl bg-[#243B64] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1B2D4E] disabled:opacity-50">{analyzing ? <LoaderCircle size={17} className="animate-spin" /> : <Sparkles size={17} />}{analyzing ? 'Analiz ediliyor...' : analysis ? 'Yeniden analiz et' : 'CV’yi analiz et'}</button></div>{quota && <p className="mt-3 text-sm text-[#667085]">Bugün kalan analiz hakkı: <strong className="text-[#243B64]">{quota.remaining}/{quota.dailyLimit}</strong>{quota.remaining === 0 && ` · ${new Date(quota.resetsAt).toLocaleString('tr-TR')} tarihinde yenilenir.`}</p>}</div>}
    </div>
    {loading && <p className="mt-6 text-sm text-[#667085]">CV bilgileri yükleniyor...</p>}
    {!loading && files.length === 0 && <div className="mt-6 rounded-2xl border border-dashed border-[#D6DEE9] bg-white p-8 text-center"><p className="font-semibold text-[#243B64]">Analiz için önce CV yükle.</p><button type="button" onClick={onOpenCvs} className="mt-4 rounded-lg bg-[#243B64] px-4 py-2 text-sm font-semibold text-white">CV yükle</button></div>}
    {!loading && selectedFile && !analysis && <div className="mt-6 rounded-2xl border border-[#E3E7ED] bg-white p-8 text-center text-sm text-[#667085]">{selectedFile.fileName} için henüz analiz yapılmadı.</div>}
    {analysis && <div className="mt-6 space-y-5">
      {analysis.overallScore != null && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard title="Genel CV puanı" score={analysis.overallScore} accent="#243B64" />
        <ScoreCard title="ATS ayrıştırılabilirliği" score={analysis.atsScore} checks={analysis.scoreDetails?.atsChecks} accent="#2F8F83" />
        <ScoreCard title="Biçim ve düzen" score={analysis.formatScore} checks={analysis.scoreDetails?.formatChecks} accent="#5276A7" />
        <ScoreCard title="İçerik derinliği" score={analysis.contentScore} checks={analysis.scoreDetails?.contentChecks} accent="#805C9C" />
      </div>}
      <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2F8F83]">Analiz sonuçları</p>
        <h2 className="mt-2 text-xl font-bold text-[#243B64]">{selectedFile?.fileName || 'CV'} için değerlendirme</h2>
        <p className="mt-4 leading-7 text-[#202938]">{analysis.summary}</p>
        <p className="mt-5 border-t border-[#E3E7ED] pt-4 text-xs text-[#8A96A8]">{analysis.createdAt && !Number.isNaN(Date.parse(analysis.createdAt)) ? new Date(analysis.createdAt).toLocaleString('tr-TR') : 'Analiz tarihi belirtilmedi'} · {analysis.modelVersion}</p>
      </section>
      <div className="grid gap-5 lg:grid-cols-2"><Findings title="Güçlü yönler" items={analysis.strengths} icon={CheckCircle2} /><Findings title="Geliştirilmesi gereken alanlar" items={analysis.suggestions} icon={TriangleAlert} tone="red" /></div>
      <div className="grid gap-5 lg:grid-cols-2"><SummaryCard title="Deneyim" content={analysis.experienceSummary || 'CV’de deneyim bilgisi tespit edilmedi.'} icon={BriefcaseBusiness} /><SummaryCard title="Eğitim" content={analysis.educationSummary || 'CV’de eğitim bilgisi tespit edilmedi.'} icon={BookOpen} /></div>
      <section className="rounded-2xl border border-[#E3E7ED] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-[#243B64]"><Sparkles size={20} className="text-[#2F8F83]" />Tespit edilen beceriler {analysis.skills?.length ? `(${analysis.skills.length})` : ''}</h2>
        <p className="mt-1 text-sm text-[#7A8799]">CV içeriğinde geçen beceriler. Yetkinlik seviyesi ve doğrulama anlamına gelmez.</p>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-[#E3E7ED] pt-5">{analysis.skills?.length ? analysis.skills.map((skill) => <span key={skill} className="rounded-lg border border-[#CBE8E1] bg-[#E8F5F2] px-3 py-2 text-sm font-semibold text-[#27796F]">{skill}</span>) : <p className="text-sm text-[#667085]">Beceri tespit edilmedi.</p>}</div>
      </section>
      <div className="rounded-xl border border-[#D6E8E4] bg-[#F0F8F6] px-5 py-4 text-sm leading-6 text-[#38766D]"><Lightbulb size={18} className="mr-2 inline-block" />Puanlar CV için tanımlı ölçütlerden hesaplanır. ATS ayrıştırılabilirliği belirli bir şirketin filtresini geçme garantisi değildir. İlan eşleşmesi, şirket ilanlarıyla ayrıca hesaplanacaktır.</div>
    </div>}
  </main>;
}

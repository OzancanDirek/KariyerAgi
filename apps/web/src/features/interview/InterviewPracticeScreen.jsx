import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardPaste, MessageCircleQuestion, RotateCcw, Sparkles } from 'lucide-react';
import { interviewApi } from './interviewApi.js';

export function InterviewPracticeScreen({ runAuthenticated }) {
  const { t, i18n } = useTranslation();
  const [jobText, setJobText] = useState('');
  const [acknowledged, setAcknowledged] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  function reset() {
    setJobText(''); setAcknowledged(false); setQuestions([]); setAnswers([]);
    setIndex(0); setFeedback(null); setError('');
  }

  async function begin() {
    if (busy || !acknowledged || jobText.trim().length < 100 || jobText.trim().length > 10000) return;
    setBusy(true); setError('');
    try {
      const result = await runAuthenticated((token) => interviewApi.questions(token, jobText.trim(), i18n.language === 'en' ? 'en' : 'tr'));
      setQuestions(result.questions);
      setAnswers(Array(result.questions.length).fill(''));
      setIndex(0);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }

  async function next() {
    if (busy || answers[index]?.trim().length === 0) return;
    if (index < questions.length - 1) { setIndex(index + 1); return; }
    setBusy(true); setError('');
    try {
      const pairs = questions.map((question, position) => ({ question, answer: answers[position].trim() }));
      const result = await runAuthenticated((token) => interviewApi.review(token, jobText.trim(), pairs, i18n.language === 'en' ? 'en' : 'tr'));
      setFeedback(result);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }

  return <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
    <div className="rounded-[28px] bg-[#243B64] p-7 text-white sm:p-9">
      <div className="flex items-center gap-3 text-[#9AD8CE]"><MessageCircleQuestion size={25} /><span className="text-sm font-bold uppercase tracking-widest">{t('Mülakat provası')}</span></div>
      <h1 className="mt-5 text-3xl font-bold">{t('İlanına göre mülakata hazırlan')}</h1>
      <p className="mt-3 max-w-2xl text-[#D3DEEF]">{t('Herhangi bir iş ilanının metnini yapıştır, soruları yanıtla ve geliştirme önerilerini gör.')}</p>
    </div>
    {error && <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
    {questions.length === 0 ? <section className="mt-7 rounded-3xl border border-[#D8E0EA] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-3 text-[#243B64]"><ClipboardPaste size={22} /><h2 className="text-xl font-bold">{t('İlan metnini yapıştır')}</h2></div>
      <p className="mt-2 text-sm text-[#64748B]">{t('LinkedIn veya başka bir sitede gördüğün ilanı kopyalayabilirsin. Bağlantı yerine ilan metnini kullan.')}</p>
      <textarea value={jobText} onChange={(event) => setJobText(event.target.value)} maxLength={10000} rows={12} aria-label={t('İlan metni')} placeholder={t('Pozisyon, görevler ve aranan beceriler...')} className="mt-5 w-full resize-y rounded-2xl border border-[#CBD5E1] p-4 text-[#243B64] outline-none focus:border-[#2A9186]" />
      <p className="mt-1 text-right text-xs text-[#718096]">{jobText.trim().length}/10000 · {t('En az 100 karakter')}</p>
      <label className="mt-5 flex items-start gap-3 text-sm text-[#52627A]"><input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledged(event.target.checked)} className="mt-1" /><span>{t('İlan metni ve yanıtlarımın prova için Gemini’ye gönderileceğini anladım. Bunlar CareerPath veritabanına kaydedilmeyecek; bu sayfadan ayrılınca uygulama belleğinden silinecek.')}</span></label>
      <button type="button" onClick={begin} disabled={busy || !acknowledged || jobText.trim().length < 100} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#243B64] px-6 py-3 font-semibold text-white disabled:opacity-50"><Sparkles size={18} />{busy ? t('Sorular hazırlanıyor...') : t('Provayı başlat')}</button>
    </section> : feedback ? <section className="mt-7 space-y-5">
      <div className="rounded-2xl border border-[#BCE3D9] bg-[#EAF7F3] p-6"><h2 className="text-xl font-bold text-[#176E64]">{t('Prova tamamlandı')}</h2><p className="mt-2 text-[#315A56]">{feedback.summary}</p></div>
      {questions.map((question, position) => <article key={position} className="rounded-2xl border border-[#D8E0EA] bg-white p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#2A9186]">{t('Soru')} {position + 1}</p><h3 className="mt-2 text-lg font-bold text-[#243B64]">{question}</h3><p className="mt-3 whitespace-pre-wrap text-sm text-[#52627A]">{answers[position]}</p><div className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-emerald-50 p-4"><p className="font-bold text-emerald-800">{t('Güçlü yan')}</p><p className="mt-2 text-sm text-emerald-950">{feedback.feedback[position]?.strength}</p></div><div className="rounded-xl bg-amber-50 p-4"><p className="font-bold text-amber-800">{t('Geliştirilecek nokta')}</p><p className="mt-2 text-sm text-amber-950">{feedback.feedback[position]?.improvement}</p></div><div className="rounded-xl bg-blue-50 p-4"><p className="font-bold text-blue-800">{t('Öneri')}</p><p className="mt-2 text-sm text-blue-950">{feedback.feedback[position]?.suggestion}</p></div></div></article>)}
      <button type="button" onClick={reset} className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 font-semibold text-[#243B64]"><RotateCcw size={17} />{t('Yeni prova')}</button>
    </section> : <section className="mt-7 rounded-3xl border border-[#D8E0EA] bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-bold text-[#2A9186]">{t('Soru')} {index + 1} / {questions.length}</p><div className="mt-3 h-2 rounded-full bg-[#E9EEF5]"><div className="h-2 rounded-full bg-[#2A9186]" style={{ width: `${((index + 1) / questions.length) * 100}%` }} /></div>
      <h2 className="mt-7 text-2xl font-bold text-[#243B64]">{questions[index]}</h2>
      <label htmlFor="interview-answer" className="mt-6 block font-semibold text-[#243B64]">{t('Yanıtın')}</label>
      <textarea id="interview-answer" value={answers[index] || ''} onChange={(event) => setAnswers((current) => current.map((answer, position) => position === index ? event.target.value : answer))} maxLength={3000} rows={7} className="mt-3 w-full resize-y rounded-2xl border border-[#CBD5E1] p-4 outline-none focus:border-[#2A9186]" placeholder={t('Yanıtını buraya yaz...')} />
      <div className="mt-5 flex flex-wrap gap-3">{index > 0 && <button type="button" onClick={() => setIndex(index - 1)} className="rounded-xl border border-[#CBD5E1] px-5 py-3 font-semibold text-[#243B64]">{t('Önceki soru')}</button>}<button type="button" onClick={next} disabled={busy || !answers[index]?.trim()} className="rounded-xl bg-[#243B64] px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? t('Değerlendiriliyor...') : index === questions.length - 1 ? t('Yanıtlarımı değerlendir') : t('Sonraki soru')}</button></div>
    </section>}
  </main>;
}

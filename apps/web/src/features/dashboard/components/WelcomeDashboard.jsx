import { ArrowRight, CheckCircle2, Target, UserRound } from 'lucide-react';

export function WelcomeDashboard({ user, onOpenProfile, onOpenGoals }) {
  return (
    <div className="text-[#202938]">
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#EBF5F4] px-4 py-2 text-sm font-medium text-[#27796F]"><CheckCircle2 size={17} />Oturumun açık</div>
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-[#243B64] md:text-5xl">CareerPath’e hoş geldin.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#667085]">Profilini ve kariyer hedeflerini buradan yönetebilirsin.</p>
        <section className="mt-12 grid gap-6 md:grid-cols-[1.25fr_1fr]">
          <div className="rounded-2xl border border-[#E3E7ED] bg-white p-7 shadow-sm">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2F6] text-[#243B64]"><UserRound size={22} /></div>
            <h2 className="text-xl font-semibold">Hesap bilgilerin</h2>
            <p className="mt-3 text-sm text-[#667085]">Giriş yaptığın hesap</p>
            <p className="mt-1 break-all font-medium">{user?.email}</p>
            <button type="button" onClick={onOpenProfile} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#243B64] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1B2D4E]">Bilgilerimi görüntüle <ArrowRight size={16} /></button>
          </div>
          <div className="rounded-2xl bg-[#243B64] p-7 text-white shadow-sm">
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10"><Target size={22} /></div><span className="text-sm font-medium text-[#AFC7DC]">Kariyer planın</span>
            <h2 className="mt-4 text-xl font-semibold">Kariyer hedeflerin</h2>
            <p className="mt-3 text-sm leading-6 text-[#D5E0EC]">Hedef unvanını, sektörünü, çalışma modeli ve konum tercihlerini görüntüle.</p>
            <button type="button" onClick={onOpenGoals} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#243B64] hover:bg-[#E8EEF5]">Hedeflerimi görüntüle <ArrowRight size={16} /></button>
          </div>
        </section>
      </main>
    </div>
  );
}

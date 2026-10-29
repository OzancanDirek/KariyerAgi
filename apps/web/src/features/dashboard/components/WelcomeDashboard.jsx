import { ArrowRight, CheckCircle2, LogOut, UserRound } from 'lucide-react';
import { Logo } from '../../../shared/ui/Logo.jsx';

export function WelcomeDashboard({ user, onOpenProfile, onLogout }) {
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#202938]">
      <header className="border-b border-[#E3E7ED] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Logo size="md" />
          <button type="button" onClick={onLogout} className="inline-flex items-center gap-2 rounded-lg border border-[#E3E7ED] px-4 py-2 text-sm font-medium text-[#243B64] hover:bg-[#F7F8FA]"><LogOut size={16} />Çıkış yap</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12 md:py-20">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#EBF5F4] px-4 py-2 text-sm font-medium text-[#27796F]"><CheckCircle2 size={17} />Oturumun açık</div>
        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-[#243B64] md:text-5xl">CareerPath’e hoş geldin.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#667085]">Hesabın hazır. Kariyer profili, CV ve beceri modüllerini sırayla gerçek verilerle geliştireceğiz.</p>
        <section className="mt-12 grid gap-6 md:grid-cols-[1.25fr_1fr]">
          <div className="rounded-2xl border border-[#E3E7ED] bg-white p-7 shadow-sm">
            <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2F6] text-[#243B64]"><UserRound size={22} /></div>
            <h2 className="text-xl font-semibold">Hesap bilgilerin</h2>
            <p className="mt-3 text-sm text-[#667085]">Giriş yaptığın hesap</p>
            <p className="mt-1 break-all font-medium">{user?.email}</p>
            <button type="button" onClick={onOpenProfile} className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#243B64] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1B2D4E]">Bilgilerimi görüntüle <ArrowRight size={16} /></button>
          </div>
          <div className="rounded-2xl bg-[#243B64] p-7 text-white shadow-sm">
            <span className="text-sm font-medium text-[#AFC7DC]">Sıradaki adım</span>
            <h2 className="mt-4 text-xl font-semibold">Kişisel bilgilerini tamamla</h2>
            <p className="mt-3 text-sm leading-6 text-[#D5E0EC]">Ad, soyad, telefon ve konum bilgilerini profil ekranında görüntüleyip güncelleyebilirsin.</p>
          </div>
        </section>
      </main>
    </div>
  );
}

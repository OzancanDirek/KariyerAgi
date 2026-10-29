import { Building2, User } from 'lucide-react';
import { BrandPanel } from './BrandPanel.jsx';
import { Logo } from './Logo.jsx';

export function AuthFrame({ isEmployer, onToggleEmployer, switchLabel, heading, supportingText, brandHeading, brandText, footer, children }) {
  return (
    <main className="auth-page flex min-h-screen items-center justify-center p-3 sm:p-6 lg:p-10">
      <div className="auth-card grid w-full max-w-6xl grid-cols-1 overflow-hidden rounded-2xl border border-[#DCE4EC] bg-white lg:min-h-[690px] lg:grid-cols-12 lg:rounded-[28px]">
        <div className="hidden lg:col-span-5 lg:block">
          <BrandPanel heading={brandHeading} supportingText={brandText} />
        </div>

        <section className="flex flex-col justify-between bg-white p-6 sm:p-10 lg:col-span-7 lg:p-12 xl:p-14">
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Logo size="md" showSubtitle />
            </div>

            <div className="mb-8 flex items-center justify-between gap-3 border-b border-[#E3E7ED] pb-5">
              <span className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#5276A7]">
                <span className="h-2 w-2 rounded-full bg-[#2F8F83] shadow-[0_0_0_4px_#EBF5F4]" />
                {isEmployer ? 'İŞVEREN PORTALI' : 'KARİYER PORTALI'}
              </span>
              <button type="button" onClick={onToggleEmployer} className="auth-switch inline-flex items-center gap-2 rounded-lg border border-[#DCE4EC] bg-[#F7F8FA] px-3 py-2 text-xs font-semibold text-[#243B64] transition-colors hover:border-[#AFC2D3] hover:bg-[#EEF2F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F8F83]">
                {isEmployer ? <User size={15} /> : <Building2 size={15} />}
                <span>{switchLabel}</span>
              </button>
            </div>

            <div className="mb-7">
              <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-[#202938] sm:text-[2rem]">{heading}</h1>
              <p className="mt-2 text-sm leading-relaxed text-[#667085]">{supportingText}</p>
            </div>

            {children}
          </div>

          <div className="mx-auto mt-9 w-full max-w-md border-t border-[#EEF2F6] pt-5 text-center text-xs text-[#667085]">{footer}</div>
        </section>
      </div>
    </main>
  );
}

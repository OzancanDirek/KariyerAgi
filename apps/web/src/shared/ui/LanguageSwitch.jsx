import { useTranslation } from 'react-i18next';

export function LanguageSwitch() {
  const { i18n } = useTranslation();
  return <div className="inline-flex rounded-lg border border-[#D9E1EB] bg-white p-1 text-xs font-bold" role="group" aria-label="Language / Dil">
    {['tr', 'en'].map((language) => <button key={language} type="button" lang={language} aria-pressed={i18n.language === language} onClick={() => i18n.changeLanguage(language)} className={`rounded-md px-2.5 py-1.5 ${i18n.language === language ? 'bg-[#243B64] text-white' : 'text-[#52627A] hover:bg-[#F2F5F8]'}`}>{language.toUpperCase()}</button>)}
  </div>;
}

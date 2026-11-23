import i18n from '../../../i18n.js';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { AuthFrame } from '../../../shared/ui/AuthFrame.jsx';
import { FormInput } from '../../../shared/ui/FormInput.jsx';
import { Button } from '../../../shared/ui/Button.jsx';
import { useTranslation } from 'react-i18next';

export function LoginScreen({ onNavigate, onLogin, notice }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = t('E-posta adresi gereklidir.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = t('Geçerli bir e-posta adresi girin.');
    }

    if (!password) {
      nextErrors.password = t('Şifre gereklidir.');
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      await onLogin({ email: email.trim(), password }, rememberMe);
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFrame
      isEmployer={false}
      heading={i18n.t("Tekrar hoş geldin")}
      supportingText={i18n.t("Hesabına giriş yap. Aday veya işveren alanın hesap türüne göre açılır.")}
      brandHeading={t("Kariyer yolculuğuna kaldığın yerden devam et.")}
      brandText={t("Becerilerini keşfet, gelişimini takip et ve hedeflerine uygun fırsatlara ulaş.")}
      footer={<>{t("Hesabın yok mu?")}{' '}<button type="button" onClick={() => onNavigate('register')} className="font-semibold text-[#243B64] underline-offset-4 hover:underline">{t("Hesap oluştur")}</button></>}
    >

            {notice && <p role="status" className="mb-4 rounded-lg border border-[#2F8F83]/30 bg-[#EBF5F4] p-3 text-sm text-[#27796F]">{notice}</p>}
            {errors.general && <p role="alert" className="mb-4 flex items-center gap-2 rounded-lg border border-[#C74747]/30 bg-[#FDF2F2] p-3 text-sm text-[#C74747]"><AlertCircle size={16} />{errors.general}</p>}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <FormInput label={t('E-posta adresi')} id="login-email" type="email" autoComplete="email" required value={email} onChange={(event) => { setEmail(event.target.value); setErrors((current) => ({ ...current, email: undefined, general: undefined })); }} error={errors.email} placeholder="example@university.edu" />
              <FormInput label={t("Şifre")} id="login-password" isPassword autoComplete="current-password" required value={password} onChange={(event) => { setPassword(event.target.value); setErrors((current) => ({ ...current, password: undefined, general: undefined })); }} error={errors.password} placeholder="••••••••" />
              <label className="flex items-center gap-2 text-xs text-[#202938]">
                <input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} className="h-4 w-4 accent-[#243B64]" />
                {t("Beni hatırla")}
              </label>
              <button type="button" onClick={() => onNavigate('forgot-password')} className="text-sm font-semibold text-[#5276A7] underline-offset-4 hover:underline">{t("Şifremi unuttum")}</button>
              <Button type="submit" variant="primary" isLoading={isLoading} className="auth-submit mt-2 w-full">{t("Giriş Yap")}</Button>
            </form>
    </AuthFrame>
  );
}

import i18n from '../../i18n.js';
import englishErrors from '../../locales/en.errors.json';

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function request(resource, path, { method = 'GET', body, formData, token, responseType = 'json' } = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE}/api/${resource}/${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...(formData ? { body: formData } : {}),
    });
  } catch {
    throw new Error(i18n.t('Sunucuya ulaşılamıyor. API’nin çalıştığını kontrol edin.'));
  }

  if (!response.ok) {
    const result = await response.json().catch(() => ({}));
    const fallback = response.status === 404
      ? 'API bu işlemi tanımıyor. Backend uygulamasını güncel kodla yeniden başlatın.'
      : 'İşlem tamamlanamadı. Lütfen tekrar deneyin.';
    const message = i18n.language === 'en' && englishErrors[result.code]
      ? englishErrors[result.code]
      : i18n.t(result.message || result.error || fallback);
    const error = new Error(message);
    error.status = response.status;
    error.code = result.code;
    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  if (responseType === 'blob') {
    return response.blob();
  }

  return response.json();
}

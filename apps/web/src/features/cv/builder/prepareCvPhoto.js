const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_DATA_URL_LENGTH = 90000;

export async function prepareCvPhoto(file) {
  if (!file || !['image/jpeg', 'image/png'].includes(file.type)) {
    throw new Error(i18n.t('CV fotoğrafı JPG veya PNG olmalı.'));
  }
  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(i18n.t('Fotoğraf en fazla 20 MB olabilir.'));
  }
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 360 / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error(i18n.t('Fotoğraf işlenemedi.'));
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.82, 0.68, 0.5, 0.35]) {
      const result = canvas.toDataURL('image/jpeg', quality);
      if (result.length <= MAX_DATA_URL_LENGTH) return result;
    }
    throw new Error(i18n.t('Fotoğraf küçültülemedi. Daha küçük bir fotoğraf seç.'));
  } finally {
    bitmap.close();
  }
}
import i18n from '../../../i18n.js';


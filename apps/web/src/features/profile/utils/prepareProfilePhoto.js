const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_SIDE = 1600;
const SUPPORTED_TYPES = new Set(['image/jpeg', 'image/png']);

export function photoSelectionError(file) {
  if (!file || !SUPPORTED_TYPES.has(file.type)) {
    return 'JPG veya PNG biçiminde bir fotoğraf seçin.';
  }

  if (file.size > MAX_SOURCE_BYTES) {
    return 'Fotoğraf en fazla 20 MB olabilir. Daha küçük bir dosya seçin.';
  }

  return '';
}

function exportJpeg(canvas, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, 'image/jpeg', quality);
  });
}

export async function prepareProfilePhoto(file) {
  const validationError = photoSelectionError(file);
  if (validationError) {
    throw new Error(validationError);
  }

  if (file.size <= MAX_UPLOAD_BYTES) {
    return { file, optimized: false };
  }

  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Fotoğraf işlenemedi. Başka bir dosya deneyin.');
    }

    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.85, 0.72, 0.6]) {
      const blob = await exportJpeg(canvas, quality);
      if (blob && blob.size <= MAX_UPLOAD_BYTES) {
        const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
        return { file: new File([blob], name, { type: 'image/jpeg' }), optimized: true };
      }
    }
  } catch (error) {
    if (error.message === 'Fotoğraf işlenemedi. Başka bir dosya deneyin.') {
      throw error;
    }
    throw new Error('Fotoğraf işlenemedi. JPG veya PNG dosyası seçin.');
  } finally {
    bitmap?.close();
  }

  throw new Error('Fotoğraf otomatik olarak küçültülemedi. Daha küçük bir fotoğraf seçin.');
}

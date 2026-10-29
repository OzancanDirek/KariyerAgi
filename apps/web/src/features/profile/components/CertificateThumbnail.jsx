import { useEffect, useRef, useState } from 'react';
import { Award } from 'lucide-react';
import { certificateApi } from '../api/certificateApi.js';

export function CertificateThumbnail({ certificate, runAuthenticated }) {
  const [imageUrl, setImageUrl] = useState(null);
  const authRef = useRef(runAuthenticated);
  authRef.current = runAuthenticated;

  useEffect(() => {
    setImageUrl(null);
    if (!certificate.hasDocument || !/\.(jpe?g|png)$/i.test(certificate.documentFileName || '')) {
      return;
    }

    let active = true;
    let objectUrl = null;
    authRef.current((token) => certificateApi.downloadDocument(token, certificate.id))
      .then((blob) => {
        if (!active || !['image/jpeg', 'image/png'].includes(blob.type)) {
          return;
        }
        objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      })
      .catch(() => {
        if (active) {
          setImageUrl(null);
        }
      });

    return () => {
      active = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [certificate]);

  return <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E5EBF2] bg-[#EFF4FA] text-[#31527F]">
    {imageUrl ? <img src={imageUrl} alt={`${certificate.name} sertifika görseli`} className="h-full w-full object-contain bg-white" /> : <Award size={26} />}
  </div>;
}

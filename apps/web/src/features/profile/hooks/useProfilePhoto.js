import { useEffect, useRef, useState } from 'react';
import { profileApi } from '../api/profileApi.js';

export function useProfilePhoto(profile, runAuthenticated, selectedFile = null) {
  const [source, setSource] = useState('');
  const authenticated = useRef(runAuthenticated);
  authenticated.current = runAuthenticated;

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setSource(url);
      return () => URL.revokeObjectURL(url);
    }

    if (!profile?.hasUploadedPhoto) {
      setSource(profile?.photoUrl || '');
      return undefined;
    }

    let active = true;
    let url = '';
    authenticated.current(profileApi.downloadPhoto).then((blob) => {
      if (active) {
        url = URL.createObjectURL(blob);
        setSource(url);
      }
    }).catch(() => {
      if (active) {
        setSource('');
      }
    });
    return () => {
      active = false;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [profile?.hasUploadedPhoto, profile?.photoUrl, profile?.photoVersion, selectedFile]);

  return source;
}

import { request } from '../../../shared/api/request.js';

function toAnalysis(record) {
  if (!record) {
    return null;
  }

  return {
    id: record.id,
    cvFileId: record.cv_dosyasi_id,
    modelVersion: record.model_surumu,
    summary: record.ozet,
    skills: record.beceriler ?? [],
    educationSummary: record.egitim_ozeti,
    experienceSummary: record.deneyim_ozeti,
    strengths: record.guclu_yonler ?? [],
    suggestions: record.oneriler ?? [],
    createdAt: record.olusturma_tarihi,
    inputMethod: record.girdi_yontemi,
    atsScore: record.ats_skoru,
    formatScore: record.bicim_skoru,
    contentScore: record.icerik_skoru,
    overallScore: record.genel_skor,
    scoreDetails: record.puan_detaylari,
  };
}

export const cvAnalysisApi = {
  getQuota(token) {
    return request('cv', 'analysis/quota', { token });
  },
  async getLatest(token, cvFileId) {
    return toAnalysis(await request('cv', `${cvFileId}/analysis`, { token }));
  },
  async analyze(token, cvFileId) {
    return toAnalysis(await request('cv', `${cvFileId}/analysis`, { method: 'POST', token }));
  },
};

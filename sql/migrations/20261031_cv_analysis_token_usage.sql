alter table public.cv_analizleri
  add column if not exists girdi_token_sayisi integer not null default 0,
  add column if not exists cikti_token_sayisi integer not null default 0,
  add column if not exists toplam_token_sayisi integer not null default 0,
  add column if not exists gorsel_token_sayisi integer not null default 0,
  add column if not exists girdi_yontemi text not null default 'unknown';

comment on column public.cv_analizleri.girdi_token_sayisi is 'Gemini usageMetadata.promptTokenCount';
comment on column public.cv_analizleri.cikti_token_sayisi is 'Gemini usageMetadata.candidatesTokenCount';
comment on column public.cv_analizleri.toplam_token_sayisi is 'Gemini usageMetadata.totalTokenCount';
comment on column public.cv_analizleri.gorsel_token_sayisi is 'Gemini usageMetadata.promptTokensDetails IMAGE tokenCount';
comment on column public.cv_analizleri.girdi_yontemi is 'pdf_document veya pdf_text; eski DOCX analizleri docx_text olabilir';

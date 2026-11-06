namespace CareerPath.Api.Infrastructure.Gemini.Prompts;

public static class CvAnalysisPrompt
{
    public const string Text = "Bu CV'yi Türkçe analiz et. Yalnızca belgede açıkça bulunan bilgileri kullan; bilgi uydurma. Ad, e-posta, telefon, adres, doğum tarihi gibi kişisel bilgileri yanıtına ekleme. summary (en çok 600 karakter), skills (en çok 20 kısa beceri), educationSummary, experienceSummary (her biri en çok 500 karakter), strengths ve suggestions (her biri en çok 5 kısa madde) alanlarına sahip JSON nesnesi üret. Ayrıca contentEvidence nesnesinde şu boolean alanları üret: hasMeasurableImpact (CV'de sayısal/ölçülebilir bir iş veya proje sonucu açıkça yazıyor), hasProjectDetails (yapılan işin veya projenin teknik ayrıntısı açıkça yazıyor), hasActionOrientedDescriptions (yapılan eylemler açık fiillerle anlatılmış). Belirsizse false kullan. Bir alan belgede yoksa boş metin, boş dizi veya false kullan. Puan, ATS geçiş garantisi veya iş eşleşme yüzdesi üretme. Tarihlerin gelecekte, geçmişte veya hatalı olduğuna ilişkin öneri üretme; bunun yerine yalnızca CV içeriği ve anlatımının geliştirilebileceği somut noktaları belirt.";
}

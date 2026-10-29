import { useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  ExternalLink,
  Bookmark,
  Star,
  CheckCircle2,
  Plus,
  Compass,
  Globe
} from "lucide-react";
import { initialLearningResources } from "../../data/roadmapData.js";
const LearningRecommendationsView = ({
  user,
  resources = initialLearningResources,
  onNavigate,
  onAddTaskToPlan
}) => {
  const [resourceList, setResourceList] = useState(
    resources.length > 0 ? resources : initialLearningResources
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [addedNotice, setAddedNotice] = useState(null);
  const categories = [
    { id: "all", label: "T\xFCm Kaynaklar" },
    { id: "frontend", label: "\xD6n Y\xFCz & Full-Stack" },
    { id: "programming", label: "Programlama Dili" },
    { id: "devops", label: "DevOps & Bulut" },
    { id: "database", label: "Veri Taban\u0131" },
    { id: "design", label: "Tasar\u0131m & UI/UX" }
  ];
  const getDomainFromUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "link";
    }
  };
  const handleToggleBookmark = (resourceId) => {
    setResourceList(
      (prev) => prev.map(
        (r) => r.id === resourceId ? { ...r, isBookmarked: !r.isBookmarked } : r
      )
    );
  };
  const handleAddToPlan = (res) => {
    if (onAddTaskToPlan) {
      onAddTaskToPlan(`${res.title} (${res.provider})`, res.relatedSkill);
    }
    setAddedNotice(`"${res.title}" haftal\u0131k geli\u015Fim plan\u0131n\u0131za eklendi.`);
    setTimeout(() => setAddedNotice(null), 3e3);
  };
  const filteredResources = useMemo(() => {
    return resourceList.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.provider.toLowerCase().includes(searchQuery.toLowerCase()) || item.relatedSkill.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
      const matchesDifficulty = difficultyFilter === "all" || item.difficulty === difficultyFilter;
      const matchesPrice = priceFilter === "all" || priceFilter === "free" && item.isFree || priceFilter === "paid" && !item.isFree;
      const matchesBookmark = !onlyBookmarked || item.isBookmarked;
      return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice && matchesBookmark;
    });
  }, [
    resourceList,
    searchQuery,
    categoryFilter,
    difficultyFilter,
    priceFilter,
    onlyBookmarked
  ]);
  return <div className="p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {
    /* 1. Header (F-Pattern Anchor) */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5276A7]">
              <span>MODÜL 05</span>
              <span>·</span>
              <span>EĞİTİM & KAYNAK ÖNERİLERİ</span>
              <span>·</span>
              <span className="text-[#2F8F83] font-bold">GERÇEK BAĞLANTILAR AKTİF</span>
            </div>
            <h1 className="text-2xl font-bold text-[#202938] mt-1">
              Hedef Odaklı Eğitim ve Kaynak Önerileri
            </h1>
            <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
              Knowledge Graph ve Yol Haritası aşamalarınızdaki eksiklikler için derlenmiş resmi
              eğitimler. Kartlardaki bağlantılara tıklayarak doğrudan gerçek eğitim sitelerine gidebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
    type="button"
    onClick={() => onNavigate("career-roadmap")}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#243B64] bg-[#EEF2F6] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded-lg transition-colors cursor-pointer"
  >
              <Compass className="w-3.5 h-3.5 text-[#5276A7]" />
              <span>Yol Haritasına & Plana Dön</span>
            </button>
          </div>
        </div>

        {
    /* Toast Alert */
  }
        {addedNotice && <div className="mt-4 p-3 bg-[#EBF5F4] border border-[#2F8F83]/30 rounded-lg text-xs text-[#134E4A] flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#2F8F83]" />
              <span>{addedNotice}</span>
            </div>
            <button
    type="button"
    onClick={() => onNavigate("career-roadmap")}
    className="font-bold underline cursor-pointer text-[#0F766E] hover:text-[#115E59]"
  >
              Planı Gör →
            </button>
          </div>}
      </div>

      {
    /* 2. Filter & Search Controls (Horizontal scanning) */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-4 shadow-2xs space-y-3">
        {
    /* Category Filter Pills */
  }
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => <button
    key={cat.id}
    type="button"
    onClick={() => setCategoryFilter(cat.id)}
    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${categoryFilter === cat.id ? "bg-[#243B64] text-white shadow-2xs" : "bg-[#F8FAFC] text-[#64748B] hover:text-[#202938] border border-[#E2E8F0]"}`}
  >
              {cat.label}
            </button>)}
        </div>

        {
    /* Second Row: Search & Sub-filters */
  }
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-[#F1F5F9]">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    placeholder="Kurs, sağlayıcı veya teknoloji ara (örn. Next.js, Docker, Coursera)..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="w-full pl-9 pr-3 py-2 text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg focus:outline-hidden focus:border-[#243B64] focus:bg-white text-[#202938]"
  />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <select
    value={difficultyFilter}
    onChange={(e) => setDifficultyFilter(e.target.value)}
    className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-[#475569] focus:outline-hidden cursor-pointer"
  >
              <option value="all">Tüm Seviyeler</option>
              <option value="beginner">Başlangıç Seviyesi</option>
              <option value="intermediate">Orta Seviye</option>
              <option value="advanced">İleri Seviye</option>
            </select>

            <select
    value={priceFilter}
    onChange={(e) => setPriceFilter(e.target.value)}
    className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-2.5 py-2 text-[#475569] focus:outline-hidden cursor-pointer"
  >
              <option value="all">Ücretsiz & Ücretli</option>
              <option value="free">Yalnızca Ücretsiz</option>
              <option value="paid">Sertifikalı / Ücretli</option>
            </select>

            <button
    type="button"
    onClick={() => setOnlyBookmarked(!onlyBookmarked)}
    className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${onlyBookmarked ? "bg-[#EEF2F6] border-[#CBD5E1] text-[#243B64]" : "bg-[#F8FAFC] border-[#E2E8F0] text-[#64748B] hover:text-[#202938]"}`}
    title="Kaydedilenler"
  >
              <Bookmark className={`w-4 h-4 ${onlyBookmarked ? "fill-[#243B64]" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {
    /* 3. Resource Cards Grid (Clean 2-column or 3-column SaaS Cards) */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.map((item) => {
    const domain = getDomainFromUrl(item.url);
    return <div
      key={item.id}
      className="bg-white border border-[#E3E7ED] hover:border-[#CBD5E1] rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
    >
              <div className="space-y-3">
                {
      /* Header: Provider & Bookmark */
    }
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-[#5276A7] truncate block">
                      {item.provider}
                    </span>
                    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-[#2F8F83] hover:underline font-mono mt-0.5"
    >
                      <Globe className="w-3 h-3" />
                      <span>{domain}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <button
      type="button"
      onClick={() => handleToggleBookmark(item.id)}
      className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${item.isBookmarked ? "bg-[#EEF2F6] border-[#CBD5E1] text-[#243B64]" : "border-transparent text-[#94A3B8] hover:text-[#202938] hover:bg-[#F8FAFC]"}`}
      title={item.isBookmarked ? "Yer imlerinden \xE7\u0131kar" : "Yer imlerine ekle"}
    >
                    <Bookmark className={`w-4 h-4 ${item.isBookmarked ? "fill-[#243B64]" : ""}`} />
                  </button>
                </div>

                {
      /* Title */
    }
                <h3 className="text-sm font-bold text-[#202938] leading-snug line-clamp-2">
                  {item.title}
                </h3>

                {
      /* Badge if available */
    }
                {item.badge && <div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                      {item.badge}
                    </span>
                  </div>}

                {
      /* Description */
    }
                <p className="text-xs text-[#475569] leading-relaxed line-clamp-3">
                  {item.description}
                </p>

                {
      /* Meta Attributes */
    }
                <div className="pt-2 border-t border-[#F1F5F9] space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">İlişkili Beceri:</span>
                    <span className="font-semibold text-[#243B64] bg-[#EEF2F6] px-2 py-0.5 rounded">
                      {item.relatedSkill}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Seviye & Süre:</span>
                    <span className="text-[#334155] font-medium">
                      {item.difficultyLabel} · {item.estimatedDuration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#64748B]">Fiyat:</span>
                    <span
      className={`font-semibold ${item.isFree ? "text-[#2F8F83]" : "text-[#334155]"}`}
    >
                      {item.priceText}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-0.5 text-[10px] text-[#64748B]">
                    <span className="flex items-center gap-1 text-[#D97706] font-semibold">
                      <Star className="w-3 h-3 fill-[#D97706]" />
                      <span>{item.rating}</span> ({item.reviewCount})
                    </span>
                    <span>{item.enrolledCount}</span>
                  </div>
                </div>
              </div>

              {
      /* Action Buttons: 1. REAL Link To Course & 2. Add To Plan */
    }
              <div className="mt-4 pt-3 border-t border-[#E3E7ED] grid grid-cols-2 gap-2">
                <button
      type="button"
      onClick={() => handleAddToPlan(item)}
      className="w-full py-2 px-2 rounded-lg text-xs font-semibold text-[#243B64] bg-[#F7F8FA] hover:bg-[#EEF2F6] border border-[#CBD5E1] transition-colors cursor-pointer flex items-center justify-center gap-1"
    >
                  <Plus className="w-3.5 h-3.5 text-[#5276A7]" />
                  <span>Plana Ekle</span>
                </button>

                <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full py-2 px-2 rounded-lg text-xs font-semibold text-white bg-[#243B64] hover:bg-[#1B2D4E] transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
    >
                  <span>Kaynağa Git</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>;
  })}
      </div>

      {filteredResources.length === 0 && <div className="bg-white border border-[#E3E7ED] rounded-xl p-12 text-center text-[#64748B] text-xs space-y-2">
          <BookOpen className="w-8 h-8 mx-auto text-[#94A3B8]" />
          <div className="font-bold text-[#202938]">Aradığınız kriterlere uygun kaynak bulunamadı.</div>
          <div>Filtreleri temizleyerek veya arama terimini değiştirerek tekrar deneyebilirsiniz.</div>
          <button
    type="button"
    onClick={() => {
      setSearchQuery("");
      setCategoryFilter("all");
      setDifficultyFilter("all");
      setPriceFilter("all");
      setOnlyBookmarked(false);
    }}
    className="mt-2 text-xs font-semibold text-[#243B64] hover:underline cursor-pointer"
  >
            Filtreleri Sıfırla
          </button>
        </div>}
    </div>;
};
export {
  LearningRecommendationsView
};

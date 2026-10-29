import { useState, useMemo } from "react";
import {
  Users,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  X,
  Check,
  Eye,
  Download
} from "lucide-react";
const ApplicantManagementView = ({
  user,
  candidates,
  jobs,
  onUpdateCandidate,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJobFilter, setSelectedJobFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [sortBy, setSortBy] = useState("match");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateNotes, setCandidateNotes] = useState("");
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3e3);
  };
  const handleOpenCandidate = (cand) => {
    setSelectedCandidate(cand);
    setCandidateNotes(cand.notes || "");
  };
  const handleStatusChange = (cand, newStatus) => {
    const labels = {
      new: "Yeni Ba\u015Fvuru",
      reviewing: "\u0130nceleniyor",
      interview: "M\xFClakat A\u015Famas\u0131nda",
      offer: "Teklif A\u015Famas\u0131",
      rejected: "Olumsuz Sonu\xE7land\u0131"
    };
    const updated = {
      ...cand,
      status: newStatus,
      statusLabel: labels[newStatus]
    };
    onUpdateCandidate(updated);
    if (selectedCandidate?.id === cand.id) {
      setSelectedCandidate(updated);
    }
    showToast(`${cand.candidateName} i\xE7in durum "${labels[newStatus]}" olarak g\xFCncellendi.`);
  };
  const handleSaveNotes = () => {
    if (!selectedCandidate) {
      return;
    }
    const updated = {
      ...selectedCandidate,
      notes: candidateNotes
    };
    onUpdateCandidate(updated);
    setSelectedCandidate(updated);
    showToast("Aday de\u011Ferlendirme notlar\u0131 kaydedildi.");
  };
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch = c.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) || c.candidateTitle.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase()) || c.matchingSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesJob = selectedJobFilter === "all" || c.jobId === selectedJobFilter;
      const matchesStatus = statusFilter === "all" || c.status === statusFilter;
      const matchesScore = c.aiMatchScore >= minMatchScore;
      return matchesSearch && matchesJob && matchesStatus && matchesScore;
    }).sort((a, b) => {
      if (sortBy === "match") {
        return b.aiMatchScore - a.aiMatchScore;
      }
      return a.applicationDate.localeCompare(b.applicationDate);
    });
  }, [candidates, searchQuery, selectedJobFilter, statusFilter, minMatchScore, sortBy]);
  const totalCount = candidates.length;
  const newCount = candidates.filter((c) => c.status === "new").length;
  const reviewingCount = candidates.filter((c) => c.status === "reviewing").length;
  const interviewCount = candidates.filter((c) => c.status === "interview").length;
  const offerCount = candidates.filter((c) => c.status === "offer").length;
  const getStatusBadge = (status) => {
    switch (status) {
      case "new":
        return "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]";
      case "reviewing":
        return "bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]";
      case "interview":
        return "bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]";
      case "offer":
        return "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]";
      case "rejected":
        return "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]";
      default:
        return "bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]";
    }
  };
  return <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {
    /* Toast Notification */
  }
      {toastMessage && <div className="fixed bottom-6 right-6 z-50 bg-[#243B64] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm border border-[#3b5582] animate-fade-in">
          <Check className="w-4 h-4 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>}

      {
    /* Screen 3 Header / Overview */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#243B64] bg-[#EEF2F6] px-2.5 py-0.5 rounded">
                Modül 07 · Ekran 3 / 3
              </span>
              <span className="text-xs text-[#667085]">İşveren Aday Havuzu</span>
            </div>
            <h1 className="text-2xl font-bold text-[#202938] tracking-tight">
              Aday Yönetimi & Başvuru Değerlendirme
            </h1>
            <p className="text-sm text-[#4A5568] mt-1 max-w-2xl">
              İlanlarınıza başvuran adayları yapay zeka uyum puanlarına göre önceliklendirin, CV özetlerini inceleyin ve başvuru durumlarını aşamalar arasında güncelleyin.
            </p>
          </div>

          {
    /* Pipeline Quick Filter Tabs */
  }
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
    type="button"
    onClick={() => setStatusFilter("all")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${statusFilter === "all" ? "bg-[#243B64] text-white border-[#243B64]" : "bg-[#F7F8FA] text-[#667085] border-[#E3E7ED] hover:text-[#202938]"}`}
  >
              Tümü ({totalCount})
            </button>
            <button
    type="button"
    onClick={() => setStatusFilter("new")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${statusFilter === "new" ? "bg-[#1D4ED8] text-white border-[#1D4ED8]" : "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"}`}
  >
              Yeni ({newCount})
            </button>
            <button
    type="button"
    onClick={() => setStatusFilter("reviewing")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${statusFilter === "reviewing" ? "bg-[#B45309] text-white border-[#B45309]" : "bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]"}`}
  >
              İnceleniyor ({reviewingCount})
            </button>
            <button
    type="button"
    onClick={() => setStatusFilter("interview")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${statusFilter === "interview" ? "bg-[#7E22CE] text-white border-[#7E22CE]" : "bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]"}`}
  >
              Mülakat ({interviewCount})
            </button>
            <button
    type="button"
    onClick={() => setStatusFilter("offer")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${statusFilter === "offer" ? "bg-[#15803D] text-white border-[#15803D]" : "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]"}`}
  >
              Teklif ({offerCount})
            </button>
          </div>
        </div>
      </div>

      {
    /* Filter and Search Bar */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {
    /* Search Box */
  }
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Aday adı, unvan, e-posta veya beceri ara (örn: Mehmet, React, TypeScript)..."
    className="w-full pl-10 pr-4 py-2 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-sm text-[#202938] placeholder-[#94A3B8] focus:bg-white focus:outline-none focus:border-[#243B64] transition-all"
  />
          </div>

          {
    /* Job Filter */
  }
          <select
    value={selectedJobFilter}
    onChange={(e) => setSelectedJobFilter(e.target.value)}
    className="px-3 py-2 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-xs font-medium text-[#202938] focus:outline-none focus:border-[#243B64]"
  >
            <option value="all">Tüm İlan Başvuruları</option>
            {jobs.map((j) => <option key={j.id} value={j.id}>
                {j.title} ({j.company})
              </option>)}
          </select>

          {
    /* AI Match Filter */
  }
          <select
    value={minMatchScore}
    onChange={(e) => setMinMatchScore(Number(e.target.value))}
    className="px-3 py-2 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-xs font-medium text-[#202938] focus:outline-none focus:border-[#243B64]"
  >
            <option value={0}>AI Uyum: Tüm Skorlar</option>
            <option value={90}>%90+ Yüksek Uyum</option>
            <option value={80}>%80+ Uyum</option>
            <option value={70}>%70+ Uyum</option>
          </select>

          {
    /* Sort By */
  }
          <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="px-3 py-2 bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg text-xs font-medium text-[#202938] focus:outline-none focus:border-[#243B64]"
  >
            <option value="match">Sıralama: En Yüksek AI Uyum</option>
            <option value="recent">Sıralama: Başvuru Tarihi</option>
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-[#667085] pt-1 border-t border-[#F1F3F5]">
          <span>
            Toplam <strong className="text-[#202938]">{filteredCandidates.length}</strong> aday listeleniyor
          </span>
          <span className="text-[11px] text-[#94A3B8]">
            Detaylı incelemek için satırdaki <strong>"CV ve Detay"</strong> butonuna tıklayın.
          </span>
        </div>
      </div>

      {
    /* Candidate Table / Cards */
  }
      {filteredCandidates.length === 0 ? <div className="bg-white border border-[#E3E7ED] rounded-xl p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 bg-[#F7F8FA] rounded-full flex items-center justify-center mx-auto mb-3 text-[#94A3B8]">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#202938] mb-1">Aday Bulunamadı</h3>
          <p className="text-xs text-[#667085] mb-4">
            Seçili filtrelere uygun başvuru bulunmamaktadır. Filtreleri temizleyebilirsiniz.
          </p>
          <button
    type="button"
    onClick={() => {
      setSearchQuery("");
      setSelectedJobFilter("all");
      setStatusFilter("all");
      setMinMatchScore(0);
    }}
    className="px-4 py-2 bg-[#243B64] text-white text-xs font-semibold rounded-lg hover:bg-[#1b2d4f] transition-colors cursor-pointer"
  >
            Filtreleri Sıfırla
          </button>
        </div> : <div className="bg-white border border-[#E3E7ED] rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAFC] border-b border-[#E3E7ED] text-[#667085] font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Aday Bilgileri</th>
                  <th className="py-3.5 px-4">Başvurulan İlan</th>
                  <th className="py-3.5 px-4 text-center">AI Uyum Skoru</th>
                  <th className="py-3.5 px-4">Eşleşen Beceriler</th>
                  <th className="py-3.5 px-4">Başvuru Durumu</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F3F5]">
                {filteredCandidates.map((cand) => {
    const isHighMatch = cand.aiMatchScore >= 90;
    return <tr
      key={cand.id}
      className="hover:bg-[#F8FAFC] transition-colors cursor-pointer"
      onClick={() => handleOpenCandidate(cand)}
    >
                      {
      /* Candidate info */
    }
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs"
      style={{ backgroundColor: cand.candidateAvatarBg || "#243B64" }}
    >
                            {cand.candidateName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-[#202938] text-sm block">
                              {cand.candidateName}
                            </span>
                            <span className="text-xs text-[#64748B] block">
                              {cand.candidateTitle}
                            </span>
                            <span className="text-[11px] text-[#94A3B8] flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {cand.location} · {cand.experienceYears} yıl deneyim
                            </span>
                          </div>
                        </div>
                      </td>

                      {
      /* Job Title & Date */
    }
                      <td className="py-4 px-4">
                        <span className="font-semibold text-[#202938] block line-clamp-1">
                          {cand.jobTitle}
                        </span>
                        <span className="text-[11px] text-[#94A3B8] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {cand.applicationDate}
                        </span>
                      </td>

                      {
      /* AI Match Score */
    }
                      <td className="py-4 px-4 text-center">
                        <span
      className={`inline-flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-full border ${isHighMatch ? "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]" : "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]"}`}
    >
                          <Sparkles className="w-3 h-3" />
                          <span>%{cand.aiMatchScore}</span>
                        </span>
                      </td>

                      {
      /* Matching Skills */
    }
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {cand.matchingSkills.slice(0, 3).map((s, idx) => <span
      key={idx}
      className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
    >
                              {s}
                            </span>)}
                          {cand.matchingSkills.length > 3 && <span className="text-[10px] text-[#64748B] px-1 py-0.5">
                              +{cand.matchingSkills.length - 3}
                            </span>}
                        </div>
                      </td>

                      {
      /* Status Dropdown */
    }
                      <td
      className="py-4 px-4"
      onClick={(e) => e.stopPropagation()}
    >
                        <select
      value={cand.status}
      onChange={(e) => handleStatusChange(cand, e.target.value)}
      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadge(
        cand.status
      )}`}
    >
                          <option value="new">Yeni Başvuru</option>
                          <option value="reviewing">İnceleniyor</option>
                          <option value="interview">Mülakat Aşamasında</option>
                          <option value="offer">Teklif Aşaması</option>
                          <option value="rejected">Olumsuz Sonuçlandı</option>
                        </select>
                      </td>

                      {
      /* Action Button */
    }
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleOpenCandidate(cand);
      }}
      className="px-3 py-1.5 bg-[#EEF2F6] hover:bg-[#E2E8F0] text-[#243B64] font-semibold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer"
    >
                          <Eye className="w-3.5 h-3.5" />
                          <span>CV & Detay</span>
                        </button>
                      </td>
                    </tr>;
  })}
              </tbody>
            </table>
          </div>
        </div>}

      {
    /* Candidate Detail Modal / Drawer */
  }
      {selectedCandidate && <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 space-y-6 shadow-2xl animate-fade-in">
            {
    /* Modal Header */
  }
            <div className="flex items-start justify-between pb-4 border-b border-[#F1F3F5]">
              <div className="flex items-center gap-4">
                <div
    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-xl shadow-xs"
    style={{ backgroundColor: selectedCandidate.candidateAvatarBg || "#243B64" }}
  >
                  {selectedCandidate.candidateName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#202938]">
                    {selectedCandidate.candidateName}
                  </h3>
                  <span className="text-xs font-semibold text-[#667085]">
                    {selectedCandidate.candidateTitle}
                  </span>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#667085] pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {selectedCandidate.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {selectedCandidate.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#94A3B8]" />
                      {selectedCandidate.location}
                    </span>
                  </div>
                </div>
              </div>

              <button
    type="button"
    onClick={() => setSelectedCandidate(null)}
    className="text-[#94A3B8] hover:text-[#202938] cursor-pointer p-1"
  >
                <X className="w-5 h-5" />
              </button>
            </div>

            {
    /* AI Match Overview Banner */
  }
            <div className="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#166534]">
                    AI Eşleşme Puanı: %{selectedCandidate.aiMatchScore}
                  </span>
                  <span className="text-[11px] text-[#15803D]">· {selectedCandidate.jobTitle}</span>
                </div>
                <p className="text-xs text-[#166534] leading-relaxed">
                  {selectedCandidate.matchRationale}
                </p>
              </div>
            </div>

            {
    /* Matching & Missing Skills */
  }
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                <span className="text-xs font-bold text-[#15803D] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CV ile Doğrulanan Beceriler</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCandidate.matchingSkills.map((s, idx) => <span
    key={idx}
    className="text-xs font-medium px-2.5 py-1 rounded bg-[#F0FDF4] text-[#166534] border border-[#DCFCE7]"
  >
                      {s}
                    </span>)}
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl space-y-2">
                <span className="text-xs font-bold text-[#B45309] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Pozisyonda Eksik Görünen Beceriler</span>
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCandidate.missingSkills.length > 0 ? selectedCandidate.missingSkills.map((s, idx) => <span
    key={idx}
    className="text-xs font-medium px-2.5 py-1 rounded bg-[#FFFBEB] text-[#92400E] border border-[#FEF3C7]"
  >
                        {s}
                      </span>) : <span className="text-xs text-[#64748B]">Tüm zorunlu beceriler tam eşleşti.</span>}
                </div>
              </div>
            </div>

            {
    /* CV Summary & Attached Document */
  }
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#667085] flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#243B64]" />
                <span>Özgeçmiş Özeti & Belge</span>
              </h4>
              <p className="text-xs text-[#334155] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-lg border border-[#E2E8F0]">
                {selectedCandidate.cvSummary}
              </p>
              <div className="flex items-center justify-between p-3 bg-white border border-[#E2E8F0] rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#243B64]" />
                  <span className="text-xs font-semibold text-[#202938]">
                    {selectedCandidate.cvFileName}
                  </span>
                </div>
                <button
    type="button"
    onClick={() => showToast(`"${selectedCandidate.cvFileName}" ba\u015Far\u0131yla indirildi.`)}
    className="text-xs font-semibold text-[#243B64] hover:underline flex items-center gap-1 cursor-pointer"
  >
                  <Download className="w-3.5 h-3.5" />
                  <span>CV İndir</span>
                </button>
              </div>
            </div>

            {
    /* Evaluation & Status Action Toolbar */
  }
            <div className="space-y-3 pt-3 border-t border-[#F1F3F5]">
              <span className="text-xs font-bold text-[#202938] block">Başvuru Aşaması ve Hızlı Karar</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
    type="button"
    onClick={() => handleStatusChange(selectedCandidate, "reviewing")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${selectedCandidate.status === "reviewing" ? "bg-[#B45309] text-white border-[#B45309]" : "bg-[#FFFBEB] text-[#B45309] border-[#FEF3C7]"}`}
  >
                  İncelemeye Al
                </button>
                <button
    type="button"
    onClick={() => handleStatusChange(selectedCandidate, "interview")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${selectedCandidate.status === "interview" ? "bg-[#7E22CE] text-white border-[#7E22CE]" : "bg-[#FAF5FF] text-[#7E22CE] border-[#E9D5FF]"}`}
  >
                  Mülakata Davet Et
                </button>
                <button
    type="button"
    onClick={() => handleStatusChange(selectedCandidate, "offer")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${selectedCandidate.status === "offer" ? "bg-[#15803D] text-white border-[#15803D]" : "bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]"}`}
  >
                  İş Teklifi Yap
                </button>
                <button
    type="button"
    onClick={() => handleStatusChange(selectedCandidate, "rejected")}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${selectedCandidate.status === "rejected" ? "bg-[#B91C1C] text-white border-[#B91C1C]" : "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]"}`}
  >
                  Olumsuz Sonuçlandır
                </button>
              </div>
            </div>

            {
    /* Internal Notes Section */
  }
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-[#334155]">
                Şirket İçi Değerlendirme & Mülakat Notları
              </label>
              <textarea
    rows={3}
    value={candidateNotes}
    onChange={(e) => setCandidateNotes(e.target.value)}
    placeholder="Aday hakkındaki teknik izlenimler, mülakat tarihi veya İK notları..."
    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#202938] focus:bg-white focus:outline-none focus:border-[#243B64]"
  />
              <div className="flex justify-end">
                <button
    type="button"
    onClick={handleSaveNotes}
    className="px-4 py-2 bg-[#243B64] text-white text-xs font-semibold rounded-lg hover:bg-[#1b2d4f] transition-colors cursor-pointer flex items-center gap-1.5"
  >
                  <Check className="w-3.5 h-3.5" />
                  <span>Notları Kaydet</span>
                </button>
              </div>
            </div>

            {
    /* Modal Bottom Close */
  }
            <div className="pt-4 border-t border-[#F1F3F5] flex justify-end">
              <button
    type="button"
    onClick={() => setSelectedCandidate(null)}
    className="px-5 py-2.5 bg-white border border-[#CBD5E1] text-[#475569] text-xs font-semibold rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer"
  >
                Kapat
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export {
  ApplicantManagementView
};

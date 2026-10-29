import { useState, useMemo } from "react";
import {
  Clock,
  BookOpen,
  Check,
  Plus,
  Trash2,
  X
} from "lucide-react";
import { initialDevelopmentTasks } from "../../data/roadmapData.js";
const CareerRoadmapView = ({
  user,
  tasks = initialDevelopmentTasks,
  onNavigate,
  onUpdateTasks
}) => {
  const [taskList, setTaskList] = useState(
    tasks.length > 0 ? tasks : initialDevelopmentTasks
  );
  const [selectedWeek, setSelectedWeek] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newWeek, setNewWeek] = useState("Hafta 1");
  const [newSkill, setNewSkill] = useState("Next.js");
  const [newDueDate, setNewDueDate] = useState("Bu Hafta Sonu");
  const [newPriority, setNewPriority] = useState("high");
  const [newCategory, setNewCategory] = useState("project");
  const [newDescription, setNewDescription] = useState("");
  const targetRole = user.careerGoals?.targetRole || user.targetRole || "Frontend & Web Geli\u015Ftirici";
  const experienceLevel = user.experienceLevel || "0-2 Y\u0131l (Junior \u2192 Mid-Level Seviyesi)";
  const handleToggleTask = (taskId) => {
    const updated = taskList.map(
      (t) => t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    setTaskList(updated);
    if (onUpdateTasks) {
      onUpdateTasks(updated);
    }
  };
  const handleDeleteTask = (taskId) => {
    const updated = taskList.filter((t) => t.id !== taskId);
    setTaskList(updated);
    if (onUpdateTasks) {
      onUpdateTasks(updated);
    }
  };
  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      return;
    }
    const categoryLabels = {
      practice: "Kod Prati\u011Fi",
      course: "Kurs & E\u011Fitim",
      project: "Proje Geli\u015Ftirme",
      reading: "Teknik Dok\xFCmantasyon"
    };
    const newTask = {
      id: `task-${Date.now()}`,
      week: newWeek,
      title: newTitle.trim(),
      description: newDescription.trim() || "Haftal\u0131k geli\u015Fim plan\u0131 hedefi.",
      relatedSkill: newSkill,
      dueDate: newDueDate,
      completed: false,
      priority: newPriority,
      category: newCategory,
      categoryLabel: categoryLabels[newCategory] || "G\xF6rev"
    };
    const updated = [newTask, ...taskList];
    setTaskList(updated);
    if (onUpdateTasks) {
      onUpdateTasks(updated);
    }
    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDescription("");
  };
  const totalTasks = taskList.length;
  const completedCount = taskList.filter((t) => t.completed).length;
  const pendingCount = totalTasks - completedCount;
  const progressPercentage = Math.round(completedCount / (totalTasks || 1) * 100);
  const weeks = ["all", "Hafta 1", "Hafta 2", "Hafta 3", "Hafta 4"];
  const filteredTasks = useMemo(() => {
    return taskList.filter((task) => {
      const matchesWeek = selectedWeek === "all" || task.week === selectedWeek;
      const matchesStatus = statusFilter === "all" || statusFilter === "completed" && task.completed || statusFilter === "pending" && !task.completed;
      return matchesWeek && matchesStatus;
    });
  }, [taskList, selectedWeek, statusFilter]);
  return <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {
    /* 1. Header (F-Pattern Anchor) */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#E3E7ED]">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5276A7]">
              <span>MODÜL 05</span>
              <span>·</span>
              <span>KARİYER YOL HARİTASI & GELİŞİM PLANI</span>
              <span>·</span>
              <span className="text-[#243B64] font-bold">{targetRole}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#202938] mt-1">
              {targetRole} Yol Haritası ve Gelişim Planı
            </h1>
            <p className="text-xs text-[#667085] mt-1 max-w-2xl leading-relaxed">
              Hedef pozisyonunuza yönelik haftalık hedefler, tamamlanması gereken görevler ve yetkinlik adımları aşağıda listelenmiştir.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
    type="button"
    onClick={() => onNavigate("learning-recommendations")}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#243B64] bg-[#EEF2F6] hover:bg-[#E2E8F0] border border-[#CBD5E1] rounded-lg transition-colors cursor-pointer"
  >
              <BookOpen className="w-3.5 h-3.5 text-[#5276A7]" />
              <span>Eğitim & Kaynak Önerileri</span>
            </button>
            <button
    type="button"
    onClick={() => setIsAddModalOpen(true)}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#243B64] hover:bg-[#1B2D4E] rounded-lg transition-colors cursor-pointer shadow-xs"
  >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Görev Ekle</span>
            </button>
          </div>
        </div>

        {
    /* 2. Executive Metrics (Clean single row scanning - no "1.5 kaldı") */
  }
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-5">
          <div>
            <div className="text-[11px] font-medium text-[#64748B]">Hedeflenen Rol</div>
            <div className="text-sm font-bold text-[#202938] mt-0.5 truncate">{targetRole}</div>
            <div className="text-[11px] text-[#5276A7] mt-0.5">{experienceLevel}</div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-[#64748B]">Plan İlerleme Durumu</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl font-bold text-[#243B64]">%{progressPercentage}</span>
              <span className="text-[11px] text-[#2F8F83] font-medium">
                ({completedCount}/{totalTasks} tamamlandı)
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden mt-1.5">
              <div
    className="h-full bg-[#243B64] rounded-full transition-all duration-300"
    style={{ width: `${progressPercentage}%` }}
  />
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-[#64748B]">Aktif Aşama</div>
            <div className="text-sm font-bold text-[#243B64] mt-0.5">Aşama 2: Mid-Level</div>
            <div className="text-[11px] text-[#2F8F83] font-semibold mt-0.5">
              Devam Ediyor · %{progressPercentage} Tamamlandı
            </div>
          </div>

          <div>
            <div className="text-[11px] font-medium text-[#64748B]">Kalan Görevler</div>
            <div className="text-sm font-bold text-[#D97706] mt-0.5">{pendingCount} Görev Bekliyor</div>
            <div className="text-[11px] text-[#64748B] mt-0.5">Knowledge Graph uyumlu</div>
          </div>
        </div>
      </div>

      {
    /* 3. Filter Navigation & Controls */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {
    /* Week Selector Tabs */
  }
        <div className="flex items-center gap-1.5 p-1 bg-[#EEF2F6] border border-[#CBD5E1] rounded-lg text-xs overflow-x-auto">
          {weeks.map((w) => <button
    key={w}
    type="button"
    onClick={() => setSelectedWeek(w)}
    className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer shrink-0 ${selectedWeek === w ? "bg-white text-[#243B64] font-bold shadow-2xs" : "text-[#64748B] hover:text-[#202938]"}`}
  >
              {w === "all" ? "T\xFCm Haftalar" : w}
            </button>)}
        </div>

        {
    /* Status Filters */
  }
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] border border-[#CBD5E1] rounded-lg text-xs">
            <button
    type="button"
    onClick={() => setStatusFilter("all")}
    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${statusFilter === "all" ? "bg-white text-[#202938] font-semibold shadow-2xs" : "text-[#64748B] hover:text-[#202938]"}`}
  >
              Tümü ({taskList.length})
            </button>
            <button
    type="button"
    onClick={() => setStatusFilter("pending")}
    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${statusFilter === "pending" ? "bg-white text-[#D97706] font-semibold shadow-2xs" : "text-[#64748B] hover:text-[#202938]"}`}
  >
              Yapılacaklar ({pendingCount})
            </button>
            <button
    type="button"
    onClick={() => setStatusFilter("completed")}
    className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${statusFilter === "completed" ? "bg-white text-[#2F8F83] font-semibold shadow-2xs" : "text-[#64748B] hover:text-[#202938]"}`}
  >
              Tamamlanan ({completedCount})
            </button>
          </div>
        </div>
      </div>

      {
    /* 4. Development Plan Tasks List */
  }
      <div className="space-y-3">
        {filteredTasks.length === 0 ? <div className="p-8 text-center bg-white border border-[#E3E7ED] rounded-xl text-xs text-[#667085]">
            Bu filtreye uygun görev bulunamadı. Yeni bir görev ekleyebilir veya filtreleri sıfırlayabilirsiniz.
          </div> : filteredTasks.map((task) => <div
    key={task.id}
    className={`bg-white border rounded-xl p-4 sm:p-5 transition-all shadow-2xs flex items-start justify-between gap-4 ${task.completed ? "border-[#E2E8F0] bg-[#FAFAFC] opacity-80" : "border-[#E3E7ED] hover:border-[#CBD5E1]"}`}
  >
              <div className="flex items-start gap-3.5 flex-1 min-w-0">
                {
    /* Complete Checkbox */
  }
                <button
    type="button"
    onClick={() => handleToggleTask(task.id)}
    className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center transition-colors cursor-pointer shrink-0 ${task.completed ? "bg-[#2F8F83] border-[#2F8F83] text-white" : "border-[#CBD5E1] bg-white hover:border-[#243B64]"}`}
    title={task.completed ? "Tamamlanmad\u0131 olarak i\u015Faretle" : "Tamamland\u0131 olarak i\u015Faretle"}
  >
                  {task.completed && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-[#243B64] bg-[#EEF2F6] px-2 py-0.5 rounded">
                      {task.week}
                    </span>
                    <span className="text-[11px] font-medium text-[#475569] bg-[#F1F5F9] px-2 py-0.5 rounded border border-[#E2E8F0]">
                      {task.categoryLabel}
                    </span>
                    <span
    className={`text-[10px] font-bold px-2 py-0.5 rounded ${task.priority === "high" ? "bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5]" : task.priority === "medium" ? "bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE]" : "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]"}`}
  >
                      {task.priority === "high" ? "Y\xFCksek \xD6ncelik" : task.priority === "medium" ? "Orta \xD6ncelik" : "Normal"}
                    </span>
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#94A3B8]" />
                      {task.dueDate}
                    </span>
                  </div>

                  <h3
    className={`text-sm sm:text-base font-bold transition-all ${task.completed ? "text-[#94A3B8] line-through" : "text-[#202938]"}`}
  >
                    {task.title}
                  </h3>

                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {task.description}
                  </p>

                  <div className="pt-1 text-[11px] text-[#5276A7] font-medium">
                    İlgili Yetkinlik: <strong className="text-[#202938]">{task.relatedSkill}</strong>
                  </div>
                </div>
              </div>

              {
    /* Delete Action */
  }
              <button
    type="button"
    onClick={() => handleDeleteTask(task.id)}
    className="p-1.5 text-[#94A3B8] hover:text-[#B91C1C] rounded transition-colors cursor-pointer shrink-0"
    title="Görevi Sil"
  >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>)}
      </div>

      {
    /* Add Task Modal */
  }
      {isAddModalOpen && <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#CBD5E1] shadow-xl max-w-lg w-full p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E7ED]">
              <h3 className="text-base font-bold text-[#202938] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#243B64]" />
                <span>Gelişim Planına Yeni Görev Ekle</span>
              </h3>
              <button
    type="button"
    onClick={() => setIsAddModalOpen(false)}
    className="p-1 text-[#64748B] hover:text-[#202938] rounded cursor-pointer"
  >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#202938] mb-1">
                  Görev Başlığı *
                </label>
                <input
    type="text"
    required
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
    placeholder="Örn: Docker Compose ile Mikroservis Pratiği Yap"
    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202938] mb-1">
                    Hedef Hafta
                  </label>
                  <select
    value={newWeek}
    onChange={(e) => setNewWeek(e.target.value)}
    className="w-full px-2.5 py-2 border border-[#CBD5E1] rounded-lg text-xs text-[#202938] bg-white focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  >
                    <option value="Hafta 1">Hafta 1</option>
                    <option value="Hafta 2">Hafta 2</option>
                    <option value="Hafta 3">Hafta 3</option>
                    <option value="Hafta 4">Hafta 4</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#202938] mb-1">
                    İlgili Yetkinlik
                  </label>
                  <input
    type="text"
    value={newSkill}
    onChange={(e) => setNewSkill(e.target.value)}
    placeholder="Örn: Docker, Next.js"
    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#202938] mb-1">
                    Kategori Türü
                  </label>
                  <select
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    className="w-full px-2.5 py-2 border border-[#CBD5E1] rounded-lg text-xs text-[#202938] bg-white focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  >
                    <option value="project">Proje Geliştirme</option>
                    <option value="course">Kurs & Eğitim</option>
                    <option value="practice">Kod Pratiği</option>
                    <option value="reading">Teknik Dokümantasyon</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#202938] mb-1">
                    Öncelik Seviyesi
                  </label>
                  <select
    value={newPriority}
    onChange={(e) => setNewPriority(e.target.value)}
    className="w-full px-2.5 py-2 border border-[#CBD5E1] rounded-lg text-xs text-[#202938] bg-white focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  >
                    <option value="high">Yüksek Öncelik</option>
                    <option value="medium">Orta Öncelik</option>
                    <option value="low">Normal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#202938] mb-1">
                  Son Tarih
                </label>
                <input
    type="text"
    value={newDueDate}
    onChange={(e) => setNewDueDate(e.target.value)}
    placeholder="Örn: Bu Hafta Sonu"
    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  />
              </div>

              <div>
                <label className="block font-semibold text-[#202938] mb-1">
                  Açıklama & Detay
                </label>
                <textarea
    rows={2}
    value={newDescription}
    onChange={(e) => setNewDescription(e.target.value)}
    placeholder="Görevin içeriği ve öğrenilecek anahtar kavramlar..."
    className="w-full px-3 py-2 border border-[#CBD5E1] rounded-lg text-xs text-[#202938] focus:outline-none focus:ring-1 focus:ring-[#243B64]"
  />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#E3E7ED]">
                <button
    type="button"
    onClick={() => setIsAddModalOpen(false)}
    className="px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#202938] rounded-lg transition-colors cursor-pointer"
  >
                  İptal
                </button>
                <button
    type="submit"
    className="px-4 py-2 bg-[#243B64] hover:bg-[#1B2D4E] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-xs"
  >
                  Görevi Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
export {
  CareerRoadmapView
};

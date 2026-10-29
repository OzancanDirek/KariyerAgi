import { useState, useMemo, useRef } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowRight,
  FileCheck
} from "lucide-react";
import { initialSkillsData } from "../../data/skillsData.js";
const KnowledgeGraphView = ({
  user,
  skillsData = initialSkillsData,
  onSelectSkill,
  onNavigate
}) => {
  const [selectedSkillId, setSelectedSkillId] = useState(
    user.selectedSkillId || "skill-react"
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredSkillId, setHoveredSkillId] = useState(null);
  const containerRef = useRef(null);
  const allSkills = skillsData.length > 0 ? skillsData : initialSkillsData;
  const selectedSkill = useMemo(() => {
    return allSkills.find((s) => s.id === selectedSkillId) || allSkills[0];
  }, [allSkills, selectedSkillId]);
  const stats = useMemo(() => {
    const total = allSkills.length;
    const mastered = allSkills.filter((s) => s.status === "mastered").length;
    const learning = allSkills.filter((s) => s.status === "learning").length;
    const gap = allSkills.filter((s) => s.status === "gap").length;
    const avgPercentage = Math.round(
      allSkills.reduce((acc, s) => acc + s.percentage, 0) / (total || 1)
    );
    return { total, mastered, learning, gap, avgPercentage };
  }, [allSkills]);
  const handleMouseDown = (e) => {
    if (e.target.tagName === "svg" || e.target.tagName === "rect") {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleZoom = (delta) => {
    setZoomLevel((prev) => Math.max(0.6, Math.min(1.8, prev + delta)));
  };
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };
  const handleNodeClick = (skill) => {
    setSelectedSkillId(skill.id);
    if (onSelectSkill) {
      onSelectSkill(skill.id);
    }
  };
  const connectedSkillIds = useMemo(() => {
    if (!selectedSkill) {
      return /* @__PURE__ */ new Set();
    }
    return new Set(selectedSkill.connections || []);
  }, [selectedSkill]);
  return <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {
    /* Top Value Header Banner */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#5276A7] font-semibold mb-1">
              <span>MODÜL 04</span>
              <span>·</span>
              <span>YETKİNLİK AĞI</span>
              <span>·</span>
              <span>KNOWLEDGE GRAPH</span>
            </div>
            <h2 className="text-xl font-bold text-[#202938]">
              Etkileşimli Beceri Haritası (Knowledge Graph)
            </h2>
            <p className="text-xs text-[#667085] mt-1 max-w-3xl leading-relaxed">
              Özgeçmişinizden, GitHub repolarınızdan ve projelerinizden çıkarılan yetkinlikler arasındaki
              bağlantıları görüntüleyin. Düğümlere tıklayarak ilişkili teknolojileri ve gelişim alanlarını keşfedebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
    type="button"
    onClick={() => onNavigate("cv-analysis")}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#243B64] bg-[#EEF2F6] hover:bg-[#E3E9F2] border border-[#CBD5E1] rounded-lg transition-colors cursor-pointer"
  >
              <FileCheck className="w-3.5 h-3.5 text-[#5276A7]" />
              <span>Tespit Edilen Becerileri Gör</span>
            </button>
            <button
    type="button"
    onClick={() => onNavigate("career-roadmap")}
    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#243B64] hover:bg-[#1B2D4E] rounded-lg transition-colors cursor-pointer shadow-xs"
  >
              <span>Kariyer Yol Haritasına Geç</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {
    /* Metric Cards Row */
  }
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-[#E3E7ED]">
          <div className="bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#667085]">Toplam Kayıtlı Beceri</div>
            <div className="text-xl font-bold text-[#202938] mt-0.5">{stats.total} Yetkinlik</div>
            <div className="text-[10px] text-[#5276A7] mt-0.5">CV & Portfolyo kaynaklı</div>
          </div>

          <div className="bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#667085] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#243B64]" />
              <span>Doğrulanmış Beceriler</span>
            </div>
            <div className="text-xl font-bold text-[#243B64] mt-0.5">{stats.mastered} Beceri</div>
            <div className="text-[10px] text-[#2F8F83] mt-0.5 font-medium">Kanıtlanmış & Tam</div>
          </div>

          <div className="bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#667085] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#5276A7]" />
              <span>Geliştirilmekte Olan</span>
            </div>
            <div className="text-xl font-bold text-[#5276A7] mt-0.5">{stats.learning} Beceri</div>
            <div className="text-[10px] text-[#667085] mt-0.5">Aktif çalışma rotasında</div>
          </div>

          <div className="bg-[#F7F8FA] border border-[#E3E7ED] rounded-lg p-3">
            <div className="text-[11px] font-medium text-[#667085] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full border border-[#D97706] bg-[#FEF3C7]" />
              <span>Hedef Boşluğu (Gap)</span>
            </div>
            <div className="text-xl font-bold text-[#D97706] mt-0.5">{stats.gap} Beceri</div>
            <div className="text-[10px] text-[#D97706] mt-0.5 font-medium">Hedef rol için gerekli</div>
          </div>
        </div>
      </div>

      {
    /* Main Interactive Graph Canvas (Full Width, without search, filter bar or node summary panel) */
  }
      <div className="bg-white border border-[#E3E7ED] rounded-xl overflow-hidden shadow-2xs flex flex-col">
        {
    /* Controls Bar (Only Zoom / Pan Controls) */
  }
        <div className="p-3.5 border-b border-[#E3E7ED] bg-[#F7F8FA] flex items-center justify-between gap-3">
          <div className="text-xs font-semibold text-[#202938] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#243B64]" />
            <span>Etkileşimli Ağ Görünümü ({allSkills.length} Düğüm)</span>
            {selectedSkill && <span className="text-[11px] font-normal text-[#667085]">
                · Seçili: <strong className="text-[#243B64]">{selectedSkill.name}</strong> (%{selectedSkill.percentage})
              </span>}
          </div>

          {
    /* Canvas Zoom / Pan Controls */
  }
          <div className="flex items-center gap-1 bg-white border border-[#CBD5E1] rounded-lg p-0.5">
            <button
    type="button"
    onClick={() => handleZoom(0.15)}
    className="p-1 hover:bg-[#F7F8FA] text-[#243B64] rounded transition-colors cursor-pointer"
    title="Yakınlaştır"
    aria-label="Yakınlaştır"
  >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
    type="button"
    onClick={() => handleZoom(-0.15)}
    className="p-1 hover:bg-[#F7F8FA] text-[#243B64] rounded transition-colors cursor-pointer"
    title="Uzaklaştır"
    aria-label="Uzaklaştır"
  >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
    type="button"
    onClick={handleResetView}
    className="p-1 hover:bg-[#F7F8FA] text-[#667085] hover:text-[#202938] rounded transition-colors cursor-pointer"
    title="Görünümü Sıfırla"
    aria-label="Görünümü Sıfırla"
  >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-[#667085] px-1 font-mono">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
        </div>

        {
    /* Interactive SVG Canvas Area */
  }
        <div
    ref={containerRef}
    onMouseDown={handleMouseDown}
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
    className="relative w-full h-[600px] bg-[#FAFAFC] overflow-hidden cursor-grab active:cursor-grabbing select-none"
  >
          {
    /* Background subtle grid pattern */
  }
          <svg
    className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
    xmlns="http://www.w3.org/2000/svg"
  >
            <defs>
              <pattern
    id="graph-grid"
    width="32"
    height="32"
    patternUnits="userSpaceOnUse"
  >
                <path
    d="M 32 0 L 0 0 0 32"
    fill="none"
    stroke="#E2E8F0"
    strokeWidth="0.8"
  />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#graph-grid)" />
          </svg>

          {
    /* SVG Graph Visualization */
  }
          <svg
    className="w-full h-full"
    viewBox="0 0 1000 650"
    style={{
      transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
      transformOrigin: "center center",
      transition: isDragging ? "none" : "transform 0.15s ease-out"
    }}
  >
            <defs>
              {
    /* Glow Filter for Active Node */
  }
              <filter id="node-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {
    /* Connecting Lines */
  }
            <g className="connections">
              {allSkills.map((skill) => {
    const sourceX = skill.x || 450;
    const sourceY = skill.y || 300;
    return (skill.connections || []).map((targetId) => {
      const targetSkill = allSkills.find((s) => s.id === targetId);
      if (!targetSkill) {
        return null;
      }
      const targetX = targetSkill.x || 450;
      const targetY = targetSkill.y || 300;
      const isHighlightLine = selectedSkillId === skill.id && connectedSkillIds.has(targetSkill.id) || selectedSkillId === targetSkill.id && (targetSkill.connections || []).includes(skill.id) || hoveredSkillId === skill.id && (skill.connections || []).includes(targetSkill.id);
      const isDimmed = selectedSkillId && selectedSkillId !== skill.id && selectedSkillId !== targetSkill.id && !connectedSkillIds.has(skill.id) && !connectedSkillIds.has(targetSkill.id);
      return <line
        key={`${skill.id}-${targetSkill.id}`}
        x1={sourceX}
        y1={sourceY}
        x2={targetX}
        y2={targetY}
        stroke={isHighlightLine ? "#243B64" : "#CBD5E1"}
        strokeWidth={isHighlightLine ? 2.5 : 1.2}
        strokeDasharray={skill.status === "gap" || targetSkill.status === "gap" ? "4 3" : "none"}
        opacity={isDimmed ? 0.25 : isHighlightLine ? 1 : 0.65}
        className="transition-all duration-200"
      />;
    });
  })}
            </g>

            {
    /* Node Circles */
  }
            <g className="nodes">
              {allSkills.map((skill) => {
    const cx = skill.x || 450;
    const cy = skill.y || 300;
    const radius = skill.radius || 32;
    const isSelected = selectedSkillId === skill.id;
    const isHovered = hoveredSkillId === skill.id;
    const isConnected = connectedSkillIds.has(skill.id);
    let fillColor = "#FFFFFF";
    let strokeColor = "#243B64";
    let textColor = "#202938";
    if (skill.status === "mastered") {
      fillColor = isSelected ? "#243B64" : "#FFFFFF";
      strokeColor = "#243B64";
      textColor = isSelected ? "#FFFFFF" : "#202938";
    } else if (skill.status === "learning") {
      fillColor = isSelected ? "#5276A7" : "#FFFFFF";
      strokeColor = "#5276A7";
      textColor = isSelected ? "#FFFFFF" : "#202938";
    } else if (skill.status === "gap") {
      fillColor = isSelected ? "#D97706" : "#FFFDF5";
      strokeColor = "#D97706";
      textColor = isSelected ? "#FFFFFF" : "#92400E";
    }
    const opacity = isSelected || isHovered || isConnected ? 1 : 0.9;
    return <g
      key={skill.id}
      onClick={(e) => {
        e.stopPropagation();
        handleNodeClick(skill);
      }}
      onMouseEnter={() => setHoveredSkillId(skill.id)}
      onMouseLeave={() => setHoveredSkillId(null)}
      className="cursor-pointer transition-transform duration-200"
      style={{ opacity }}
    >
                    {
      /* Pulse ring for selected node */
    }
                    {isSelected && <circle
      cx={cx}
      cy={cy}
      r={radius + 7}
      fill="none"
      stroke={strokeColor}
      strokeWidth="2"
      strokeDasharray="4 2"
      opacity="0.8"
    />}

                    {
      /* Main Node Body */
    }
                    <circle
      cx={cx}
      cy={cy}
      r={radius}
      fill={fillColor}
      stroke={strokeColor}
      strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 2}
      strokeDasharray={skill.status === "gap" ? "4 2" : "none"}
      filter={isSelected ? "url(#node-glow)" : "none"}
      className="transition-all duration-200"
    />

                    {
      /* Inner skill name */
    }
                    <text
      x={cx}
      y={cy - 4}
      textAnchor="middle"
      fill={textColor}
      fontSize={radius > 32 ? "11px" : "10px"}
      fontWeight="700"
      className="font-sans select-none pointer-events-none"
    >
                      {skill.name}
                    </text>

                    {
      /* Percentage subtext */
    }
                    <text
      x={cx}
      y={cy + 10}
      textAnchor="middle"
      fill={isSelected ? "#E2E8F0" : "#64748B"}
      fontSize="9px"
      fontWeight="600"
      className="font-mono select-none pointer-events-none"
    >
                      %{skill.percentage}
                    </text>
                  </g>;
  })}
            </g>
          </svg>

          {
    /* In-canvas Quick Legend */
  }
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs border border-[#E3E7ED] rounded-lg px-3.5 py-2.5 text-[11px] shadow-xs flex flex-wrap items-center gap-3.5">
            <div className="flex items-center gap-1.5 text-[#202938]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#243B64]" />
              <span className="font-semibold">Doğrulanmış Beceri</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#202938]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5276A7]" />
              <span className="font-semibold">Geliştirilmekte</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#92400E]">
              <span className="w-2.5 h-2.5 rounded-full border border-[#D97706] bg-[#FEF3C7]" />
              <span className="font-semibold">Hedef Boşluğu</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#64748B]">
              <span className="w-4 h-0.5 bg-[#CBD5E1]" />
              <span>İlişkili Bağlantı</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export {
  KnowledgeGraphView
};

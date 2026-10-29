const initialSkillsData = [
  {
    id: "skill-react",
    name: "React",
    category: "frontend",
    categoryLabel: "\xD6n Y\xFCz (Frontend)",
    level: "advanced",
    levelLabel: "\u0130leri Seviye",
    percentage: 92,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "10 Mart 2026",
    detectedSource: "CV Ayr\u0131\u015Ft\u0131rmas\u0131 & Bitirme Projesi",
    x: 400,
    y: 260,
    radius: 38,
    connections: ["skill-typescript", "skill-nextjs", "skill-tailwind", "skill-javascript", "skill-uiux"],
    evidences: [
      {
        id: "ev-1",
        type: "project",
        title: "CareerPath \u2014 Kariyer Platformu",
        date: "\u015Eubat 2026",
        description: "React 19, TypeScript ve Tailwind CSS ile mod\xFCler SPA geli\u015Ftirildi."
      },
      {
        id: "ev-2",
        type: "certificate",
        title: "Meta Front-End Developer Professional Certificate",
        date: "A\u011Fustos 2024",
        description: "Coursera \xFCzerinden tamamlanan akredite sertifika program\u0131."
      },
      {
        id: "ev-3",
        type: "cv",
        title: "Teknoloji Ar-Ge A.\u015E. Stajyerli\u011Fi",
        date: "Eyl\xFCl 2024",
        description: "4+ y\xF6netim paneli mod\xFCl\xFC geli\u015Ftirildi."
      }
    ],
    history: [
      {
        id: "h-1",
        date: "Ekim 2022",
        title: "Ba\u015Flang\u0131\xE7 Seviyesi",
        change: "\xDCniversite Web Programlama dersinde temel component mimarisi \xF6\u011Frenildi.",
        source: "Akademik E\u011Fitim"
      },
      {
        id: "h-2",
        date: "A\u011Fustos 2024",
        title: "Orta D\xFCzeye Ge\xE7i\u015F",
        change: "Meta Front-End sertifikas\u0131 tamamland\u0131, Custom Hook ve Context API uyguland\u0131.",
        source: "Coursera / Meta"
      },
      {
        id: "h-3",
        date: "Mart 2026",
        title: "\u0130leri Seviye Do\u011Frulama (%92)",
        change: "CV analizi ve portfolyo projeleriyle do\u011Frulanm\u0131\u015F uzman seviyesine ula\u015F\u0131ld\u0131.",
        source: "CareerPath AI Motoru"
      }
    ],
    relatedProjects: ["CareerPath Platformu", "Y\xF6netim Paneli Mod\xFCl\xFC", "Ak\u0131ll\u0131 Ders Takip\xE7isi"],
    relatedCourses: ["Meta Front-End Developer", "Modern React & Redux Bootcamp"],
    nextSteps: [
      "React 19 Server Actions ve useActionState kancalar\u0131n\u0131 derinlemesine inceleyin.",
      "Bile\u015Fen performans profilleme (React Profiler) testleri uygulay\u0131n.",
      "Birim test kapsam\u0131n\u0131 Jest ve React Testing Library ile %85 \xFCzerine \xE7\u0131kar\u0131n."
    ]
  },
  {
    id: "skill-typescript",
    name: "TypeScript",
    category: "programming",
    categoryLabel: "Programlama Dili",
    level: "advanced",
    levelLabel: "\u0130leri Seviye",
    percentage: 88,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "05 Mart 2026",
    detectedSource: "CV Ayr\u0131\u015Ft\u0131rmas\u0131 & GitHub Repolar\u0131",
    x: 270,
    y: 200,
    radius: 34,
    connections: ["skill-react", "skill-javascript", "skill-nodejs"],
    evidences: [
      {
        id: "ev-ts-1",
        type: "project",
        title: "CareerPath Kod Taban\u0131",
        date: "Ocak 2026",
        description: "Tam tip g\xFCvenli\u011Fi, generic aray\xFCzler ve strict compiler ayarlar\u0131."
      },
      {
        id: "ev-ts-2",
        type: "certificate",
        title: "BTK Akademi TypeScript Uzmanl\u0131\u011F\u0131",
        date: "May\u0131s 2024",
        description: "Temel ve ileri seviye tip sistemleri e\u011Fitimi."
      }
    ],
    history: [
      {
        id: "h-ts-1",
        date: "2023",
        title: "Temel Tipler",
        change: "JavaScript projelerine tip tan\u0131mlamalar\u0131 eklenmeye ba\u015Fland\u0131.",
        source: "Ki\u015Fisel \xC7al\u0131\u015Fma"
      },
      {
        id: "h-ts-2",
        date: "2025",
        title: "\u0130leri Seviye Tipler",
        change: "Generics, Conditional Types ve Mapped Types yetkinlikleri kazan\u0131ld\u0131.",
        source: "A\xE7\u0131k Kaynak Katk\u0131s\u0131"
      }
    ],
    relatedProjects: ["CareerPath Platformu", "TypeScript Veri Do\u011Frulay\u0131c\u0131"],
    relatedCourses: ["BTK Akademi TypeScript", "Understanding TypeScript (Udemy)"],
    nextSteps: [
      "Zod veya TypeBox ile \xE7al\u0131\u015Fma zaman\u0131 (runtime) tip do\u011Frulama k\xFCt\xFCphanelerini entegre edin.",
      "Monorepo mimarisinde payla\u015F\u0131ml\u0131 type k\xFCt\xFCphaneleri olu\u015Fturun."
    ]
  },
  {
    id: "skill-javascript",
    name: "JavaScript (ES6+)",
    category: "programming",
    categoryLabel: "Programlama Dili",
    level: "advanced",
    levelLabel: "\u0130leri Seviye",
    percentage: 95,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "01 Mart 2026",
    detectedSource: "CV Ayr\u0131\u015Ft\u0131rmas\u0131",
    x: 180,
    y: 320,
    radius: 36,
    connections: ["skill-typescript", "skill-react", "skill-nodejs"],
    evidences: [
      {
        id: "ev-js-1",
        type: "cv",
        title: "3 Y\u0131ll\u0131k Web Geli\u015Ftirme Deneyimi",
        date: "2023 - 2026",
        description: "Asenkron programlama, Event Loop, DOM optimizasyonu."
      }
    ],
    history: [
      {
        id: "h-js-1",
        date: "2021",
        title: "\xD6\u011Frenildi",
        change: "Temel s\xF6zdizimi ve fonksiyonel programlama prensipleri.",
        source: "\xDCniversite Dersi"
      }
    ],
    relatedProjects: ["T\xFCm Web Projeleri"],
    relatedCourses: ["JavaScript: The Hard Parts", "Modern JS from the Beginning"],
    nextSteps: ["V8 motoru optimizasyonlar\u0131 ve bellek y\xF6netimi prensiplerini inceleyin."]
  },
  {
    id: "skill-tailwind",
    name: "Tailwind CSS",
    category: "frontend",
    categoryLabel: "\xD6n Y\xFCz (Frontend)",
    level: "advanced",
    levelLabel: "\u0130leri Seviye",
    percentage: 90,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "08 Mart 2026",
    detectedSource: "CV & Portfolyo Projeleri",
    x: 520,
    y: 190,
    radius: 32,
    connections: ["skill-react", "skill-uiux"],
    evidences: [
      {
        id: "ev-tw-1",
        type: "project",
        title: "Tasar\u0131m Sistemi Uygulamas\u0131",
        date: "2025",
        description: "Tailwind v4 tabanl\u0131 \xF6zel tema tokenlar\u0131 ve responsive bile\u015Fenler."
      }
    ],
    history: [],
    relatedProjects: ["CareerPath UI Tasar\u0131m\u0131", "Portfolyo Web Sitesi"],
    relatedCourses: ["Tailwind CSS Masterclass"],
    nextSteps: ["Tailwind v4 CSS-first tema konfig\xFCrasyonlar\u0131n\u0131 kurumsal projelerde standartla\u015Ft\u0131r\u0131n."]
  },
  {
    id: "skill-nextjs",
    name: "Next.js",
    category: "frontend",
    categoryLabel: "\xD6n Y\xFCz & Full-Stack",
    level: "intermediate",
    levelLabel: "Orta Seviye",
    percentage: 55,
    status: "learning",
    statusLabel: "Geli\u015Ftirilmekte Olan",
    lastUpdated: "12 \u015Eubat 2026",
    detectedSource: "CV Hedef Analizi & Kurs",
    x: 530,
    y: 350,
    radius: 30,
    connections: ["skill-react", "skill-nodejs"],
    evidences: [
      {
        id: "ev-nx-1",
        type: "course",
        title: "Next.js 14 App Router Rehberi",
        date: "Ocak 2026",
        description: "Server Components ve SSR mimarisi \xFCzerinde pratik \xE7al\u0131\u015Fmalar."
      }
    ],
    history: [
      {
        id: "h-nx-1",
        date: "Ocak 2026",
        title: "\xD6\u011Frenilmeye Ba\u015Fland\u0131",
        change: "Hedef Frontend pozisyonlar\u0131 i\xE7in Next.js \xF6\u011Frenim rotas\u0131na ba\u015Fland\u0131.",
        source: "Hedef Belirleme"
      }
    ],
    relatedProjects: ["Deneme Blog Projesi"],
    relatedCourses: ["Next.js Official Learn Course"],
    nextSteps: [
      "Server-Side Rendering (SSR) ve Incremental Static Regeneration (ISR) mekanizmalar\u0131n\u0131 uygulay\u0131n.",
      "API Routes ve Server Actions ile full-stack bir prototip tamamlay\u0131n."
    ]
  },
  {
    id: "skill-sql",
    name: "SQL / PostgreSQL",
    category: "database",
    categoryLabel: "Veri Taban\u0131",
    level: "intermediate",
    levelLabel: "Orta Seviye",
    percentage: 78,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "28 \u015Eubat 2026",
    detectedSource: "CV Ayr\u0131\u015Ft\u0131rmas\u0131 & \xDCniversite Projeleri",
    x: 230,
    y: 470,
    radius: 34,
    connections: ["skill-nodejs", "skill-python", "skill-backend"],
    evidences: [
      {
        id: "ev-sql-1",
        type: "project",
        title: "Ak\u0131ll\u0131 G\xF6rev Takip\xE7isi Veritaban\u0131 Mimarisi",
        date: "2024",
        description: "PostgreSQL ili\u015Fkisel \u015Fema tasar\u0131m\u0131, foreign key ve indeksleme."
      }
    ],
    history: [],
    relatedProjects: ["Ak\u0131ll\u0131 G\xF6rev Planlay\u0131c\u0131", "\xD6\u011Frenci Bilgi Sistemi Projesi"],
    relatedCourses: ["Veritaban\u0131 Y\xF6netim Sistemleri (Ders)"],
    nextSteps: ["Karma\u015F\u0131k sorgularda JOIN optimizasyonu ve indeksleme stratejilerini peki\u015Ftirin."]
  },
  {
    id: "skill-nodejs",
    name: "Node.js & Express",
    category: "backend",
    categoryLabel: "Arka Y\xFCz (Backend)",
    level: "intermediate",
    levelLabel: "Orta Seviye",
    percentage: 72,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "20 \u015Eubat 2026",
    detectedSource: "CV Ayr\u0131\u015Ft\u0131rmas\u0131",
    x: 370,
    y: 430,
    radius: 32,
    connections: ["skill-javascript", "skill-sql", "skill-docker", "skill-restapi"],
    evidences: [
      {
        id: "ev-node-1",
        type: "project",
        title: "RESTful API Servisleri",
        date: "2024",
        description: "JWT kimlik do\u011Frulama ve middleware mekanizmalar\u0131."
      }
    ],
    history: [],
    relatedProjects: ["Ak\u0131ll\u0131 G\xF6rev Takip\xE7isi API"],
    relatedCourses: ["The Complete Node.js Developer Course"],
    nextSteps: ["Mikroservis mimarisi ve mesaj kuyruklar\u0131 (RabbitMQ/Kafka) konseptlerini inceleyin."]
  },
  {
    id: "skill-git",
    name: "Git & GitHub",
    category: "devops",
    categoryLabel: "Ara\xE7lar & DevOps",
    level: "advanced",
    levelLabel: "\u0130leri Seviye",
    percentage: 89,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "09 Mart 2026",
    detectedSource: "CV Ayr\u0131\u015Ft\u0131rmas\u0131 & GitHub Profili",
    x: 650,
    y: 260,
    radius: 34,
    connections: ["skill-react", "skill-docker"],
    evidences: [
      {
        id: "ev-git-1",
        type: "github",
        title: "GitHub A\xE7\u0131k Kaynak Katk\u0131lar\u0131",
        date: "2023 - 2026",
        description: "Branching stratejileri, PR incelemeleri ve Git Flow i\u015F ak\u0131\u015F\u0131."
      }
    ],
    history: [],
    relatedProjects: ["T\xFCm Projeler"],
    relatedCourses: ["Git & GitHub Bootcamp"],
    nextSteps: ["GitHub Actions ile otomatik CI/CD test ve da\u011F\u0131t\u0131m pipeline'lar\u0131 kurun."]
  },
  {
    id: "skill-docker",
    name: "Docker",
    category: "devops",
    categoryLabel: "Ara\xE7lar & DevOps",
    level: "beginner",
    levelLabel: "Ba\u015Flang\u0131\xE7 Seviyesi",
    percentage: 35,
    status: "gap",
    statusLabel: "Geli\u015Ftirilmesi Gereken (Hedef Bo\u015Flu\u011Fu)",
    lastUpdated: "15 Ocak 2026",
    detectedSource: "Hedef Rol Analizi (Eksik Beceri)",
    x: 670,
    y: 420,
    radius: 28,
    connections: ["skill-nodejs", "skill-git"],
    evidences: [],
    history: [
      {
        id: "h-dk-1",
        date: "Ocak 2026",
        title: "Hedef Bo\u015Flu\u011Fu Tespit Edildi",
        change: "Hedef pozisyon ilanlar\u0131nda %75 oran\u0131nda arand\u0131\u011F\u0131 i\xE7in geli\u015Fim rotas\u0131na eklendi.",
        source: "CareerPath AI Gap Analysis"
      }
    ],
    relatedProjects: [],
    relatedCourses: ["Docker & Kubernetes: The Practical Guide"],
    nextSteps: [
      "Frontend ve Backend projelerini Dockerfile ile container haline getirin.",
      "docker-compose ile \xE7oklu servis \xE7al\u0131\u015Ft\u0131rma pratikleri yap\u0131n."
    ]
  },
  {
    id: "skill-uiux",
    name: "UI / UX & Figma",
    category: "design",
    categoryLabel: "Tasar\u0131m & Metodoloji",
    level: "intermediate",
    levelLabel: "Orta Seviye",
    percentage: 75,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "02 Mart 2026",
    detectedSource: "CV Ayr\u0131\u015Ft\u0131rmas\u0131 & Portfolyo",
    x: 410,
    y: 110,
    radius: 30,
    connections: ["skill-react", "skill-tailwind"],
    evidences: [
      {
        id: "ev-ui-1",
        type: "project",
        title: "Figma Tasar\u0131m Sistemi & Wireframe",
        date: "2025",
        description: "Kullan\u0131c\u0131 odakl\u0131 aray\xFCz prototipleri ve tasar\u0131m tokenlar\u0131 haz\u0131rland\u0131."
      }
    ],
    history: [],
    relatedProjects: ["CareerPath Aray\xFCz Tasar\u0131m\u0131"],
    relatedCourses: ["Google UX Design Certificate"],
    nextSteps: ["Kullan\u0131labilirlik testleri ve A/B test metodolojileri \xFCzerinde deneyim kazan\u0131n."]
  },
  {
    id: "skill-python",
    name: "Python",
    category: "programming",
    categoryLabel: "Programlama Dili",
    level: "intermediate",
    levelLabel: "Orta Seviye",
    percentage: 70,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "14 Ocak 2026",
    detectedSource: "\xDCniversite Projeleri & CV",
    x: 120,
    y: 440,
    radius: 30,
    connections: ["skill-sql"],
    evidences: [
      {
        id: "ev-py-1",
        type: "project",
        title: "Veri Analiti\u011Fi Scriptleri",
        date: "2024",
        description: "Pandas ve Matplotlib ile akademik veri i\u015Fleme."
      }
    ],
    history: [],
    relatedProjects: ["Akademik Veri Analizleri"],
    relatedCourses: ["Python for Data Science Bootcamp"],
    nextSteps: ["FastAPI ile hafif mikroservisler geli\u015Ftirerek Python yetkinli\u011Finizi modernle\u015Ftirin."]
  },
  {
    id: "skill-restapi",
    name: "RESTful API",
    category: "architecture",
    categoryLabel: "Mimari & \u0130leti\u015Fim",
    level: "advanced",
    levelLabel: "\u0130leri Seviye",
    percentage: 86,
    status: "mastered",
    statusLabel: "\xD6\u011Frenilmi\u015F & Do\u011Frulanm\u0131\u015F",
    lastUpdated: "04 Mart 2026",
    detectedSource: "CV Ayr\u0131\u015Ft\u0131rmas\u0131 & Deneyim",
    x: 310,
    y: 350,
    radius: 32,
    connections: ["skill-react", "skill-nodejs"],
    evidences: [],
    history: [],
    relatedProjects: ["CareerPath API Entegrasyonu", "Staj Y\xF6netim Paneli"],
    relatedCourses: [],
    nextSteps: ["GraphQL ve gRPC gibi alternatif API mimarilerini ke\u015Ffedin."]
  }
];
export {
  initialSkillsData
};

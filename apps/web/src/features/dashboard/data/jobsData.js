const initialJobListings = [
  {
    id: "job-1",
    title: "Senior Frontend Geli\u015Ftirici (React & TypeScript)",
    company: "Getir Tech",
    companyLogoText: "GT",
    companyColor: "#5D3EBC",
    location: "\u0130stanbul (Levent)",
    workModel: "hybrid",
    workModelLabel: "Hibrit (Haftada 2 g\xFCn ofis)",
    salaryRange: "\u20BA85.000 - \u20BA110.000 / Ay",
    category: "frontend",
    experienceLevel: "Mid-Senior (3-5 Y\u0131l)",
    postedDate: "Bug\xFCn",
    deadline: "24 Ekim 2026",
    externalUrl: "https://getir.com/kariyer/",
    platformName: "Getir Kariyer Portal\u0131",
    matchScore: 94,
    matchBreakdown: {
      technicalSkills: 96,
      experience: 90,
      education: 95,
      workModel: 95
    },
    matchingSkills: ["React", "TypeScript", "Tailwind CSS", "Git & GitHub", "RESTful API"],
    missingSkills: ["Docker", "GraphQL"],
    matchRationale: "CV'nizdeki React 19, kat\u0131 tip g\xFCvenli TypeScript ve modern component mimarisi deneyiminiz ilandaki \xF6ncelikli ihtiya\xE7larla %94 oran\u0131nda \xF6rt\xFC\u015F\xFCyor. Eksik g\xF6r\xFCnen Docker bilgisi i\u015Fe al\u0131m i\xE7in ikincil \xF6ncelikli olarak i\u015Faretlenmi\u015Ftir.",
    description: "Getir kullan\u0131c\u0131 aray\xFCzlerini ve kurye takip panellerini modern React ve TypeScript altyap\u0131s\u0131yla yeniden \u015Fekillendirecek, y\xFCksek performansl\u0131 ve mikro-frontend mimarilerine yatk\u0131n K\u0131demli \xD6n Y\xFCz M\xFChendisi ar\u0131yoruz.",
    responsibilities: [
      "Y\xFCksek trafikli m\xFC\u015Fteri aray\xFCzlerinin React 19 ve TypeScript ile geli\u015Ftirilmesi ve optimizasyonu",
      "Tasar\u0131m sistemi bile\u015Fen k\xFCt\xFCphanesinin (Design System) s\xFCrd\xFCr\xFClmesi ve eri\u015Filebilirlik (WCAG AA) standartlar\u0131na uyarlanmas\u0131",
      "RESTful ve WebSocket tabanl\u0131 canl\u0131 veri ak\u0131\u015Flar\u0131n\u0131n kullan\u0131c\u0131 panellerine entegrasyonu",
      "Birim ve entegrasyon testlerinin (Jest, RTL) yaz\u0131lmas\u0131, kod inceleme s\xFCre\xE7lerine liderlik edilmesi"
    ],
    requirements: [
      "En az 3 y\u0131l modern React ve TypeScript ile ticari web geli\u015Ftirme deneyimi",
      "Derinlemesine JavaScript (ES6+), taray\u0131c\u0131 performans profilleme ve rendering ya\u015Fam d\xF6ng\xFCs\xFC bilgisi",
      "Tailwind CSS veya modern CSS-in-JS \xE7\xF6z\xFCmlerinde ileri d\xFCzey yetkinlik",
      "Git i\u015F ak\u0131\u015Flar\u0131, branch stratejileri ve CI/CD s\xFCre\xE7lerine a\u015Final\u0131k",
      "Tercihen Next.js veya Mikro-Frontend mimarileriyle \xE7al\u0131\u015Fma deneyimi"
    ],
    benefits: [
      "\xD6zel Sa\u011Fl\u0131k Sigortas\u0131 (Aile Kapsaml\u0131)",
      "Ayl\u0131k Yemek & Getir Al\u0131\u015Fveri\u015F \xC7eki",
      "Teknoloji B\xFCt\xE7esi (MacBook Pro M3 Max)",
      "S\xFCrekli E\u011Fitim & Konferans Kat\u0131l\u0131m Deste\u011Fi"
    ],
    isSaved: true
  },
  {
    id: "job-2",
    title: "React & Next.js Web M\xFChendisi",
    company: "Trendyol Group",
    companyLogoText: "TY",
    companyColor: "#F27A1A",
    location: "\u0130stanbul / Maslak",
    workModel: "remote",
    workModelLabel: "Tamamen Uzaktan (Remote)",
    salaryRange: "\u20BA90.000 - \u20BA120.000 / Ay",
    category: "frontend",
    experienceLevel: "Mid-Level (2-4 Y\u0131l)",
    postedDate: "1 g\xFCn \xF6nce",
    deadline: "28 Ekim 2026",
    externalUrl: "https://careers.trendyol.com/",
    platformName: "Trendyol Careers",
    matchScore: 89,
    matchBreakdown: {
      technicalSkills: 88,
      experience: 90,
      education: 90,
      workModel: 100
    },
    matchingSkills: ["React", "TypeScript", "RESTful API", "Git & GitHub"],
    missingSkills: ["Next.js (App Router)", "CI/CD Pipeline"],
    matchRationale: "Uzaktan \xE7al\u0131\u015Fma tercihiniz ve g\xFC\xE7l\xFC React/TypeScript temeliniz ilanla kusursuz e\u015Fle\u015Fiyor. Yol haritan\u0131z\u0131n 3. a\u015Famas\u0131nda yer alan Next.js bilgisi m\xFClakatta art\u0131 puan sa\u011Flayacakt\u0131r.",
    description: "Milyonlarca aktif e-ticaret kullan\u0131c\u0131s\u0131na hizmet veren Trendyol web platformunun kullan\u0131c\u0131 deneyimini, SSR performans\u0131n\u0131 ve SEO optimizasyonunu geli\u015Ftirecek tak\u0131m arkada\u015F\u0131 ar\u0131yoruz.",
    responsibilities: [
      "\xDCr\xFCn listeleme ve sipari\u015F ak\u0131\u015Flar\u0131n\u0131n Next.js App Router ile geli\u015Ftirilmesi",
      "Core Web Vitals skorlar\u0131n\u0131n 95+ seviyesinde tutulmas\u0131 i\xE7in performans optimizasyonu",
      "B\xFCy\xFCk \xF6l\xE7ekli durum y\xF6netimi ve API \xF6nbellekleme mimarilerinin kurulmas\u0131"
    ],
    requirements: [
      "React ve TypeScript ekosisteminde g\xFC\xE7l\xFC bilgi birikimi",
      "SSR, SSG ve modern web mimarilerine hakimiyet",
      "Performans optimizasyonu ve bundle boyutunu k\xFC\xE7\xFCltme deneyimi",
      "Ekip \xE7al\u0131\u015Fmas\u0131na yatk\u0131nl\u0131k ve \u015Feffaf ileti\u015Fim becerisi"
    ],
    benefits: [
      "Tamamen Esnek ve Uzaktan \xC7al\u0131\u015Fma",
      "Trendyol C\xFCzdan Bakiyesi ve Yemek Kart\u0131",
      "Kapsaml\u0131 Sa\u011Fl\u0131k & Hayat Sigortas\u0131",
      "Y\u0131ll\u0131k Ki\u015Fisel Geli\u015Fim B\xFCt\xE7esi ($1.200)"
    ],
    isSaved: false
  },
  {
    id: "job-3",
    title: "Frontend Platform M\xFChendisi",
    company: "Insider (Unicorn)",
    companyLogoText: "IN",
    companyColor: "#00B2A9",
    location: "\u0130stanbul (Maslak) / Uzaktan",
    workModel: "remote",
    workModelLabel: "Tamamen Uzaktan (Remote)",
    salaryRange: "\u20BA95.000 - \u20BA130.000 / Ay",
    category: "frontend",
    experienceLevel: "Senior (4+ Y\u0131l)",
    postedDate: "2 g\xFCn \xF6nce",
    deadline: "02 Kas\u0131m 2026",
    externalUrl: "https://insiderone.com/careers/",
    platformName: "Insider Global Careers",
    matchScore: 92,
    matchBreakdown: {
      technicalSkills: 94,
      experience: 88,
      education: 95,
      workModel: 100
    },
    matchingSkills: ["React", "TypeScript", "Tailwind CSS", "UI / UX & Figma", "RESTful API"],
    missingSkills: ["Docker", "AWS"],
    matchRationale: "Figma tasar\u0131m\u0131 ile React aras\u0131ndaki k\xF6pr\xFCy\xFC kurma yetkinli\u011Finiz ve temiz TypeScript kodlama stiliniz Insider SaaS platformunun gereksinimleriyle do\u011Frudan \xF6rt\xFC\u015F\xFCyor.",
    description: "K\xFCresel \xF6l\xE7ekte 28 \xFClkede kullan\u0131lan Insider B2B AI pazarlama platformunun kurumsal analitik aray\xFCzlerini ve kampanya y\xF6netim ara\xE7lar\u0131n\u0131 geli\u015Ftirecek m\xFChendisler ar\u0131yoruz.",
    responsibilities: [
      "B\xFCy\xFCk veri g\xF6rselle\u015Ftirme panolar\u0131n\u0131n ve interaktif dashboardlar\u0131n in\u015Fas\u0131",
      "Yeniden kullan\u0131labilir UI bile\u015Fen kitapl\u0131\u011F\u0131n\u0131n mimari y\xF6netimi",
      "Tasar\u0131m ve \xFCr\xFCn ekipleriyle yak\u0131n temas halinde kullan\u0131c\u0131 testlerinin y\xFCr\xFCt\xFClmesi"
    ],
    requirements: [
      "Modern web teknolojilerinde (React, TypeScript) en az 3 y\u0131l kan\u0131tlanm\u0131\u015F deneyim",
      "Karma\u015F\u0131k durum y\xF6netimi ve grafik/veri g\xF6rselle\u015Ftirme deneyimi",
      "\xC7oklu dil (i18n) ve tema deste\u011Fi olan enterprise projelerde \xE7al\u0131\u015Fm\u0131\u015F olmak"
    ],
    benefits: [
      "Global Hissedarl\u0131k / Stock Options (ESOP)",
      "S\u0131n\u0131rs\u0131z \u0130zin Politikas\u0131",
      "\u0130ngilizce Dil E\u011Fitimi ve Yurt D\u0131\u015F\u0131 Ofis Ziyaretleri",
      "En \xDCst Seviye Donan\u0131m Paketi"
    ],
    isSaved: true
  },
  {
    id: "job-4",
    title: "Full-Stack / Frontend Web Developer",
    company: "Hepsiburada",
    companyLogoText: "HB",
    companyColor: "#FF6000",
    location: "Kocaeli (Gebze) & \u0130stanbul",
    workModel: "hybrid",
    workModelLabel: "Hibrit (1 g\xFCn ofis)",
    salaryRange: "\u20BA75.000 - \u20BA95.000 / Ay",
    category: "fullstack",
    experienceLevel: "Mid-Level (2-4 Y\u0131l)",
    postedDate: "3 g\xFCn \xF6nce",
    deadline: "15 Kas\u0131m 2026",
    externalUrl: "https://hepsiburada.com/kariyer",
    platformName: "Hepsiburada Kariyer",
    matchScore: 82,
    matchBreakdown: {
      technicalSkills: 80,
      experience: 85,
      education: 85,
      workModel: 85
    },
    matchingSkills: ["React", "JavaScript (ES6+)", "SQL / PostgreSQL", "Git & GitHub"],
    missingSkills: ["Node.js & Express", "Redis"],
    matchRationale: "Frontend bilginiz ve PostgreSQL veri modelleme tecr\xFCbeniz pozisyon i\xE7in sa\u011Flam bir altyap\u0131 sunuyor. Backend taraf\u0131ndaki Node.js gereksinimi i\xE7in e\u011Fitim tavsiyelerimiz mevcuttur.",
    description: "Pazaryeri sat\u0131c\u0131 paneli ve lojistik y\xF6netim ara\xE7lar\u0131n\u0131n kullan\u0131c\u0131 dostu, hatas\u0131z ve h\u0131zl\u0131 \xE7al\u0131\u015Fmas\u0131n\u0131 sa\u011Flayacak yaz\u0131l\u0131m m\xFChendisi aray\u0131\u015F\u0131nday\u0131z.",
    responsibilities: [
      "Sat\u0131c\u0131 analitik ekranlar\u0131n\u0131n ve \xFCr\xFCn y\xFCkleme sihirbazlar\u0131n\u0131n geli\u015Ftirilmesi",
      "\u0130li\u015Fkisel veritaban\u0131 sorgular\u0131 ve mikroservis entegrasyonlar\u0131n\u0131n yap\u0131lmas\u0131"
    ],
    requirements: [
      "React ve \xE7a\u011Fda\u015F web standartlar\u0131nda en az 2 y\u0131l deneyim",
      "Veritaban\u0131 ili\u015Fkileri ve SQL sorgulama bilgisi",
      "Agile / Scrum metodolojileriyle \xE7al\u0131\u015Fma al\u0131\u015Fkanl\u0131\u011F\u0131"
    ],
    benefits: [
      "\xD6zel Sa\u011Fl\u0131k Sigortas\u0131",
      "\u015Eirket Servisi ve Hibrit Esneklik",
      "Hepsiburada Premium ve \xC7al\u0131\u015Fan \u0130ndirimleri"
    ],
    isSaved: false
  },
  {
    id: "job-5",
    title: "Fintech UI & Frontend Developer",
    company: "Papara",
    companyLogoText: "PA",
    companyColor: "#1A1A1A",
    location: "\u0130stanbul (\xDCsk\xFCdar)",
    workModel: "hybrid",
    workModelLabel: "Hibrit (2 g\xFCn ofis)",
    salaryRange: "\u20BA80.000 - \u20BA105.000 / Ay",
    category: "frontend",
    experienceLevel: "Mid-Level (2-4 Y\u0131l)",
    postedDate: "4 g\xFCn \xF6nce",
    deadline: "10 Kas\u0131m 2026",
    externalUrl: "https://www.papara.com/kariyer",
    platformName: "Papara Kariyer",
    matchScore: 86,
    matchBreakdown: {
      technicalSkills: 89,
      experience: 82,
      education: 90,
      workModel: 85
    },
    matchingSkills: ["React", "TypeScript", "Tailwind CSS", "UI / UX & Figma"],
    missingSkills: ["Fintech G\xFCvenlik Standartlar\u0131", "Webpack / Vite Plugin"],
    matchRationale: "Tasar\u0131m odakl\u0131 yakla\u015F\u0131m\u0131n\u0131z, Figma kullan\u0131m\u0131 ve temiz UI bile\u015Fenleri geli\u015Ftirme beceriniz Papara'n\u0131n y\xFCksek tasar\u0131m standartlar\u0131yla tam olarak \xF6rt\xFC\u015F\xFCyor.",
    description: "Kullan\u0131c\u0131lar\u0131n finansal i\u015Flemlerini saniyeler i\xE7inde g\xFCvenle ger\xE7ekle\u015Ftirdi\u011Fi web aray\xFCzlerimizi geli\u015Ftirecek, piksel hassasiyetinde \xE7al\u0131\u015Fan UI m\xFChendisi ar\u0131yoruz.",
    responsibilities: [
      "Yeni nesil para transferi ve yat\u0131r\u0131m mod\xFCllerinin React ile kodlanmas\u0131",
      "Tasar\u0131m ekibiyle yak\u0131n \xE7al\u0131\u015Farak mikro-animasyonlar ve p\xFCr\xFCzs\xFCz ge\xE7i\u015Fler \xFCretme"
    ],
    requirements: [
      "React ve TypeScript ile \xFCretim ortam\u0131nda en az 2 y\u0131l tecr\xFCbe",
      "G\xF6z al\u0131c\u0131 UI/UX esteti\u011Fi ve Tailwind CSS ustal\u0131\u011F\u0131",
      "Y\xFCksek g\xFCvenlik ve veri do\u011Frulama prensiplerine dikkat etme"
    ],
    benefits: [
      "Piyasa \xDCst\xFC \xDCcret Paketi & Y\u0131ll\u0131k Prim",
      "\xD6zel Sa\u011Fl\u0131k ve Di\u015F Sigortas\u0131",
      "Spor Salonu \xDCyeli\u011Fi & Sa\u011Fl\u0131kl\u0131 Ya\u015Fam Paketi"
    ],
    isSaved: true
  },
  {
    id: "job-6",
    title: "Mid Frontend Developer (Web Ekibi)",
    company: "Yemeksepeti / Delivery Hero",
    companyLogoText: "YS",
    companyColor: "#EA004B",
    location: "\u0130stanbul (Maslak) / Hibrit",
    workModel: "hybrid",
    workModelLabel: "Hibrit (Haftada 1 g\xFCn)",
    salaryRange: "\u20BA70.000 - \u20BA90.000 / Ay",
    category: "frontend",
    experienceLevel: "Junior-Mid (1-3 Y\u0131l)",
    postedDate: "5 g\xFCn \xF6nce",
    deadline: "18 Kas\u0131m 2026",
    externalUrl: "https://kariyer.yemeksepeti.com/",
    platformName: "Yemeksepeti Kariyer",
    matchScore: 96,
    matchBreakdown: {
      technicalSkills: 98,
      experience: 94,
      education: 95,
      workModel: 96
    },
    matchingSkills: ["React", "JavaScript (ES6+)", "Tailwind CSS", "Git & GitHub", "RESTful API"],
    missingSkills: ["A/B Testing Ara\xE7lar\u0131"],
    matchRationale: "CV'nizdeki deneyim seviyesi ve temel yetkinlikleriniz bu pozisyonun t\xFCm gereksinimlerini fazlas\u0131yla kar\u015F\u0131l\u0131yor. En y\xFCksek uyum sa\u011Flanan ilanlardan biridir.",
    description: "Restoran listeleme, sepet ve \xF6deme sayfalar\u0131n\u0131n h\u0131z\u0131n\u0131 art\u0131racak ve kullan\u0131c\u0131 d\xF6n\xFC\u015F\xFCm oranlar\u0131n\u0131 optimize edecek motivasyonu y\xFCksek frontend geli\u015Ftirici ar\u0131yoruz.",
    responsibilities: [
      "Web sipari\u015F ak\u0131\u015Flar\u0131n\u0131n modern JavaScript ve React ile geli\u015Ftirilmesi",
      "A/B test deneylerinin aray\xFCze entegre edilmesi"
    ],
    requirements: [
      "Modern JavaScript ve React ile en az 1.5 y\u0131l tecr\xFCbe",
      "Responsive tasar\u0131m ve mobil uyumlu web geli\u015Ftirme refleksi"
    ],
    benefits: [
      "Yemeksepeti C\xFCzdan Deste\u011Fi",
      "Tam Kapsaml\u0131 \xD6zel Sa\u011Fl\u0131k Sigortas\u0131",
      "E\u011Fitim & Geli\u015Fim \u0130zinleri"
    ],
    isSaved: false
  },
  {
    id: "job-7",
    title: "Senior UI / Web Platform Engineer",
    company: "Peak Games (Zynga)",
    companyLogoText: "PG",
    companyColor: "#1E293B",
    location: "\u0130stanbul (Bebek)",
    workModel: "office",
    workModelLabel: "Ofis Odakl\u0131 (Bebek Kamp\xFCs\xFC)",
    salaryRange: "\u20BA110.000 - \u20BA145.000 / Ay",
    category: "frontend",
    experienceLevel: "Senior (5+ Y\u0131l)",
    postedDate: "1 hafta \xF6nce",
    deadline: "30 Kas\u0131m 2026",
    externalUrl: "https://peak.com/careers",
    platformName: "Peak Games Careers",
    matchScore: 78,
    matchBreakdown: {
      technicalSkills: 82,
      experience: 70,
      education: 90,
      workModel: 65
    },
    matchingSkills: ["React", "TypeScript", "Git & GitHub"],
    missingSkills: ["WebGL / Canvas", "Oyun Analiti\u011Fi", "C++ / WebAssembly"],
    matchRationale: "Temel React ve TypeScript bilginiz tam olsa da pozisyonun 5+ y\u0131l tecr\xFCbe beklentisi ve ofis \xE7al\u0131\u015Fma modeli kariyer hedeflerinizle k\u0131smi uyum g\xF6stermektedir.",
    description: "D\xFCnya \xE7ap\u0131nda y\xFCz milyonlarca oyuncuya sahip oyunlar\u0131m\u0131z\u0131n web vitrinlerini, turnuva liderlik tablolar\u0131n\u0131 ve topluluk portallar\u0131n\u0131 tasarlayacak k\u0131demli m\xFChendis.",
    responsibilities: [
      "Y\xFCksek kare h\u0131z\u0131 (60 FPS) sunan interaktif web aray\xFCzleri geli\u015Ftirme",
      "K\xFCresel da\u011F\u0131t\u0131k sunucularla ultra d\xFC\u015F\xFCk gecikmeli haberle\u015Fme"
    ],
    requirements: [
      "\u0130leri d\xFCzey web mimarisi ve karma\u015F\u0131k state y\xF6netimi",
      "Ofis ortam\u0131nda y\xFCz y\xFCze sinerji ile \xE7al\u0131\u015Fma arzusu"
    ],
    benefits: [
      "Sekt\xF6r Lideri Maa\u015F ve Y\u0131ll\u0131k Performans Primi",
      "Bo\u011Faz Manzaral\u0131 Kamp\xFCs ve Gurme Yemek",
      "\xD6zel Sa\u011Fl\u0131k ve Aile G\xFCvencesi"
    ],
    isSaved: false
  },
  {
    id: "job-8",
    title: "Remote Frontend Engineer (Open Source)",
    company: "Automattic (WordPress.com)",
    companyLogoText: "AU",
    companyColor: "#006088",
    location: "Global / T\xFCrkiye (Uzaktan)",
    workModel: "remote",
    workModelLabel: "Tamamen Uzaktan (100% Remote)",
    salaryRange: "$3.500 - $4.800 / Ay",
    category: "frontend",
    experienceLevel: "Mid-Senior (3+ Y\u0131l)",
    postedDate: "3 g\xFCn \xF6nce",
    deadline: "20 Kas\u0131m 2026",
    externalUrl: "https://automattic.com/work-with-us/",
    platformName: "Automattic Work With Us",
    matchScore: 88,
    matchBreakdown: {
      technicalSkills: 90,
      experience: 85,
      education: 90,
      workModel: 100
    },
    matchingSkills: ["React", "JavaScript (ES6+)", "Git & GitHub", "RESTful API"],
    missingSkills: ["Gutenberg Blok Geli\u015Ftirme", "PHP Temelleri"],
    matchRationale: "A\xE7\u0131k kaynak GitHub \xE7al\u0131\u015Fmalar\u0131n\u0131z, asenkron ileti\u015Fim yatk\u0131nl\u0131\u011F\u0131n\u0131z ve uzaktan \xE7al\u0131\u015Fma tercihiniz k\xFCresel da\u011F\u0131t\u0131k tak\u0131m k\xFClt\xFCr\xFCm\xFCzle y\xFCksek uyum i\xE7indedir.",
    description: "A\xE7\u0131k webi in\u015Fa eden k\xFCresel ekibimize kat\u0131larak milyonlarca web sitesinin kulland\u0131\u011F\u0131 blok edit\xF6r\xFCn\xFC ve yay\u0131nc\u0131l\u0131k ara\xE7lar\u0131n\u0131 React ile geli\u015Ftirin.",
    responsibilities: [
      "A\xE7\u0131k kaynak depolarda Pull Request incelemeleri ve yeni \xF6zellik in\u015Fas\u0131",
      "Asenkron ve yaz\u0131l\u0131 k\xFClt\xFCrle y\xFCr\xFCt\xFClen k\xFCresel toplant\u0131lar"
    ],
    requirements: [
      "Geli\u015Fmi\u015F \u0130ngilizce yaz\u0131l\u0131 ileti\u015Fim becerisi",
      "Ba\u011F\u0131ms\u0131z \xE7al\u0131\u015Fma ve problem \xE7\xF6zme disiplini"
    ],
    benefits: [
      "D\xF6viz Bazl\u0131 Maa\u015F ($ USD)",
      "D\xFCnya \xC7ap\u0131nda Y\u0131ll\u0131k \u015Eirket Kamplar\u0131",
      "Evden \xC7al\u0131\u015Fma Kurulum Deste\u011Fi ($2.000)"
    ],
    isSaved: true
  }
];
const initialJobApplications = [];
export {
  initialJobApplications,
  initialJobListings
};

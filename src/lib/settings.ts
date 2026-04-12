import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', '..', 'data');
const SETTINGS_FILE = join(DATA_DIR, 'settings.json');

export interface ServiceTag {
  text: string;
  borderColor: string;
}

export interface ServiceItem {
  id: string;
  num: string;
  active: boolean;
  order: number;
  label: Record<string, string>;       // { es: "...", ca: "..." }
  title: Record<string, string>;
  description: Record<string, string>;
  tags: ServiceTag[];
  colors: {
    numColor: string;
    labelColor: string;
    titleColor: string;
    descriptionColor: string;
    hoverBorderColor: string;
  };
}

export interface HeroSlideHeading {
  line1: string;
  line2: string;
  line3: string;
  full: string;
  dataText?: string; // SEO-optimized text for data-text attribute (schema + crawlers)
}

export interface HeroSlideTerminal {
  cmd: string;
  flag: string;
  lines: string[];
}

export interface HeroSlideButton {
  href: string;
  label: Record<string, string>;
  style: 'primary' | 'secondary';
}

export interface HeroSlide {
  id: string;
  active: boolean;
  order: number;
  duration: number;
  accentColor: 'orange' | 'teal';
  badges: Record<string, string[]>;
  heading: Record<string, HeroSlideHeading>;
  subtitle: Record<string, string>;
  terminal: Record<string, HeroSlideTerminal>;
  buttons: HeroSlideButton[];
  microcopy?: Record<string, string>;
}

export interface TypographyConfig {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
}

export type TypoElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export interface SiteSettings {
  parameters: {
    heroSlideDuration: number;
  };
  visual: {
    primaryColor: string;
    secondaryColor: string;
    customCSS: string;
  };
  heroSlides: HeroSlide[];
  services: ServiceItem[];
  typography: Record<TypoElement, TypographyConfig>;
}

const DEFAULT_TYPOGRAPHY: Record<TypoElement, TypographyConfig> = {
  h1: { fontFamily: "'Inter', sans-serif", fontSize: 'clamp(3rem,8vw,7rem)', fontWeight: '900', lineHeight: '0.9', letterSpacing: '-0.05em' },
  h2: { fontFamily: "'Inter', sans-serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: '900', lineHeight: '0.95', letterSpacing: '-0.025em' },
  h3: { fontFamily: "'Inter', sans-serif", fontSize: '1.25rem', fontWeight: '700', lineHeight: '1.3', letterSpacing: '-0.01em' },
  h4: { fontFamily: "'Inter', sans-serif", fontSize: '1.125rem', fontWeight: '700', lineHeight: '1.4', letterSpacing: '0' },
  h5: { fontFamily: "'Inter', sans-serif", fontSize: '1rem', fontWeight: '600', lineHeight: '1.4', letterSpacing: '0' },
  h6: { fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: '600', lineHeight: '1.5', letterSpacing: '0' },
  p: { fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: '400', lineHeight: '1.6', letterSpacing: '0' },
  span: { fontFamily: "'JetBrains Mono', monospace", fontSize: '0.75rem', fontWeight: '400', lineHeight: '1.5', letterSpacing: '0.05em' },
};

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    active: true,
    order: 0,
    duration: 6,
    accentColor: 'orange',
    badges: {
      es: ['CIBAI_STUDIO', 'BERGA · BARCELONA · ESPAÑA', 'IA · AUTOMATIZACIÓN · SOFTWARE'],
      ca: ['CIBAI_STUDIO', 'BERGA · BARCELONA · ESPANYA', 'IA · AUTOMATITZACIÓ · PROGRAMARI'],
    },
    heading: {
      es: {
        line1: 'LA TECNOLOGÍA NO BASTA.',
        line2: 'CONSTRUIMOS SISTEMAS DISEÑADOS',
        line3: 'PARA DURAR Y FUNCIONAR DE VERDAD.',
        full: 'La tecnología no basta. Construimos sistemas de IA, automatización y software diseñados para durar y funcionar de verdad.',
        dataText: 'CIBAI.Studio — Consultoría tecnológica en IA, automatización y software a medida para empresas',
      },
      ca: {
        line1: "LA TECNOLOGIA NO N'HI HA PROU.",
        line2: 'CONSTRUÏM SISTEMES DISSENYATS',
        line3: 'PER DURAR I FUNCIONAR DE DEBÒ.',
        full: "La tecnologia no n'hi ha prou. Construïm sistemes d'IA, automatització i programari dissenyats per durar i funcionar de debò.",
        dataText: "CIBAI.Studio — Consultoria tecnològica en IA, automatització i programari a mida per a empreses",
      },
    },
    subtitle: {
      es: 'En CIBAI.Studio diseñamos e implementamos soluciones reales de IA, automatización, software y activos digitales para que tu empresa opere mejor, venda más y escale sin multiplicar el caos.',
      ca: "A CIBAI.Studio dissenyem i implementem solucions reals d'IA, automatització, software i actius digitals perquè la teva empresa operi millor, vengui més i escali sense multiplicar el caos.",
    },
    terminal: {
      es: {
        cmd: 'cibai',
        flag: '--diagnostico',
        lines: [
          '> IA aplicada. Automatización real. Software que encaja.',
          '> Del diagnóstico a la implantación, sin atajos.',
          '> Sistemas que funcionan donde importa.',
        ],
      },
      ca: {
        cmd: 'cibai',
        flag: '--diagnostic',
        lines: [
          '> IA aplicada. Automatització real. Software que encaixa.',
          '> Del diagnòstic a la implantació, sense dreceres.',
          '> Sistemes que funcionen on importa.',
        ],
      },
    },
    buttons: [
      {
        href: '#contacto',
        label: { es: 'Solicitar diagnóstico', ca: 'Sol·licitar diagnòstic' },
        style: 'primary',
      },
      {
        href: '#servicios',
        label: { es: 'Ver qué resolvemos', ca: 'Veure què resolem' },
        style: 'secondary',
      },
    ],
    microcopy: {
      es: 'Sin demos vacías. Sin promesas infladas. Solo soluciones que funcionan donde importa: en el trabajo real de tu empresa.',
      ca: 'Sense demos buides. Sense promeses inflades. Només solucions que funcionen on importa: en el treball real de la teva empresa.',
    },
  },
  {
    id: 'slide-2',
    active: true,
    order: 1,
    duration: 6,
    accentColor: 'teal',
    badges: {
      es: ['AUTOMATIZACIÓN', 'IA APLICADA', 'EFICIENCIA OPERATIVA'],
      ca: ['AUTOMATITZACIÓ', 'IA APLICADA', 'EFICIÈNCIA OPERATIVA'],
    },
    heading: {
      es: {
        line1: 'AUTOMATIZACIÓN DE PROCESOS',
        line2: 'QUE LIBERA A TU EQUIPO',
        line3: 'PARA LO QUE GENERA VALOR REAL',
        full: 'Automatización de procesos que libera a tu equipo para lo que genera valor real.',
        dataText: 'Automatización de procesos empresariales con IA — recupera tiempo y eficiencia operativa',
      },
      ca: {
        line1: 'AUTOMATITZACIÓ DE PROCESSOS',
        line2: 'QUE ALLIBERA EL TEU EQUIP',
        line3: 'PER AL QUE GENERA VALOR REAL',
        full: 'Automatització de processos que allibera el teu equip per al que genera valor real.',
        dataText: 'Automatització de processos empresarials amb IA — recupera temps i eficiència operativa',
      },
    },
    subtitle: {
      es: 'Diseñamos e implementamos flujos inteligentes, automatizaciones e integraciones que eliminan el trabajo repetitivo, reducen errores y dan a tu equipo tiempo para lo que genera valor real.',
      ca: "Dissenyem i implementem fluxos intel·ligents, automatitzacions i integracions que eliminen el treball repetitiu, redueixen errors i donen al teu equip temps per al que genera valor real.",
    },
    terminal: {
      es: {
        cmd: 'automatizar',
        flag: '--impacto=real',
        lines: [
          '> Flujos inteligentes. Integraciones. Cero trabajo doble.',
          '> Menos tareas manuales, más tiempo para lo que importa.',
          '> Eficiencia operativa activada.',
        ],
      },
      ca: {
        cmd: 'automatitzar',
        flag: '--impacte=real',
        lines: [
          '> Fluxos intel·ligents. Integracions. Zero treball doble.',
          '> Menys tasques manuals, més temps per al que importa.',
          '> Eficiència operativa activada.',
        ],
      },
    },
    buttons: [
      {
        href: '#ia-automatizacion',
        label: { es: 'Explorar IA y automatización', ca: 'Explorar IA i automatització' },
        style: 'primary',
      },
      {
        href: '#contacto',
        label: { es: 'Solicitar diagnóstico', ca: 'Sol·licitar diagnòstic' },
        style: 'secondary',
      },
    ],
  },
  {
    id: 'slide-3',
    active: true,
    order: 2,
    duration: 6,
    accentColor: 'teal',
    badges: {
      es: ['AGENTES_IA', 'CHATBOTS RAG', 'VOZ INTELIGENTE'],
      ca: ['AGENTS_IA', 'CHATBOTS RAG', 'VEU INTEL·LIGENT'],
    },
    heading: {
      es: {
        line1: 'AGENTES IA QUE ATIENDEN,',
        line2: 'RESPONDEN Y CONVIERTEN',
        line3: 'SIN AUMENTAR TU EQUIPO.',
        full: 'Agentes IA que atienden, responden y convierten sin aumentar tu equipo.',
        dataText: 'Agentes IA, chatbots RAG y voz inteligente para empresas — atención 24/7 y conversión mejorada',
      },
      ca: {
        line1: 'AGENTS IA QUE ATENEN,',
        line2: 'RESPONEN I CONVERTEIXEN',
        line3: 'SENSE AUGMENTAR EL TEU EQUIP',
        full: 'Agents IA que atenen, responen i converteixen sense augmentar el teu equip.',
        dataText: "Agents IA, chatbots RAG i veu intel·ligent per a empreses — atenció 24/7 i conversió millorada",
      },
    },
    subtitle: {
      es: 'Construimos chatbots, agentes IA especializados, sistemas RAG y soluciones de voz inteligente que mejoran la atención, el soporte interno, las ventas y la gestión del conocimiento de tu empresa.',
      ca: "Construïm chatbots, agents IA especialitzats, sistemes RAG i solucions de veu intel·ligent que milloren l'atenció, el suport intern, les vendes i la gestió del coneixement de la teva empresa.",
    },
    terminal: {
      es: {
        cmd: 'agentes-ia',
        flag: '--modo=produccion',
        lines: [
          '> Agentes entrenados sobre tu empresa, no plantillas.',
          '> Atención 24/7 sin aumentar el equipo.',
          '> Conocimiento accesible al instante.',
        ],
      },
      ca: {
        cmd: 'agents-ia',
        flag: '--mode=produccio',
        lines: [
          "> Agents entrenats sobre la teva empresa, no plantilles.",
          "> Atenció 24/7 sense augmentar l'equip.",
          "> Coneixement accessible a l'instant.",
        ],
      },
    },
    buttons: [
      {
        href: '#agentes-ia',
        label: { es: 'Ver agentes IA y RAG', ca: 'Veure agents IA i RAG' },
        style: 'primary',
      },
      {
        href: '#contacto',
        label: { es: 'Solicitar diagnóstico', ca: 'Sol·licitar diagnòstic' },
        style: 'secondary',
      },
    ],
  },
  {
    id: 'slide-4',
    active: true,
    order: 3,
    duration: 6,
    accentColor: 'orange',
    badges: {
      es: ['WEB CORPORATIVA', 'ECOMMERCE', 'SOFTWARE A MEDIDA'],
      ca: ['WEB CORPORATIVA', 'ECOMMERCE', 'PROGRAMARI A MIDA'],
    },
    heading: {
      es: {
        line1: 'WEB, ECOMMERCE Y SOFTWARE',
        line2: 'QUE POSICIONAN EN GOOGLE',
        line3: 'Y ESCALAN CON TU NEGOCIO',
        full: 'Web, ecommerce y software que posicionan en Google y escalan con tu negocio.',
        dataText: 'Desarrollo web corporativo, ecommerce a medida y software empresarial — Barcelona, España',
      },
      ca: {
        line1: 'WEB, ECOMMERCE I SOFTWARE',
        line2: 'QUE POSICIONEN A GOOGLE',
        line3: 'I ESCALEN AMB EL TEU NEGOCI',
        full: 'Web, ecommerce i software que posicionen a Google i escalen amb el teu negoci.',
        dataText: 'Desenvolupament web corporatiu, ecommerce a mida i programari empresarial — Barcelona, Catalunya',
      },
    },
    subtitle: {
      es: 'Desarrollamos webs corporativas, ecommerce y herramientas a medida que se alinean con tus procesos reales, tu forma de vender y los objetivos concretos de tu empresa.',
      ca: "Desenvolupem webs corporatives, ecommerce i eines a mida que s'alineen amb els teus processos reals, la teva forma de vendre i els objectius concrets de la teva empresa.",
    },
    terminal: {
      es: {
        cmd: 'web-ecommerce',
        flag: '--objetivo=conversion',
        lines: [
          '> Webs que posicionan y convierten, no solo informan.',
          '> Ecommerce sólido, escalable y optimizado.',
          '> Software a medida para tu operativa real.',
        ],
      },
      ca: {
        cmd: 'web-ecommerce',
        flag: '--objectiu=conversio',
        lines: [
          '> Webs que posicionen i converteixen, no només informen.',
          '> Ecommerce sòlid, escalable i optimitzat.',
          '> Software a mida per a la teva operativa real.',
        ],
      },
    },
    buttons: [
      {
        href: '#desarrollo-web',
        label: { es: 'Ver desarrollo a medida', ca: 'Veure desenvolupament a mida' },
        style: 'primary',
      },
      {
        href: '#contacto',
        label: { es: 'Solicitar diagnóstico', ca: 'Sol·licitar diagnòstic' },
        style: 'secondary',
      },
    ],
  },
];

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'svc-1',
    num: '01',
    active: true,
    order: 0,
    label: { es: 'DISEÑO_WEB', ca: 'DISSENY_WEB' },
    title: { es: 'Diseño Web Premium', ca: 'Disseny Web Premium' },
    description: {
      es: 'Interfaces visuales que convierten. Diseño UI/UX con identidad de marca, tipografía de alto contraste y animaciones con propósito. Nada genérico, todo a medida.',
      ca: "Interfícies visuals que converteixen. Disseny UI/UX amb identitat de marca, tipografia d'alt contrast i animacions amb propòsit. Res genèric, tot a mida.",
    },
    tags: [
      { text: 'UI/UX', borderColor: '#2a2a2a' },
      { text: 'FIGMA', borderColor: '#2a2a2a' },
      { text: 'BRANDING', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
  {
    id: 'svc-2',
    num: '02',
    active: true,
    order: 1,
    label: { es: 'WEBAPPS_MEDIDA', ca: 'WEBAPPS_MIDA' },
    title: { es: 'Webapps a Medida', ca: 'Webapps a Mida' },
    description: {
      es: 'Aplicaciones web completas desde cero. React, Next.js, APIs, autenticación y dashboards. Soluciones que escalan con tu negocio y se adaptan a tus procesos.',
      ca: "Aplicacions web completes des de zero. React, Next.js, APIs, autenticació i dashboards. Solucions que escalen amb el teu negoci i s'adapten als teus processos.",
    },
    tags: [
      { text: 'NEXT.JS', borderColor: '#2a2a2a' },
      { text: 'REACT', borderColor: '#2a2a2a' },
      { text: 'TS', borderColor: '#2a2a2a' },
      { text: 'TRPC', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
  {
    id: 'svc-3',
    num: '03',
    active: true,
    order: 2,
    label: { es: 'COMERCIO_ELECTRÓNICO', ca: 'COMERÇ_ELECTRÒNIC' },
    title: { es: 'Comercio Electrónico', ca: 'Comerç Electrònic' },
    description: {
      es: 'Tiendas online de alto rendimiento. Integración con pasarelas de pago, gestión de inventario, panel de administración y optimización para conversión máxima.',
      ca: "Botigues online d'alt rendiment. Integració amb passarel·les de pagament, gestió d'inventari, panell d'administració i optimització per a conversió màxima.",
    },
    tags: [
      { text: 'SHOPIFY', borderColor: '#2a2a2a' },
      { text: 'STRIPE', borderColor: '#2a2a2a' },
      { text: 'NEXT.JS', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
  {
    id: 'svc-4',
    num: '04',
    active: true,
    order: 3,
    label: { es: 'SOLUCIONES_MEDIDA', ca: 'SOLUCIONS_MIDA' },
    title: { es: 'Soluciones a Medida', ca: 'Solucions a Mida' },
    description: {
      es: 'Desde integraciones de terceros hasta sistemas complejos. Si tienes un problema técnico específico, lo resolvemos con el stack más adecuado para tu caso.',
      ca: "Des d'integracions de tercers fins a sistemes complexos. Si tens un problema tècnic específic, el resolem amb l'stack més adequat per al teu cas.",
    },
    tags: [
      { text: 'NODE.JS', borderColor: '#2a2a2a' },
      { text: 'POSTGRES', borderColor: '#2a2a2a' },
      { text: 'REST', borderColor: '#2a2a2a' },
      { text: 'DEPLOY', borderColor: '#2a2a2a' },
    ],
    colors: {
      numColor: '#FFFFFF12',
      labelColor: '#00FFB2',
      titleColor: '#F5F5F5',
      descriptionColor: '#888888',
      hoverBorderColor: '#FF4D00',
    },
  },
];

const DEFAULT_SETTINGS: SiteSettings = {
  parameters: {
    heroSlideDuration: 6,
  },
  visual: {
    primaryColor: '#FF4D00',
    secondaryColor: '#00FFB2',
    customCSS: '',
  },
  heroSlides: DEFAULT_HERO_SLIDES,
  services: DEFAULT_SERVICES,
  typography: DEFAULT_TYPOGRAPHY,
};

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadSettings(): SiteSettings {
  ensureDataDir();
  if (!existsSync(SETTINGS_FILE)) {
    writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
    return structuredClone(DEFAULT_SETTINGS);
  }
  const raw = JSON.parse(readFileSync(SETTINGS_FILE, 'utf-8'));

  // Migrate heroSlides: use defaults if not present
  const heroSlides: HeroSlide[] = Array.isArray(raw.heroSlides) && raw.heroSlides.length > 0
    ? raw.heroSlides
    : DEFAULT_HERO_SLIDES;

  // Migrate services: add active/order if missing
  const services: ServiceItem[] = Array.isArray(raw.services) && raw.services.length > 0
    ? raw.services.map((s: any, idx: number) => ({
        ...s,
        active: s.active !== undefined ? s.active : true,
        order: s.order !== undefined ? s.order : idx,
        // Migrate old string[] tags to ServiceTag[] format
        tags: Array.isArray(s.tags)
          ? s.tags.map((t: any) => typeof t === 'string' ? { text: t, borderColor: '#2a2a2a' } : t)
          : [],
      }))
    : DEFAULT_SERVICES;

  return {
    parameters: { ...DEFAULT_SETTINGS.parameters, ...raw.parameters },
    visual: { ...DEFAULT_SETTINGS.visual, ...raw.visual },
    heroSlides,
    services,
    typography: { ...DEFAULT_SETTINGS.typography, ...raw.typography },
  };
}

export function saveSettings(settings: SiteSettings) {
  ensureDataDir();
  writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
}

export function lightenColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, ((num >> 16) & 0xFF) + amount);
  const g = Math.min(255, ((num >> 8) & 0xFF) + amount);
  const b = Math.min(255, (num & 0xFF) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
}

export function generateId(): string {
  return 'svc-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function generateSlideId(): string {
  return 'slide-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

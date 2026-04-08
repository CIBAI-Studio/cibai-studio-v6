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

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'svc-1',
    num: '01',
    label: { es: 'DISEÑO_WEB', ca: 'DISSENY_WEB' },
    title: { es: 'Diseño Web Premium', ca: 'Disseny Web Premium' },
    description: {
      es: 'Interfaces visuales que convierten. Diseño UI/UX con identidad de marca, tipografía de alto contraste y animaciones con propósito. Nada genérico, todo a medida.',
      ca: 'Interfícies visuals que converteixen. Disseny UI/UX amb identitat de marca, tipografia d\'alt contrast i animacions amb propòsit. Res genèric, tot a mida.',
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
    label: { es: 'WEBAPPS_MEDIDA', ca: 'WEBAPPS_MIDA' },
    title: { es: 'Webapps a Medida', ca: 'Webapps a Mida' },
    description: {
      es: 'Aplicaciones web completas desde cero. React, Next.js, APIs, autenticación y dashboards. Soluciones que escalan con tu negocio y se adaptan a tus procesos.',
      ca: 'Aplicacions web completes des de zero. React, Next.js, APIs, autenticació i dashboards. Solucions que escalen amb el teu negoci i s\'adapten als teus processos.',
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
    label: { es: 'COMERCIO_ELECTRÓNICO', ca: 'COMERÇ_ELECTRÒNIC' },
    title: { es: 'Comercio Electrónico', ca: 'Comerç Electrònic' },
    description: {
      es: 'Tiendas online de alto rendimiento. Integración con pasarelas de pago, gestión de inventario, panel de administración y optimización para conversión máxima.',
      ca: 'Botigues online d\'alt rendiment. Integració amb passarel·les de pagament, gestió d\'inventari, panell d\'administració i optimització per a conversió màxima.',
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
    label: { es: 'SOLUCIONES_MEDIDA', ca: 'SOLUCIONS_MIDA' },
    title: { es: 'Soluciones a Medida', ca: 'Solucions a Mida' },
    description: {
      es: 'Desde integraciones de terceros hasta sistemas complejos. Si tienes un problema técnico específico, lo resolvemos con el stack más adecuado para tu caso.',
      ca: 'Des d\'integracions de tercers fins a sistemes complexos. Si tens un problema tècnic específic, el resolem amb l\'stack més adequat per al teu cas.',
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
  return {
    parameters: { ...DEFAULT_SETTINGS.parameters, ...raw.parameters },
    visual: { ...DEFAULT_SETTINGS.visual, ...raw.visual },
    services: Array.isArray(raw.services) && raw.services.length > 0
      ? raw.services.map((s: any) => ({
          ...s,
          // Migrate old string[] tags to ServiceTag[] format
          tags: Array.isArray(s.tags)
            ? s.tags.map((t: any) => typeof t === 'string' ? { text: t, borderColor: '#2a2a2a' } : t)
            : [],
        }))
      : DEFAULT_SERVICES,
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

// Generates the SVG assets (tech stack) for the inoueUJ profile README.
// Usage: npm i simple-icons@13 && node scripts/gen-assets.js .
const fs = require('fs');
const path = require('path');
const si = require('simple-icons');

const OUT = process.argv[2];
fs.mkdirSync(path.join(OUT, 'assets'), { recursive: true });

const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Hiragino Sans', 'Noto Sans JP', 'Yu Gothic UI', sans-serif`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const THEMES = {
  dark: { bg: '#0d1117', card: '#161b22', border: '#30363d', text: '#e6edf3', sub: '#9198a1', chip: '#21262d', chipText: '#c9d1d9' },
  light: { bg: '#ffffff', card: '#f6f8fa', border: '#d1d9e0', text: '#1f2328', sub: '#59636e', chip: '#ffffff', chipText: '#1f2328' },
};

// ---------- tech stack (icons style: bare logos grouped by area) ----------
const GROUPS = [
  ['Frontend', [['TypeScript','siTypescript'],['JavaScript','siJavascript'],['React','siReact'],['Next.js','siNextdotjs'],['Vue','siVuedotjs'],['Tailwind','siTailwindcss'],['MUI','siMui'],['shadcn/ui','siShadcnui'],['TanStack Q','siReactquery'],['Vite','siVite'],['HTML5','siHtml5']]],
  ['Mobile', [['Flutter','siFlutter'],['Dart','siDart'],['Firebase','siFirebase'],['PWA','siPwa']]],
  ['Backend', [['Python','siPython'],['FastAPI','siFastapi'],['Pandas','siPandas'],['Rails','siRubyonrails'],['Java','siOpenjdk'],['Spring Boot','siSpringboot'],['Supabase','siSupabase'],['PostgreSQL','siPostgresql'],['MySQL','siMysql']]],
  ['Infra / Test', [['Cloudflare','siCloudflare'],['Google Cloud','siGooglecloud'],['Docker','siDocker'],['Actions','siGithubactions'],['Git','siGit'],['Vitest','siVitest'],['MSW','siMockserviceworker']]],
  ['AI', [['Claude','siClaude'],['Gemini','siGooglegemini'],['Copilot','siGithubcopilot'],['Hugging Face','siHuggingface']]],
];
function iconColor(hex, mode) {
  const n = parseInt(hex, 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  if (mode === 'dark' && lum < 70) return '#e6edf3';
  if (mode === 'light' && lum > 225) return '#1f2328';
  return '#' + hex;
}
function stack(t, mode) {
  const labelW = 132, step = 68, rowH = 92, W = 880, H = GROUPS.length * rowH;
  const rows = GROUPS.map(([label, items], gi) => {
    const y = gi * rowH;
    const icons = items.map(([name, key], i) => {
      const ic = si[key];
      const cx = labelW + i * step + step / 2;
      return `<g><title>${esc(name)}</title>
      <g transform="translate(${cx - 18},${y + 16}) scale(1.5)"><path d="${ic.path}" fill="${iconColor(ic.hex, mode)}"/></g>
      <text x="${cx}" y="${y + 76}" text-anchor="middle" font-family="${FONT}" font-size="11" fill="${t.sub}">${esc(name)}</text></g>`;
    }).join('');
    const line = gi < GROUPS.length - 1 ? `<line x1="0" x2="${W}" y1="${y + rowH - 0.5}" y2="${y + rowH - 0.5}" stroke="${t.border}" stroke-opacity="0.6"/>` : '';
    return `<text x="0" y="${y + 40}" font-family="${FONT}" font-size="14" font-weight="700" fill="${t.text}">${esc(label)}</text>${icons}${line}`;
  }).join('\n');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n${rows}\n</svg>`;
}

for (const mode of ['dark', 'light']) {
  const t = THEMES[mode];
  fs.writeFileSync(path.join(OUT, 'assets', `stack-${mode}.svg`), stack(t, mode));
}
console.log('ok');

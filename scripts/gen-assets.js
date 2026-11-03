// Generates the SVG assets (header + tech stack) for the inoueUJ profile README.
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

// ---------- header ----------
function header(t, mode) {
  const W = 880, H = 220;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${mode === 'dark' ? '#1e1b4b' : '#eef2ff'}"/>
      <stop offset="0.55" stop-color="${mode === 'dark' ? '#0f172a' : '#f8fafc'}"/>
      <stop offset="1" stop-color="${mode === 'dark' ? '#082f49' : '#ecfeff'}"/>
    </linearGradient>
    <radialGradient id="b1" cx="0.85" cy="0.15" r="0.5"><stop offset="0" stop-color="#8b5cf6" stop-opacity="${mode === 'dark' ? 0.55 : 0.28}"/><stop offset="1" stop-color="#8b5cf6" stop-opacity="0"/></radialGradient>
    <radialGradient id="b2" cx="0.7" cy="1" r="0.5"><stop offset="0" stop-color="#06b6d4" stop-opacity="${mode === 'dark' ? 0.45 : 0.25}"/><stop offset="1" stop-color="#06b6d4" stop-opacity="0"/></radialGradient>
    <linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset="1" stop-color="#22d3ee"/></linearGradient>
    <clipPath id="c"><rect width="${W}" height="${H}" rx="24"/></clipPath>
  </defs>
  <g clip-path="url(#c)">
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <rect width="${W}" height="${H}" fill="url(#b1)"/>
    <rect width="${W}" height="${H}" fill="url(#b2)"/>
  </g>
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="24" fill="none" stroke="${t.border}" stroke-opacity="0.6"/>
  <text x="48" y="72" font-family="${FONT}" font-size="16" fill="${t.sub}" letter-spacing="2">FUKUOKA, JAPAN · SOFTWARE ENGINEER</text>
  <text x="48" y="124" font-family="${FONT}" font-size="44" font-weight="700" fill="${t.text}">Yuji Inoue <tspan fill="url(#tg)">/ いのうぇい</tspan></text>
  <text x="48" y="166" font-family="${FONT}" font-size="19" fill="${t.sub}">作って、旅先で使って、失敗から次を作るエンジニア。AI を道具に組み込むのが好き。</text>
</svg>`;
}

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
  fs.writeFileSync(path.join(OUT, 'assets', `header-${mode}.svg`), header(t, mode));
  fs.writeFileSync(path.join(OUT, 'assets', `stack-${mode}.svg`), stack(t, mode));
}
console.log('ok');

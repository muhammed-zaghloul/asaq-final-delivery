// scripts/patch-apps.mjs
// =====================================================================
// Prepares the apps in /apps/ for this website. Safe to run again and again.
//
//   node scripts/patch-apps.mjs
//
// For every .html file under apps/:
//   1. adds <script src="../../assets/js/shield.js"></script> as the first script in <head>
//      (a relative path worked out from each file's depth, so the site also works as local files;
//      an older root-absolute "/assets/js/shield.js" tag is converted, never added twice)
//   2. makes sure robots (noindex, nofollow) and author (Muhammed Zaghloul) meta tags exist
// For every .html and .js file under apps/:
//   3. turns links to known PDF files into links to the site's protected viewer
//      (../../viewer/index.html?f=<key>, target="_top"; inside the website, shield.js opens the viewer
//      as a dialog on the task page instead)
//   5. removes comments that contain a word from the confidentiality list
// Then:
//   4. deletes every .pdf file under apps/ (the PDFs are served from Google Drive)
//   6. prints a summary
// No dependencies. Needs Node 18 or newer.
// =====================================================================
import { readdir, readFile, writeFile, unlink, stat } from 'node:fs/promises';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const APPS = join(ROOT, 'apps');

// PDF file name -> key in content/files.js. Add a line here if an app links to a new PDF.
const PDF_MAP = {
  'Task4_Facilitator_Guide_AR.pdf': 't4_guide',
  'Task4_Printable_Kit_Sample.pdf': 't4_kit',
  'Task5_LMS_Documentation.pdf': 't5_docs'
};

// Confidentiality list (whole words, case-insensitive). Comments containing them are removed.
// The words are stored ROT13-encoded so this file itself does not contain them.
const rot13 = s => s.replace(/[a-z]/gi, c => String.fromCharCode((c <= 'Z' ? 65 : 97) + ((c.toLowerCase().charCodeAt(0) - 97 + 13) % 26)));
const FORBIDDEN = ['pynhqr', 'naguebcvp', 'bcranv', 'pungtcg', 'trzvav', 'pbcvybg', 'zvqwbhearl', 'irb', 'sybj', 'ryriraynof',
  'cebzcg', 'trarengrq ol', 'nv-trarengrq', 'negvsvpvny vagryyvtrapr', 'yyz', 'nagvtenivgl', 'fgbelyvar'].map(rot13);
const FORBIDDEN_RE = new RegExp('\\b(' + FORBIDDEN.map(w => w.replace(/[-\s]/g, m => (m === '-' ? '\\-' : '\\s+'))).join('|') + ')\\b', 'i');

// Relative way from a file under apps/ back to the site root.
//   HTML: from the file's own folder (apps/<name>/index.html -> "../../").
//   JS:   links in scripts resolve against the app page that runs them, i.e. apps/<name>/ -> "../../".
const toRoot = (file, isHtml) => {
  const base = isHtml ? dirname(file) : join(APPS, relative(APPS, file).split(/[\\/]/)[0]);
  const r = relative(base, ROOT).replace(/\\/g, '/');
  return r ? r + '/' : '';
};
const shieldTag = file => `<script src="${toRoot(file, true)}assets/js/shield.js"></script>`;
const OLD_SHIELD_TAG = '<script src="/assets/js/shield.js"></script>';
const summary = { htmlPatched: [], linksRewritten: [], unknownPdfLinks: [], pdfsRemoved: [], commentsRemoved: [] };

async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const p = join(dir, name);
    if ((await stat(p)).isDirectory()) out.push(...await walk(p)); else out.push(p);
  }
  return out;
}
const rel = p => relative(ROOT, p).replace(/\\/g, '/');

// 3. href="...Name.pdf" (optionally with target="_blank") -> protected viewer link
function rewritePdfLinks(text, file) {
  return text.replace(/href=(["'])([^"'<>]*?([A-Za-z0-9_\-]+\.pdf))\1(\s+target=(["'])_blank\5)?(\s+rel=(["'])[^"']*\7)?/gi, (all, q, path, name) => {
    const key = PDF_MAP[name];
    if (!key) { summary.unknownPdfLinks.push(`${rel(file)}: ${path}`); return all; }
    const viewer = `${toRoot(file, file.toLowerCase().endsWith('.html'))}viewer/index.html?f=${key}`;
    summary.linksRewritten.push(`${rel(file)}: ${path} -> ${viewer}`);
    return `href=${q}${viewer}${q} target=${q}_top${q} data-mz-file=${q}${key}${q}`;
  });
}

// 3b. Links written by an older version of this script (root-absolute /viewer/?f=<key>) -> relative.
function relativiseViewerLinks(text, file) {
  return text.replace(/href=(["'])\/viewer\/\?f=([a-z0-9_]+)\1/gi, (all, q, key) => {
    const viewer = `${toRoot(file, file.toLowerCase().endsWith('.html'))}viewer/index.html?f=${key}`;
    summary.linksRewritten.push(`${rel(file)}: /viewer/?f=${key} -> ${viewer}`);
    return `href=${q}${viewer}${q}`;
  });
}

// 5. Remove comments that mention a forbidden word. Only unambiguous comments are touched:
//    HTML comments, and JS/CSS comments that start a line (so URLs and strings are never cut).
function stripComments(text, file, isHtml) {
  const drop = (m) => { if (FORBIDDEN_RE.test(m)) { summary.commentsRemoved.push(`${rel(file)}: ${m.trim().slice(0, 80)}`); return ''; } return m; };
  if (isHtml) text = text.replace(/<!--[\s\S]*?-->/g, drop);
  text = text.replace(/^[ \t]*\/\*(?:(?!\*\/)[\s\S])*\*\/[ \t]*$/gm, drop);
  text = text.replace(/^[ \t]*\/\/[^\n]*$/gm, drop);
  return text;
}

function patchHead(html, file) {
  let changed = false;
  const SHIELD_TAG = shieldTag(file);
  if (html.includes(OLD_SHIELD_TAG)) { html = html.split(OLD_SHIELD_TAG).join(html.includes(SHIELD_TAG) ? '' : SHIELD_TAG); changed = true; }
  if (!html.includes(SHIELD_TAG)) {
    // first script in <head>: right after <meta charset> if present, otherwise right after <head>
    const charset = html.match(/<meta\s+charset=[^>]*>/i);
    if (charset) html = html.replace(charset[0], charset[0] + '\n' + SHIELD_TAG);
    else html = html.replace(/<head[^>]*>/i, m => m + '\n' + SHIELD_TAG);
    changed = true;
  }
  const robots = html.match(/<meta\s+name=["']robots["'][^>]*>/i);
  if (!robots) { html = html.replace(SHIELD_TAG, SHIELD_TAG + '\n<meta name="robots" content="noindex, nofollow">'); changed = true; }
  else if (!/nofollow/i.test(robots[0])) { html = html.replace(robots[0], '<meta name="robots" content="noindex, nofollow">'); changed = true; }
  if (!/<meta\s+name=["']author["']\s+content=["']Muhammed Zaghloul["']/i.test(html)) {
    html = html.replace(/<meta\s+name=["']author["'][^>]*>\s*/i, '');
    html = html.replace(SHIELD_TAG, SHIELD_TAG + '\n<meta name="author" content="Muhammed Zaghloul">');
    changed = true;
  }
  html = html.replace(/<meta\s+name=["']generator["'][^>]*>\s*/gi, () => { changed = true; return ''; });
  if (changed) summary.htmlPatched.push(rel(file));
  return html;
}

const files = await walk(APPS);
for (const f of files) {
  const lower = f.toLowerCase();
  if (lower.endsWith('.pdf')) { await unlink(f); summary.pdfsRemoved.push(rel(f)); continue; }
  const isHtml = lower.endsWith('.html');
  if (!isHtml && !lower.endsWith('.js') && !lower.endsWith('.css')) continue;
  const before = await readFile(f, 'utf8');
  let text = before;
  if (isHtml) text = patchHead(text, f);
  if (isHtml || lower.endsWith('.js')) text = relativiseViewerLinks(rewritePdfLinks(text, f), f);
  text = stripComments(text, f, isHtml);
  if (text !== before) await writeFile(f, text, 'utf8');
}

// Any .pdf mention left in HTML/JS is reported (it would be a link we could not map).
const leftovers = [];
for (const f of await walk(APPS)) {
  if (!/\.(html|js)$/i.test(f)) continue;
  const t = await readFile(f, 'utf8');
  const m = t.match(/[^\s"'`]*\.pdf\b/gi);
  if (m) leftovers.push(`${rel(f)}: ${[...new Set(m)].join(', ')}`);
}

const list = (title, arr) => console.log(`\n${title}: ${arr.length}` + (arr.length ? '\n  - ' + arr.join('\n  - ') : ''));
console.log('patch-apps: done');
list('HTML files patched (shield / meta)', summary.htmlPatched);
list('PDF links rewritten', summary.linksRewritten);
list('PDF links with no files.js key (not changed)', summary.unknownPdfLinks);
list('PDF files removed', summary.pdfsRemoved);
list('Comments removed (confidentiality list)', summary.commentsRemoved);
list('Remaining .pdf mentions in HTML/JS', leftovers);

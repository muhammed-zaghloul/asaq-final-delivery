/* =====================================================================
   drive.js · Protected Google Drive viewer
   Muhammed Zaghloul · ASAQ final delivery website

   Usage (render.js does this for you):
     MZDrive.driveId('https://drive.google.com/file/d/<ID>/view')  -> '<ID>'
     MZDrive.mount(element, 'files-key', { poster: 'url of the poster image, relative to the page' })

   File links and versions live in content/files.js only.
   There are no "Open in Drive" or "Download" links anywhere on purpose.
   ===================================================================== */
(function () {
  'use strict';

  var LOAD_TIMEOUT_MS = 12000;
  // Layer 1: sandbox without allow-popups / allow-top-navigation,
  // so Drive's pop-out button cannot open a tab or move this page.
  var SANDBOX = { pdf: 'allow-scripts allow-same-origin allow-presentation', video: 'allow-scripts allow-same-origin allow-presentation' };
  var WATERMARK_TEXT = 'Muhammed Zaghloul · Assessment submission · Not for commercial use';

  /* Accepts a raw ID or any common Drive link form and returns the ID ('' if none). */
  function driveId(value) {
    var v = String(value == null ? '' : value).trim();
    if (!v) return '';
    if (/\/folders\//.test(v)) {
      if (window.console) console.warn('files.js: a Drive FOLDER link was pasted. Please paste the link of the FILE itself (right-click the file > Share > Copy link).');
      return '';
    }
    var m = v.match(/\/file\/d\/([A-Za-z0-9_-]{10,})/) || v.match(/[?&]id=([A-Za-z0-9_-]{10,})/) || v.match(/\/d\/([A-Za-z0-9_-]{10,})/);
    if (m) return m[1];
    if (/^[A-Za-z0-9_-]{10,}$/.test(v)) return v;
    if (window.console) console.warn('files.js: could not read a Drive file ID from "' + v + '".');
    return '';
  }

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var ICON = {
    soon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4M12 17h.01"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>'
  };

  var markUrl = null;
  function watermark() {
    if (markUrl) return markUrl;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="520" height="260"><text x="260" y="130" text-anchor="middle" dominant-baseline="middle" transform="rotate(-24 260 130)" font-family="Poppins, Arial, sans-serif" font-size="17" font-weight="600" fill="#ffffff">' + esc(WATERMARK_TEXT) + '</text></svg>';
    markUrl = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
    return markUrl;
  }

  function file(key) { return (window.FILES || {})[key] || null; }

  /* Placeholder shown when a file has no Drive ID yet. */
  function empty(target, f) {
    var box = el('div', 'dv-empty', ICON.soon + '<p>File link coming soon</p>' + (f && f.title ? '<span class="muted small">' + esc(f.title) + '</span>' : ''));
    target.appendChild(box);
    return box;
  }

  /* Builds the protected iframe inside a .dv box. */
  function loadFrame(box, id, f, autoplay) {
    var type = f.type === 'video' ? 'video' : 'pdf';
    var ifr = document.createElement('iframe');
    ifr.title = f.title || 'Document viewer';
    ifr.setAttribute('loading', 'lazy');
    ifr.setAttribute('allow', 'autoplay; fullscreen');
    ifr.setAttribute('allowfullscreen', '');
    ifr.setAttribute('referrerpolicy', 'no-referrer');
    if (SANDBOX[type]) {
      // Some browsers (Safari) do not know every flag; keep only the ones they support.
      var flags = SANDBOX[type].split(' ');
      try { if (ifr.sandbox && ifr.sandbox.supports) flags = flags.filter(function (f) { return ifr.sandbox.supports(f); }); } catch (e) { /* keep all */ }
      ifr.setAttribute('sandbox', flags.join(' '));
    }
    var state = el('div', 'dv-state', '<div><div class="spin" aria-hidden="true"></div><p>Loading ' + (type === 'video' ? 'video' : 'document') + '…</p></div>');
    state.setAttribute('role', 'status');
    var done = false;
    var timer = setTimeout(function () {
      if (done) return;
      state.innerHTML = '<div>' + ICON.warn + '<p>This file could not be loaded. Please refresh the page.</p></div>';
    }, LOAD_TIMEOUT_MS);
    ifr.addEventListener('load', function () { done = true; clearTimeout(timer); state.remove(); box.setAttribute('data-loaded', ''); });
    ifr.src = 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/preview' + (autoplay ? '?autoplay=1' : '');
    box.insertBefore(ifr, box.firstChild);
    box.appendChild(state);
    return ifr;
  }

  /* Mounts a viewer for files[key] into target. Returns the .dv element (or the empty box). */
  function mount(target, key, opts) {
    opts = opts || {};
    var f = file(key);
    if (!f) { if (window.console) console.warn('files.js has no entry "' + key + '"'); return empty(target, null); }
    var id = driveId(f.drive);
    if (!id) return empty(target, f);
    var type = f.type === 'video' ? 'video' : 'pdf';
    var box = el('div', 'dv ' + type);
    box.setAttribute('data-file', key);
    // Layer 2: transparent shield over the pop-out corner + watermark
    var shield = el('div', 'dv-shield');
    shield.setAttribute('aria-hidden', 'true');
    shield.title = 'Opening outside this page is disabled';
    ['click', 'mousedown', 'mouseup', 'pointerdown', 'pointerup', 'auxclick', 'dblclick', 'contextmenu', 'touchstart'].forEach(function (ev) {
      shield.addEventListener(ev, function (e) { e.preventDefault(); e.stopPropagation(); }, { passive: false });
    });
    var mark = el('div', 'dv-mark');
    mark.style.backgroundImage = watermark();
    mark.setAttribute('aria-hidden', 'true');
    box.appendChild(mark);
    box.appendChild(shield);
    target.appendChild(box);

    if (type === 'video' && opts.poster && !opts.eager) {
      var btn = el('button', 'dv-poster', '<span class="play">' + ICON.play + '</span><span class="cap">' + esc(f.title) + '</span>');
      btn.type = 'button';
      btn.style.backgroundImage = 'url("' + opts.poster + '")';
      btn.setAttribute('aria-label', 'Play: ' + f.title);
      btn.addEventListener('click', function () { btn.remove(); loadFrame(box, id, f, true); });
      box.appendChild(btn);
    } else if (opts.eager) {
      loadFrame(box, id, f, false);
    } else {
      // Create the frame only when the viewer scrolls near the screen.
      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) { io.disconnect(); loadFrame(box, id, f, false); } });
        }, { rootMargin: '300px 0px' });
        io.observe(box);
      } else loadFrame(box, id, f, false);
    }
    return box;
  }

  window.MZDrive = { driveId: driveId, mount: mount, file: file, hasFile: function (k) { var f = file(k); return !!(f && driveId(f.drive)); } };
})();

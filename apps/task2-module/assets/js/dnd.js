(function () {
  'use strict';
  /*
   DnD.attach({
     root,                 // element that contains the draggable items
     items(),              // returns array of draggable elements (data-id)
     zones(),              // returns array of drop-zone elements
     onDrop(itemEl, zoneEl),
     scale(),              // current stage scale factor
     zoneLabel(zoneEl),    // spoken label for keyboard users
     announce(text),
     pickedText            // spoken when a card is picked up
   }) -> { destroy(), clear() }
   Pointer drag, tap-to-select then tap-zone, and keyboard (Enter/Space pick, arrows choose, Enter drop, Esc cancel).
  */
  function attach(o) {
    var drag = null, picked = null, kIndex = -1, kbd = false;
    var zones = function () { return (o.zones() || []).filter(function (z) { return !z.hasAttribute('data-locked'); }); };

    function clearHi() { zones().forEach(function (z) { z.classList.remove('over', 'kbd'); }); }
    function unpick() {
      if (picked) { picked.classList.remove('picked'); picked.setAttribute('aria-pressed', 'false'); }
      picked = null; kbd = false; kIndex = -1; clearHi();
    }
    function pick(el, viaKbd) {
      unpick();
      picked = el; kbd = !!viaKbd;
      el.classList.add('picked'); el.setAttribute('aria-pressed', 'true');
      if (kbd) {
        kIndex = 0; highlight();
        if (o.announce) o.announce((o.pickedText || '') + ' ' + label(zones()[0]));
      }
    }
    function label(z) { return z && o.zoneLabel ? o.zoneLabel(z) : ''; }
    function highlight() {
      clearHi();
      var zs = zones(); if (!zs.length) return;
      kIndex = (kIndex + zs.length) % zs.length;
      zs[kIndex].classList.add('kbd');
    }
    function drop(el, z) {
      var next = nextFocus(el);
      unpick();
      o.onDrop(el, z);
      if (!document.body.contains(el) || el.classList.contains('placed') || el.hasAttribute('disabled')) {
        var f = next && document.body.contains(next) && !next.classList.contains('placed') ? next : (o.items()[0] || null);
        if (f) f.focus({ preventScroll: true });
      } else if (kbdWas) { el.focus({ preventScroll: true }); }
    }
    var kbdWas = false;
    function nextFocus(el) {
      var list = o.items(); var i = list.indexOf(el);
      return list[i + 1] || list[i - 1] || null;
    }
    function itemFrom(t) {
      var list = o.items();
      while (t && t !== o.root) { if (list.indexOf(t) >= 0) return t; t = t.parentNode; }
      return null;
    }
    function zoneAt(x, y) {
      var zs = zones();
      for (var i = 0; i < zs.length; i++) {
        var r = zs[i].getBoundingClientRect();
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zs[i];
      }
      return null;
    }

    /* ----- pointer ----- */
    function onDown(e) {
      if (e.button !== 0) return;
      var el = itemFrom(e.target); if (!el || el.hasAttribute('disabled')) return;
      var mobileTouch = e.pointerType === 'touch' && window.innerWidth < 700;
      drag = { el: el, x: e.clientX, y: e.clientY, started: false, noDrag: mobileTouch, id: e.pointerId };
      if (!mobileTouch) { try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } }
    }
    function onMove(e) {
      if (!drag || drag.noDrag || e.pointerId !== drag.id) return;
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (!drag.started) {
        if (Math.abs(dx) + Math.abs(dy) < 6) return;
        drag.started = true; unpick();
        var r = drag.el.getBoundingClientRect(), s = o.scale ? o.scale() : 1;
        var g = drag.el.cloneNode(true);
        g.classList.add('ghost'); g.classList.remove('picked');
        g.removeAttribute('id'); g.setAttribute('aria-hidden', 'true');
        g.style.width = drag.el.offsetWidth + 'px';
        g.style.transformOrigin = '0 0';
        g.style.transform = 'scale(' + s + ') rotate(-2deg)';
        document.body.appendChild(g);
        drag.g = g; drag.ox = drag.x - r.left; drag.oy = drag.y - r.top;
        drag.el.classList.add('dragging');
      }
      drag.g.style.left = (e.clientX - drag.ox) + 'px';
      drag.g.style.top = (e.clientY - drag.oy) + 'px';
      var z = zoneAt(e.clientX, e.clientY);
      zones().forEach(function (zz) { zz.classList.toggle('over', zz === z); });
      e.preventDefault();
    }
    function onUp(e) {
      if (!drag || e.pointerId !== drag.id) return;
      var d = drag; drag = null;
      if (d.started) {
        d.el.classList.remove('dragging');
        if (d.g && d.g.parentNode) d.g.parentNode.removeChild(d.g);
        var z = zoneAt(e.clientX, e.clientY);
        clearHi();
        kbdWas = false;
        if (z) drop(d.el, z);
      } else {
        // tap / click = select
        if (picked === d.el) unpick(); else pick(d.el, false);
      }
    }
    function onCancel() {
      if (!drag) return;
      if (drag.g && drag.g.parentNode) drag.g.parentNode.removeChild(drag.g);
      drag.el.classList.remove('dragging'); drag = null; clearHi();
    }
    function onZoneClick(e) {
      if (!picked) return;
      var zs = zones(), t = e.target;
      while (t && t !== document.body) { if (zs.indexOf(t) >= 0) break; t = t.parentNode; }
      if (t && zs.indexOf(t) >= 0) { kbdWas = false; drop(picked, t); }
    }

    /* ----- keyboard ----- */
    function onKey(e) {
      var el = itemFrom(e.target);
      if (picked && kbd) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { kIndex++; highlight(); say(); e.preventDefault(); return; }
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { kIndex--; highlight(); say(); e.preventDefault(); return; }
        if (e.key === 'Enter' || e.key === ' ') { var z = zones()[kIndex]; var p = picked; kbdWas = true; if (z) drop(p, z); e.preventDefault(); return; }
        if (e.key === 'Escape') { unpick(); e.preventDefault(); return; }
        if (e.key === 'Tab') { unpick(); return; }
      }
      if (el && (e.key === 'Enter' || e.key === ' ')) { pick(el, true); e.preventDefault(); }
    }
    function say() { if (o.announce) o.announce(label(zones()[kIndex])); }

    o.root.addEventListener('pointerdown', onDown);
    o.root.addEventListener('pointermove', onMove);
    o.root.addEventListener('pointerup', onUp);
    o.root.addEventListener('pointercancel', onCancel);
    o.root.addEventListener('keydown', onKey);
    document.addEventListener('click', onZoneClick, true);

    return {
      clear: unpick,
      destroy: function () {
        onCancel(); unpick();
        o.root.removeEventListener('pointerdown', onDown);
        o.root.removeEventListener('pointermove', onMove);
        o.root.removeEventListener('pointerup', onUp);
        o.root.removeEventListener('pointercancel', onCancel);
        o.root.removeEventListener('keydown', onKey);
        document.removeEventListener('click', onZoneClick, true);
      }
    };
  }
  window.DnD = { attach: attach };
})();

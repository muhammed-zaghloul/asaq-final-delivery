(function () {
  var S = 'stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" fill="none"';
  var I = {
    bottle: '<circle cx="12" cy="4" r="2.6"/><rect x="10.2" y="6" width="3.6" height="2.6" rx=".7"/><path d="M12 8.3c-5.1 0-8.2 2.7-8.2 6.7 0 4 3.4 6.7 8.2 6.7s8.2-2.7 8.2-6.7c0-4-3.1-6.7-8.2-6.7z"/><path d="M4.6 13.6h14.8M4.4 16.4h15.2" stroke="#fff" stroke-opacity=".45" stroke-width="1.1"/>',
    drop: '<path d="M12 2.5S5.5 10 5.5 14.6a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5z"/>',
    oil: '<path d="M12 2.5S5.5 10 5.5 14.6a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5z"/><path d="M9 14.8a3 3 0 0 0 3 3" ' + S + ' stroke="#fff" stroke-opacity=".6" stroke-width="1.6"/>',
    spray: '<rect x="3.5" y="9.5" width="11" height="12" rx="2.4"/><rect x="6.3" y="5" width="5.4" height="3.8" rx="1"/><circle cx="9" cy="15.3" r="2.5" fill="#fff" fill-opacity=".55"/><circle cx="15.5" cy="4.5" r="1.1"/><circle cx="18.5" cy="4.5" r="1.1"/><circle cx="21.2" cy="4.5" r="1.1"/><circle cx="17" cy="7.3" r="1.1"/><circle cx="20" cy="7.3" r="1.1"/>',
    leaf: '<path d="M20.8 3.2C11.2 3.4 4.6 7.8 4.6 15c0 1.6.4 3 1 4.1L3.4 21.3l1.3 1.3 2.2-2.2c1.2.8 2.7 1.2 4.4 1.2 7.4 0 9.6-8.6 9.5-18.4z"/><path d="M6.9 20.4C9.5 15.6 13 11.6 17.5 8.4" ' + S + ' stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>',
    flask: '<path d="M8.8 2.5h6.4v1.9h-1.1v5.2l5.7 9.4c.9 1.5-.2 3.4-1.9 3.4H6.1c-1.7 0-2.8-1.9-1.9-3.4l5.7-9.4V4.4H8.8z"/><path d="M7.4 15.5h9.2" ' + S + ' stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>',
    shield: '<path d="M12 2.4l8.2 3.1v6.3c0 5.1-3.5 8.8-8.2 10.6-4.7-1.8-8.2-5.5-8.2-10.6V5.5z"/><path d="M12 5v14.8c3.2-1.5 5.6-4.3 5.6-8V7.1z" fill="#fff" fill-opacity=".4"/>',
    steam: '<g ' + S + ' stroke-width="1.9"><path d="M8 2.8c-1.4 1.4 1.4 2.8 0 4.3s1.4 2.8 0 4.2"/><path d="M12 2.8c-1.4 1.4 1.4 2.8 0 4.3s1.4 2.8 0 4.2"/><path d="M16 2.8c-1.4 1.4 1.4 2.8 0 4.3s1.4 2.8 0 4.2"/></g><path d="M3.5 13.5h17v3.2a4.8 4.8 0 0 1-4.8 4.8H8.3a4.8 4.8 0 0 1-4.8-4.8z"/>',
    hourglass: '<path d="M6 2.5h12v2h-1.4c0 3.3-1.9 5.6-3.7 7.5 1.8 1.9 3.7 4.2 3.7 7.5H18v2H6v-2h1.4c0-3.3 1.9-5.6 3.7-7.5C9.3 10.1 7.4 7.8 7.4 4.5H6z"/><path d="M9.5 18.6c.6-1.6 1.6-2.6 2.5-3.4.9.8 1.9 1.8 2.5 3.4z" fill="#fff" fill-opacity=".5"/>',
    filter: '<path d="M3 3.8h18l-7 8.6v6.4l-4 2.6v-9z"/>',
    clock: '<circle cx="12" cy="12" r="9.3" ' + S + ' stroke-width="2"/><path d="M12 6.6V12l3.7 2.3" ' + S + ' stroke-width="2"/>',
    check: '<path d="M4.8 12.6l4.6 4.6L19.4 7.2" ' + S + ' stroke-width="2.6"/>',
    x: '<path d="M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7" ' + S + ' stroke-width="2.6"/>',
    star: '<path d="M12 2.6l2.9 5.9 6.4.9-4.6 4.5 1.1 6.4L12 17.3l-5.8 3 1.1-6.4-4.6-4.5 6.4-.9z"/>',
    trophy: '<path d="M7 3h10v1.8h3.2V8a4 4 0 0 1-4 4h-.6a5 5 0 0 1-2.6 2.6V17h3v3.5H8V17h3v-2.4A5 5 0 0 1 8.4 12h-.6a4 4 0 0 1-4-4V4.8H7zm-1.3 3.6V8c0 .9.5 1.6 1.3 1.9V6.6zm12.6 0h-1.3v3.3c.8-.3 1.3-1 1.3-1.9z"/>',
    chat: '<path d="M12 3C6.7 3 2.6 6.5 2.6 10.8c0 2.4 1.2 4.5 3.2 5.9L4.9 21l4.5-2.6c.8.2 1.7.3 2.6.3 5.3 0 9.4-3.5 9.4-7.9S17.3 3 12 3z"/><circle cx="8" cy="10.9" r="1.35" fill="#2B2E4A"/><circle cx="12" cy="10.9" r="1.35" fill="#2B2E4A"/><circle cx="16" cy="10.9" r="1.35" fill="#2B2E4A"/>',
    bulb: '<path d="M12 2.4a6.6 6.6 0 0 0-4 11.8c.6.5 1 1.2 1 2v.4h6v-.4c0-.8.4-1.5 1-2a6.6 6.6 0 0 0-4-11.8z"/><rect x="9" y="17.6" width="6" height="1.8" rx=".9"/><rect x="10" y="20.3" width="4" height="1.8" rx=".9"/>',
    play: '<path d="M7.5 4.6v14.8L19.6 12z"/>',
    pause: '<rect x="6" y="4.5" width="4.2" height="15" rx="1.2"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.2"/>',
    replay: '<path d="M12 4.6V1.8L7.4 5.9 12 10V7a5.6 5.6 0 1 1-5.6 5.6H4A8 8 0 1 0 12 4.6z"/>',
    back10: '<path d="M12 4.6V1.8L7.4 5.9 12 10V7a5.6 5.6 0 1 1-5.6 5.6H4A8 8 0 1 0 12 4.6z"/><text x="12.1" y="15.4" font-size="6.4" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="currentColor">10</text>',
    volume: '<path d="M3.5 9h3.8L12 4.8v14.4L7.3 15H3.5z"/><path d="M15.2 8.6a4.6 4.6 0 0 1 0 6.8M17.8 6a8.3 8.3 0 0 1 0 12" ' + S + ' stroke-width="1.9"/>',
    mute: '<path d="M3.5 9h3.8L12 4.8v14.4L7.3 15H3.5z"/><path d="M15.5 9.3l5 5.4M20.5 9.3l-5 5.4" ' + S + ' stroke-width="1.9"/>',
    hand: '<path d="M9.2 11.2V4.6a1.5 1.5 0 0 1 3 0v5.6h.4V8.7a1.5 1.5 0 0 1 3 0v1.6h.4v-.6a1.5 1.5 0 0 1 3 0v5.2c0 3.7-2.6 6.6-6.3 6.6h-.6c-2 0-3.7-.9-4.8-2.5L4.2 15a1.5 1.5 0 0 1 2.5-1.7l2.5 3z"/>',
    send: '<path d="M21 3L3 10.6l6.9 2.6L12.5 21z"/><path d="M9.9 13.2L21 3" ' + S + ' stroke="#fff" stroke-opacity=".5" stroke-width="1.3"/>',
    arrowR: '<path d="M3.5 10.8h12.2l-4.8-4.8 1.8-1.8L20.6 12l-7.9 7.8-1.8-1.8 4.8-4.8H3.5z"/>',
    arrowL: '<path d="M20.5 10.8H8.3l4.8-4.8-1.8-1.8L3.4 12l7.9 7.8 1.8-1.8-4.8-4.8h12.2z"/>',
    sync: '<path d="M12 4a8 8 0 0 0-7.4 5h2.3A6 6 0 0 1 17.3 8.4L15 10.7h6V4.7l-2.3 2.3A8 8 0 0 0 12 4zm-9 9.3v6l2.3-2.3A8 8 0 0 0 19.4 15h-2.3a6 6 0 0 1-10.4.6L9 13.3z"/>',
    store: '<path d="M3 3.8h18l1 4.8a3.1 3.1 0 0 1-5.3 2.3A3.1 3.1 0 0 1 12 11a3.1 3.1 0 0 1-4.7-.1A3.1 3.1 0 0 1 2 8.6z"/><path d="M4 12.6V21h6v-5h4v5h6v-8.4a4.6 4.6 0 0 1-3.7-.6 4.8 4.8 0 0 1-4.3.9 4.8 4.8 0 0 1-4.3-.9 4.6 4.6 0 0 1-3.7.6z"/>',
    pyramid: '<path d="M10 2.8h4l1.5 4.6h-7z"/><path d="M7.9 9.3h8.2l1.7 5.1H6.2z"/><path d="M5.6 16.3h12.8l1.9 5H3.7z"/>',
    wood: '<rect x="2.5" y="7.5" width="19" height="9" rx="4.5"/><circle cx="17" cy="12" r="2.6" fill="#fff" fill-opacity=".5"/><path d="M5.5 10.5h7M6.5 13.5h6" ' + S + ' stroke="#fff" stroke-opacity=".45" stroke-width="1.2"/>',
    seed: '<ellipse cx="12" cy="12" rx="5.2" ry="8.6" transform="rotate(35 12 12)"/><path d="M8.3 17.2c2-3.6 4.5-6.8 7.5-9.8" ' + S + ' stroke="#fff" stroke-opacity=".5" stroke-width="1.4"/>',
    strip: '<path d="M2.8 16.2L15.6 3.4l3 3L5.8 19.2z"/><path d="M18.8 13.5s-2.4 2.8-2.4 4.4a2.4 2.4 0 0 0 4.8 0c0-1.6-2.4-4.4-2.4-4.4z"/>',
    cc: '<rect x="2.5" y="5" width="19" height="14" rx="3" ' + S + ' stroke-width="2"/><path d="M10.6 10.1a2.4 2.4 0 1 0 0 3.8M17.2 10.1a2.4 2.4 0 1 0 0 3.8" ' + S + ' stroke-width="1.8"/>',
    text: '<rect x="3.5" y="3" width="17" height="18" rx="2.5" ' + S + ' stroke-width="2"/><path d="M7.5 8h9M7.5 12h9M7.5 16h5.5" ' + S + ' stroke-width="1.9"/>',
    bell: '<path d="M12 2.8a1.4 1.4 0 0 1 1.4 1.4v.6a6 6 0 0 1 4.6 5.8v4.2l1.8 2.7H4.2L6 14.8v-4.2a6 6 0 0 1 4.6-5.8v-.6A1.4 1.4 0 0 1 12 2.8z"/><path d="M9.6 19h4.8a2.4 2.4 0 0 1-4.8 0z"/>',
    up: '<path d="M12 5l7 8h-4.5v6h-5v-6H5z"/>',
    down: '<path d="M12 19l-7-8h4.5V5h5v6H19z"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="11" rx="2.4"/><path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9" ' + S + ' stroke-width="2"/>'
  };
  window.ICONS = I;
  window.icon = function (name, cls) {
    return '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">' + (I[name] || I.bottle) + '</svg>';
  };
})();

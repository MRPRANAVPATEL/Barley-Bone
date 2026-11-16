/* ==========================================================================
   Barley & Bone — frontend demo
   Modules: data & illustration, products/filter/cart, overlays, search,
   smooth anchors, reveal + split text, scroll-linked motion (rAF), magnetic
   buttons, count-up, newsletter. Everything here is simulated in the browser.
   ========================================================================== */
(() => {
  'use strict';
  window.__bb = true;

  /* Set to true once real photos are in assets/images (see assets/images/README.md). */
  const USE_PHOTOS = false;

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
  const money = (n) => '$' + n.toLocaleString('en-US');
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reduced = () => mqReduce.matches;

  /* ---------- catalogue (demo data) ---------- */
  const CATS = {
    walk: { label: 'Walk' },
    rest: { label: 'Rest' },
    play: { label: 'Play' },
    feed: { label: 'Feed' },
  };

  const PRODUCTS = [
    { id: 'p1', name: 'Field Lead', cat: 'walk', price: 68, badge: 'New', tone: 'green', material: 'Waxed cotton, solid brass', art: 'leash', tint: 't-y' },
    { id: 'p2', name: 'Harvest Collar', cat: 'walk', price: 54, badge: 'Bestseller', tone: 'yellow', material: 'Vegetable-tanned leather', art: 'collar', tint: 't-g' },
    { id: 'p3', name: 'The Hearth Bed', cat: 'rest', price: 210, badge: 'Limited', tone: 'red', material: 'Washed linen, wool fill', art: 'bed', tint: 't-r' },
    { id: 'p4', name: 'Hillside Throw', cat: 'rest', price: 96, badge: null, tone: '', material: 'Merino blend, hand-fringed', art: 'blanket', tint: 't-b' },
    { id: 'p5', name: 'Orchard Ball', cat: 'play', price: 24, badge: 'New', tone: 'green', material: 'Natural rubber', art: 'ball', tint: 't-y' },
    { id: 'p6', name: 'Knotted Rope', cat: 'play', price: 32, badge: null, tone: '', material: 'Organic cotton', art: 'rope', tint: 't-g' },
    { id: 'p7', name: 'Stoneware Bowl', cat: 'feed', price: 48, badge: 'Restocked', tone: 'blue', material: 'Hand-glazed stoneware', art: 'bowl', tint: 't-oat' },
    { id: 'p8', name: 'Pocket Bowl', cat: 'feed', price: 36, badge: null, tone: '', material: 'Food-grade silicone, folds flat', art: 'bowl2', tint: 't-b' },
  ];
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  /* ---------- original line-art illustrations ---------- */
  const SVG_ATTR = 'xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"';
  const ART = {
    dog: {
      vb: '0 0 600 750',
      par: 'xMidYMax slice',
      d: `<circle class="acc" cx="330" cy="360" r="236"/>
        <path d="M60 706H540" stroke-dasharray="2 10"/>
        <path class="fillp" stroke="none" d="M338 178C286 192 268 268 298 326C332 304 350 244 346 200Z"/>
        <path pathLength="1" style="--k:0" d="M322 704C296 714 246 714 214 700C190 640 208 540 232 452C252 382 282 320 300 262C295 190 340 150 395 160C440 168 470 205 468 255C472 276 524 284 536 304C546 322 530 340 505 342C482 346 470 352 462 366C454 408 426 436 422 478C418 540 426 620 416 700C440 706 470 706 482 698"/>
        <path pathLength="1" style="--k:1" d="M232 690C236 610 270 566 330 566C372 566 398 592 402 640"/>
        <path pathLength="1" style="--k:2" d="M208 640C150 660 110 620 118 556"/>
        <path pathLength="1" style="--k:3" d="M338 178C286 192 268 268 298 326C332 304 350 244 346 200Z"/>
        <path pathLength="1" style="--k:4" class="collar" stroke-width="10" d="M298 330C342 356 410 354 454 334"/>
        <path pathLength="1" style="--k:5" d="M470 322C490 326 500 334 505 342"/>
        <circle class="dog-fade" cx="388" cy="374" r="15" fill="var(--paper)"/>
        <circle class="dog-fade" cx="428" cy="232" r="7" fill="currentColor" stroke="none"/>
        <ellipse class="dog-fade" cx="530" cy="306" rx="12" ry="9" fill="currentColor" stroke="none"/>`,
    },
    leash: {
      vb: '0 0 400 500',
      d: `<circle class="acc" cx="236" cy="262" r="150"/>
        <rect x="110" y="86" width="170" height="86" rx="43"/>
        <path d="M150 172C150 292 262 262 238 420"/>
        <path d="M190 172C190 300 304 268 280 420"/>
        <rect x="224" y="416" width="70" height="52" rx="10"/>
        <circle cx="259" cy="442" r="9"/>
        <path d="M130 129H260" stroke-dasharray="2 9"/>`,
    },
    collar: {
      vb: '0 0 400 500',
      d: `<circle class="acc" cx="214" cy="260" r="150"/>
        <ellipse cx="200" cy="230" rx="128" ry="104"/>
        <ellipse cx="200" cy="230" rx="104" ry="80"/>
        <rect x="172" y="116" width="56" height="30" rx="6"/>
        <path d="M200 334V370"/>
        <circle cx="200" cy="404" r="34"/>
        <circle cx="200" cy="404" r="8" fill="currentColor"/>`,
    },
    bed: {
      vb: '0 0 400 500',
      d: `<ellipse class="acc" cx="214" cy="300" rx="170" ry="110"/>
        <path d="M52 270V332C52 410 348 410 348 332V270"/>
        <ellipse cx="200" cy="270" rx="148" ry="84"/>
        <ellipse cx="200" cy="274" rx="100" ry="52" stroke-dasharray="3 9"/>
        <path d="M140 250C170 226 232 226 262 250"/>`,
    },
    blanket: {
      vb: '0 0 400 500',
      d: `<rect class="acc" x="62" y="140" width="300" height="290" rx="6"/>
        <path d="M40 120H340V400H40Z"/>
        <path d="M40 160H340M40 176H340M40 332H340M40 348H340"/>
        <path d="M52 400v26M82 400v26M112 400v26M142 400v26M172 400v26M202 400v26M232 400v26M262 400v26M292 400v26M322 400v26"/>
        <path d="M340 120l-34 38V120"/>`,
    },
    ball: {
      vb: '0 0 400 500',
      d: `<circle class="acc" cx="214" cy="274" r="150"/>
        <circle cx="200" cy="250" r="118"/>
        <path d="M96 190C150 230 150 290 100 330"/>
        <path d="M304 190C250 230 250 290 300 330"/>
        <path d="M60 420C130 450 270 450 340 420" stroke-dasharray="2 10"/>`,
    },
    rope: {
      vb: '0 0 400 500',
      d: `<circle class="acc" cx="210" cy="270" r="150"/>
        <path d="M112 118C222 178 142 280 240 330C290 356 300 390 300 404" stroke-width="30"/>
        <path class="tint-stroke" d="M112 118C222 178 142 280 240 330C290 356 300 390 300 404" stroke="var(--t)" stroke-width="23"/>
        <path d="M112 118C222 178 142 280 240 330C290 356 300 390 300 404" stroke-width="23" stroke-dasharray="3 17" stroke-linecap="butt"/>
        <circle class="tint" cx="108" cy="114" r="26"/>
        <circle class="tint" cx="304" cy="408" r="26"/>`,
    },
    bowl: {
      vb: '0 0 400 500',
      d: `<ellipse class="acc" cx="214" cy="300" rx="150" ry="120"/>
        <ellipse cx="200" cy="200" rx="140" ry="34"/>
        <path d="M60 200C60 330 120 400 200 400C280 400 340 330 340 200"/>
        <path d="M150 400L142 436H258L250 400"/>
        <path d="M82 262C150 296 250 296 318 262"/>`,
    },
    bowl2: {
      vb: '0 0 400 500',
      d: `<ellipse class="acc" cx="214" cy="290" rx="150" ry="100"/>
        <ellipse cx="200" cy="230" rx="150" ry="52"/>
        <path d="M50 230L92 360C100 386 300 386 308 360L350 230"/>
        <path d="M112 262L128 368M200 282V386M288 262L272 368"/>
        <ellipse cx="200" cy="364" rx="104" ry="20"/>`,
    },
  };
  const art = (key) => {
    const a = ART[key];
    return `<svg class="art" viewBox="${a.vb}" preserveAspectRatio="${a.par || 'xMidYMid meet'}" ${SVG_ATTR}>${a.d}</svg>`;
  };

  /* ---------- overlays: toast, scroll lock, focus ---------- */
  const toastEl = $('[data-toast]');
  let toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('is-on'), 2800);
  }

  const root = document.documentElement;
  function lockScroll(on) {
    if (on) {
      const sbw = window.innerWidth - root.clientWidth;
      root.style.paddingRight = sbw > 0 ? sbw + 'px' : '';
      root.classList.add('is-locked');
    } else {
      root.classList.remove('is-locked');
      root.style.paddingRight = '';
    }
  }

  const scrim = $('[data-scrim]');
  const header = $('[data-header]');
  const OVERLAYS = {
    search: { el: $('#search'), scrim: true, ms: 760 },
    cart: { el: $('#cart'), scrim: true, ms: 760 },
    menu: { el: $('#menu'), scrim: false, ms: 860 },
  };
  let activeOverlay = null;
  let lastTrigger = null;

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function openOverlay(name, trigger) {
    const o = OVERLAYS[name];
    if (!o || !o.el) return;
    if (activeOverlay && activeOverlay !== name) closeOverlay(true);
    activeOverlay = name;
    lastTrigger = trigger || document.activeElement;
    clearTimeout(o.timer);

    if (name === 'menu') {
      const bottom = header ? header.getBoundingClientRect().bottom : 68;
      o.el.style.setProperty('--menu-top', Math.max(bottom, 0) + 'px');
      const burger = $('.burger');
      if (burger) { burger.setAttribute('aria-expanded', 'true'); burger.setAttribute('aria-label', 'Close menu'); }
    }

    o.el.hidden = false;
    if (o.scrim && scrim) { scrim.hidden = false; }
    void o.el.offsetWidth;
    o.el.classList.add('is-open');
    if (o.scrim && scrim) scrim.classList.add('is-open');
    lockScroll(true);

    const focusTarget = name === 'search' ? $('#searchInput') : $(FOCUSABLE, o.el);
    setTimeout(() => focusTarget && focusTarget.focus({ preventScroll: true }), reduced() ? 0 : 120);
    if (name === 'search') renderSearch('');
    if (name === 'cart') renderCart();
  }

  function closeOverlay(immediate) {
    if (!activeOverlay) return;
    const name = activeOverlay;
    const o = OVERLAYS[name];
    activeOverlay = null;
    o.el.classList.remove('is-open');
    if (scrim) scrim.classList.remove('is-open');
    lockScroll(false);
    if (name === 'menu') {
      const burger = $('.burger');
      if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.setAttribute('aria-label', 'Open menu'); }
    }
    const done = () => {
      if (!o.el.classList.contains('is-open')) o.el.hidden = true;
      if (scrim && !scrim.classList.contains('is-open')) scrim.hidden = true;
    };
    clearTimeout(o.timer);
    if (reduced() || immediate) done(); else o.timer = setTimeout(done, o.ms);
    if (!immediate && lastTrigger && lastTrigger.focus) lastTrigger.focus({ preventScroll: true });
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      const name = opener.dataset.open;
      if (name === 'menu' && activeOverlay === 'menu') closeOverlay(); else openOverlay(name, opener);
      return;
    }
    if (e.target.closest('[data-close]')) closeOverlay();
  });
  if (scrim) scrim.addEventListener('click', () => closeOverlay());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeOverlay) { closeOverlay(); return; }
    if (e.key === '/' && !activeOverlay && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault();
      openOverlay('search', document.activeElement);
      return;
    }
    if (e.key === 'Tab' && activeOverlay) {
      const el = OVERLAYS[activeOverlay].el;
      const items = $$(FOCUSABLE, el).filter((n) => n.offsetParent !== null || n === document.activeElement);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* Close the mobile menu if the viewport grows past the breakpoint */
  window.matchMedia('(min-width: 900px)').addEventListener('change', (e) => {
    if (e.matches && activeOverlay === 'menu') closeOverlay(true);
  });

  /* ---------- illustrations & optional photography ---------- */
  function renderArt() {
    $$('[data-art]').forEach((slot) => {
      slot.innerHTML = slot.dataset.art.split(',').map((k) => art(k.trim())).join('');
      if (USE_PHOTOS && slot.dataset.photo) {
        const img = new Image();
        img.alt = slot.dataset.alt || '';
        img.decoding = 'async';
        img.loading = 'lazy';
        img.onload = () => slot.appendChild(img);
        img.src = 'assets/images/' + slot.dataset.photo;
      }
    });
  }

  /* ---------- products, filtering ---------- */
  const grid = $('#productGrid');
  const statusEl = $('#shopStatus');
  let activeCat = 'all';

  function productCard(p, i) {
    return `
      <article class="prod ${p.tint}" data-cat="${p.cat}" data-id="${p.id}" style="--off:${i % 2}">
        <div class="prod__in" data-reveal data-d="${(i % 4) * 90}">
          <div class="prod__media">
            <div class="prod__img prod__img--a">${art(p.art)}</div>
            <div class="prod__img prod__img--b" aria-hidden="true">${art(p.art)}</div>
            ${p.badge ? `<span class="badge badge--${p.tone}">${p.badge}</span>` : ''}
            <button class="prod__add" type="button" data-add="${p.id}" aria-label="Quick add ${p.name} to bag, ${money(p.price)}">
              <svg class="i" aria-hidden="true"><use href="#i-plus"/></svg><span>Quick add</span>
            </button>
          </div>
          <div class="prod__info">
            <div>
              <h3 class="prod__name">${p.name}</h3>
              <p class="prod__mat mono">${p.material}</p>
            </div>
            <p class="prod__price">${money(p.price)}</p>
          </div>
        </div>
      </article>`;
  }

  function renderProducts() {
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(productCard).join('');
  }

  const filterWrap = $('.filters');
  const indicator = $('.filters__ind');

  function moveIndicator() {
    if (!filterWrap || !indicator) return;
    const active = $('.filter.is-active', filterWrap);
    if (!active) return;
    indicator.style.setProperty('--x', active.offsetLeft + 'px');
    indicator.style.setProperty('--w', active.offsetWidth);
  }

  function applyFilter(cat) {
    activeCat = cat;
    $$('.filter').forEach((b) => {
      const on = b.dataset.cat === cat;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    moveIndicator();

    const cards = $$('.prod', grid);
    const keep = cards.filter((c) => cat === 'all' || c.dataset.cat === cat);
    const drop = cards.filter((c) => !keep.includes(c));

    drop.forEach((c) => { if (!c.hidden) c.classList.add('is-out'); });

    const swap = () => {
      drop.forEach((c) => { c.hidden = true; });
      keep.forEach((c, i) => {
        const wasHidden = c.hidden;
        c.hidden = false;
        c.style.setProperty('--off', String(i % 2));
        if (wasHidden) c.classList.add('is-out');
      });
      void grid.offsetWidth;
      keep.forEach((c, i) => {
        c.style.transitionDelay = reduced() ? '0ms' : i * 70 + 'ms';
        c.classList.remove('is-out');
        setTimeout(() => { c.style.transitionDelay = ''; }, 1000);
      });
      // cards revealed by a filter should never be stuck in their pre-reveal state
      keep.forEach((c) => { const inner = $('.prod__in', c); if (inner) inner.classList.add('is-in'); });
    };
    if (reduced()) swap(); else setTimeout(swap, 300);

    if (statusEl) {
      statusEl.textContent = `Showing ${keep.length} of ${PRODUCTS.length} pieces` + (cat === 'all' ? '' : ` — ${CATS[cat].label.toLowerCase()}`);
    }
  }

  if (filterWrap) {
    filterWrap.addEventListener('click', (e) => {
      const b = e.target.closest('.filter');
      if (b) applyFilter(b.dataset.cat);
    });
    window.addEventListener('resize', moveIndicator);
  }

  /* Collection tiles set the filter, then the smooth-anchor handler scrolls to #shop */
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-filter]');
    if (t) applyFilter(t.dataset.filter);
  });

  /* ---------- bag (simulated) ---------- */
  const cart = new Map();
  const bagBtn = $('.bag-btn');
  const countEl = $('[data-cart-count]');
  const cartList = $('#cartList');
  const subtotalEl = $('#cartSubtotal');
  const checkoutBtn = $('#checkoutBtn');

  const cartCount = () => Array.from(cart.values()).reduce((a, b) => a + b, 0);
  const cartTotal = () => Array.from(cart.entries()).reduce((sum, [id, q]) => sum + byId(id).price * q, 0);

  function updateBag(bump) {
    const n = cartCount();
    if (countEl) countEl.textContent = String(n);
    if (bagBtn) {
      bagBtn.classList.toggle('has-items', n > 0);
      bagBtn.setAttribute('aria-label', `Open bag, ${n} ${n === 1 ? 'item' : 'items'}`);
      if (bump) {
        bagBtn.classList.remove('is-bump');
        void bagBtn.offsetWidth;
        bagBtn.classList.add('is-bump');
      }
    }
    if (subtotalEl) subtotalEl.textContent = money(cartTotal());
    if (checkoutBtn) checkoutBtn.disabled = n === 0;
    if (activeOverlay === 'cart') renderCart();
  }

  function renderCart() {
    if (!cartList) return;
    if (!cart.size) {
      cartList.innerHTML = '<li class="cart__empty">Your bag is empty. Add something from the shop and it will appear here.</li>';
      return;
    }
    cartList.innerHTML = Array.from(cart.entries()).map(([id, q]) => {
      const p = byId(id);
      return `
        <li class="cart__item ${p.tint}" data-id="${id}">
          <div class="cart__thumb">${art(p.art)}</div>
          <div>
            <p class="cart__name">${p.name}</p>
            <p class="cart__mat">${p.material}</p>
            <div class="qty" role="group" aria-label="Quantity for ${p.name}">
              <button type="button" data-qty="-1" aria-label="Decrease quantity"><svg class="i" aria-hidden="true"><use href="#i-minus"/></svg></button>
              <span aria-live="polite">${q}</span>
              <button type="button" data-qty="1" aria-label="Increase quantity"><svg class="i" aria-hidden="true"><use href="#i-plus"/></svg></button>
            </div>
          </div>
          <p class="cart__price">${money(p.price * q)}</p>
        </li>`;
    }).join('');
  }

  function addToCart(id) {
    cart.set(id, (cart.get(id) || 0) + 1);
    updateBag(true);
  }

  document.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const p = byId(add.dataset.add);
      addToCart(p.id);
      const label = $('span', add);
      add.classList.add('is-added');
      if (label) label.textContent = 'Added';
      clearTimeout(add._t);
      add._t = setTimeout(() => { add.classList.remove('is-added'); if (label) label.textContent = 'Quick add'; }, 1600);
      toast(`${p.name} added to bag (demo)`);
      return;
    }
    const q = e.target.closest('[data-qty]');
    if (q) {
      const id = q.closest('.cart__item').dataset.id;
      const next = (cart.get(id) || 0) + Number(q.dataset.qty);
      if (next <= 0) cart.delete(id); else cart.set(id, next);
      updateBag(false);
    }
  });

  if (checkoutBtn) checkoutBtn.addEventListener('click', () => toast('Checkout is not connected — this is a design demo.'));

  /* ---------- search (simulated) ---------- */
  const searchInput = $('#searchInput');
  const searchResults = $('#searchResults');

  function renderSearch(raw) {
    if (!searchResults) return;
    const q = raw.trim().toLowerCase();
    searchResults.textContent = '';
    if (!q) return;
    const hits = PRODUCTS.filter((p) =>
      [p.name, p.material, CATS[p.cat].label, p.badge || ''].join(' ').toLowerCase().includes(q));
    if (!hits.length) {
      const li = document.createElement('li');
      li.className = 'search__empty';
      li.textContent = `Nothing matches “${raw.trim()}”. Try “bed”, “ball” or “leash”.`;
      searchResults.appendChild(li);
      return;
    }
    searchResults.innerHTML = hits.map((p) => `
      <li>
        <button class="result ${p.tint}" type="button" data-goto="${p.id}">
          <span class="result__thumb">${art(p.art)}</span>
          <span>
            <span class="result__name">${p.name}</span>
            <span class="result__meta">${CATS[p.cat].label} · ${money(p.price)}</span>
          </span>
        </button>
      </li>`).join('');
  }

  if (searchInput) searchInput.addEventListener('input', () => renderSearch(searchInput.value));

  document.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-suggest]');
    if (chip && searchInput) {
      searchInput.value = chip.dataset.suggest;
      renderSearch(searchInput.value);
      searchInput.focus();
      return;
    }
    const go = e.target.closest('[data-goto]');
    if (go) {
      const id = go.dataset.goto;
      closeOverlay(true);
      applyFilter('all');
      setTimeout(() => {
        const card = $(`.prod[data-id="${id}"]`);
        if (!card) return;
        scrollToY(card.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 40);
        card.classList.add('is-ping');
        setTimeout(() => card.classList.remove('is-ping'), 2600);
      }, reduced() ? 0 : 340);
    }
  });

  /* ---------- smooth scrolling ---------- */
  let scrollAnim = null;
  function cancelScroll() { if (scrollAnim) { cancelAnimationFrame(scrollAnim); scrollAnim = null; } }
  ['wheel', 'touchstart', 'mousedown'].forEach((ev) => window.addEventListener(ev, cancelScroll, { passive: true }));

  function scrollToY(y) {
    cancelScroll();
    const start = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    const target = clamp(y, 0, max);
    const dist = target - start;
    if (reduced() || Math.abs(dist) < 2) { window.scrollTo(0, target); return; }
    const dur = clamp(500 + Math.abs(dist) * 0.3, 800, 1700);
    let t0 = null;
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const p = clamp((ts - t0) / dur, 0, 1);
      window.scrollTo(0, start + dist * easeInOut(p));
      scrollAnim = p < 1 ? requestAnimationFrame(step) : null;
    };
    scrollAnim = requestAnimationFrame(step);
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');

    if (href === '#') {
      e.preventDefault();
      if (a.hasAttribute('data-demo')) toast('Demo link — this page isn’t part of the homepage build.');
      return;
    }
    const target = href === '#top' ? document.body : $(href);
    if (!target) return;
    e.preventDefault();
    if (activeOverlay) closeOverlay(true);
    const y = href === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - header.offsetHeight + 1;
    // wait a frame so a just-released scroll lock doesn't swallow the jump
    requestAnimationFrame(() => scrollToY(y));
    try { history.pushState(null, '', href); } catch (err) { /* file:// — ignore */ }
    if (href !== '#top') {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  /* ---------- announcement rotator ---------- */
  function initAnnounce() {
    const items = $$('.announce__item');
    if (items.length < 2) return;
    let i = 0;
    setInterval(() => {
      if (reduced() || document.hidden) return;
      const cur = items[i];
      i = (i + 1) % items.length;
      const next = items[i];
      cur.classList.remove('is-active');
      cur.classList.add('is-leaving');
      next.classList.remove('is-leaving');
      next.style.transition = 'none';
      next.style.transform = 'translateY(100%)';
      void next.offsetWidth;
      next.style.transition = '';
      next.style.transform = '';
      next.classList.add('is-active');
      setTimeout(() => cur.classList.remove('is-leaving'), 900);
    }, 4600);
  }

  /* ---------- header state (IntersectionObserver, no scroll listener) ---------- */
  function initHeader() {
    const s = $('[data-sentinel]');
    if (!s || !header || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(([en]) => header.classList.toggle('is-stuck', !en.isIntersecting)).observe(s);
  }

  /* ---------- text splitting ---------- */
  function wrapWords(el, wrapClass, innerClass) {
    let i = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span');
            w.className = wrapClass;
            if (innerClass) {
              const inner = document.createElement('span');
              inner.className = innerClass;
              inner.style.setProperty('--i', String(i));
              inner.textContent = part;
              w.appendChild(inner);
            } else {
              w.textContent = part;
            }
            i += 1;
            frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    };
    walk(el);
    return i;
  }

  function initSplit() {
    $$('.split').forEach((el) => wrapWords(el, 'w', 'w__i'));
    $$('[data-lit]').forEach((el) => wrapWords(el, 'lw'));
  }

  /* ---------- reveal on scroll (IntersectionObserver) ---------- */
  function countUp(el) {
    const target = Number(el.dataset.count);
    if (reduced()) { el.textContent = target.toLocaleString('en-US'); return; }
    const dur = 1800;
    let t0 = null;
    const step = (ts) => {
      if (t0 === null) t0 = ts;
      const p = clamp((ts - t0) / dur, 0, 1);
      el.textContent = Math.round(target * easeOutExpo(p)).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(step);
    };
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  /* Line-draw for the dog illustration: sweeps each outline path in turn. */
  function drawPaths(frame) {
    if (reduced() || !frame.animate) return;
    $$('[pathLength]', frame).forEach((path, i) => {
      path.animate(
        [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
        { duration: 2400, delay: 600 + i * 260, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'both' }
      );
    });
  }

  function initReveal() {
    const els = $$('[data-reveal], .split, .frame, .val, .ticker, .panel-reveal, .footer__mark, [data-count]');
    if (reduced() || !('IntersectionObserver' in window)) {
      els.forEach((el) => { el.classList.add('is-in'); if (el.dataset.count) countUp(el); });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        el.classList.add('is-in');
        if (el.dataset.count) countUp(el);
        if (el.classList.contains('draw')) drawPaths(el);
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => {
      if (el.dataset.d) el.style.setProperty('--d', el.dataset.d);
      io.observe(el);
    });
  }

  /* ---------- scroll-linked motion: one rAF loop that only runs while something is on screen ---------- */
  function initScrollFx() {
    if (reduced() || !('IntersectionObserver' in window)) {
      $$('.lw').forEach((w) => w.classList.add('on'));
      return;
    }
    const jobs = [];

    $$('[data-parallax]').forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0;
      const scale = parseFloat(el.dataset.scale) || 1;
      jobs.push({
        el, ref: el.parentElement,
        update(rect, vh) {
          const c = rect.top + rect.height / 2 - vh / 2;
          el.style.transform = `translate3d(0, ${(-c * speed).toFixed(1)}px, 0) scale(${scale})`;
        },
      });
    });

    $$('[data-drift]').forEach((el) => {
      const speed = parseFloat(el.dataset.drift) || 0;
      jobs.push({
        el, ref: el.closest('section'),
        update(rect, vh) {
          const p = clamp((vh - rect.top) / (vh + rect.height), 0, 1);
          const x = (p - 0.5) * speed * window.innerWidth;
          el.style.transform = `translate3d(${x.toFixed(1)}px, 0, 0)`;
        },
      });
    });

    $$('[data-lit]').forEach((el) => {
      const words = $$('.lw', el);
      let lastOn = -1;
      jobs.push({
        el, ref: el,
        update(rect, vh) {
          const p = clamp((vh * 0.88 - rect.top) / (vh * 0.55 + rect.height * 0.35), 0, 1);
          const on = Math.round(p * words.length);
          if (on === lastOn) return;
          words.forEach((w, i) => w.classList.toggle('on', i < on));
          lastOn = on;
        },
      });
    });

    const active = new Set();
    let running = false;
    let lastY = -1;
    let lastW = -1;

    const tick = () => {
      if (!active.size) { running = false; return; }
      const y = window.scrollY;
      const w = window.innerWidth;
      if (y !== lastY || w !== lastW) {
        lastY = y; lastW = w;
        const vh = window.innerHeight;
        active.forEach((job) => job.update(job.ref.getBoundingClientRect(), vh));
      }
      requestAnimationFrame(tick);
    };
    const start = () => { if (!running) { running = true; lastY = -1; requestAnimationFrame(tick); } };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const job = jobs.find((j) => j.ref === en.target);
        if (!job) return;
        const group = jobs.filter((j) => j.ref === en.target);
        group.forEach((j) => (en.isIntersecting ? active.add(j) : active.delete(j)));
      });
      if (active.size) start();
    }, { rootMargin: '25% 0px 25% 0px' });
    new Set(jobs.map((j) => j.ref)).forEach((r) => io.observe(r));
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    if (!mqFine.matches) return;
    $$('[data-magnetic]').forEach((btn) => {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null;
      const loop = () => {
        cx = lerp(cx, tx, 0.18);
        cy = lerp(cy, ty, 0.18);
        btn.style.setProperty('--mx', cx.toFixed(2) + 'px');
        btn.style.setProperty('--my', cy.toFixed(2) + 'px');
        if (Math.abs(cx - tx) > 0.1 || Math.abs(cy - ty) > 0.1) raf = requestAnimationFrame(loop);
        else raf = null;
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
      btn.addEventListener('pointermove', (e) => {
        if (reduced()) return;
        const r = btn.getBoundingClientRect();
        tx = (e.clientX - (r.left + r.width / 2)) * 0.28;
        ty = (e.clientY - (r.top + r.height / 2)) * 0.34;
        kick();
      });
      btn.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });
    });
  }

  /* ---------- values: tap-to-open on touch ---------- */
  function initValues() {
    $$('.val').forEach((v) => {
      v.addEventListener('click', () => v.classList.toggle('is-open'));
      v.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); v.classList.toggle('is-open'); }
      });
    });
  }

  /* ---------- newsletter (frontend validation only) ---------- */
  function initNewsletter() {
    const form = $('#newsletterForm');
    const input = $('#nlEmail');
    const msg = $('#nlMsg');
    const ok = $('#nlOk');
    if (!form || !input || !msg || !ok) return;
    const valid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

    const setError = (text) => {
      form.classList.add('has-error');
      input.setAttribute('aria-invalid', 'true');
      msg.textContent = text;
    };
    const clearError = () => {
      form.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      msg.textContent = '';
    };

    input.addEventListener('input', () => { if (form.classList.contains('has-error') && valid(input.value.trim())) clearError(); });
    input.addEventListener('blur', () => {
      const v = input.value.trim();
      if (v && !valid(v)) setError('That doesn’t look like an email address — check for typos.');
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = input.value.trim();
      if (!v) { setError('Please enter your email address.'); input.focus(); return; }
      if (!valid(v)) { setError('That doesn’t look like an email address — check for typos.'); input.focus(); return; }
      clearError();
      const btn = $('button[type="submit"]', form);
      const label = $('.btn__t', btn);
      btn.disabled = true;
      if (label) label.textContent = 'Subscribing…';
      setTimeout(() => {
        form.hidden = true;
        ok.hidden = false;
        ok.focus({ preventScroll: true });
        toast('Subscribed (demo — nothing was sent).');
      }, reduced() ? 0 : 900);
    });
  }

  /* ---------- boot ---------- */
  function init() {
    renderArt();
    renderProducts();
    initSplit();
    initHeader();
    initAnnounce();
    initMagnetic();
    initValues();
    initNewsletter();
    updateBag(false);
    moveIndicator();

    const fontsReady = document.fonts && document.fonts.ready
      ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))])
      : Promise.resolve();

    fontsReady.then(() => {
      moveIndicator();
      document.body.classList.add('is-loaded');
      initReveal();
      initScrollFx();
    });

    window.addEventListener('resize', moveIndicator);
    mqReduce.addEventListener('change', () => { if (mqReduce.matches) $$('.lw').forEach((w) => w.classList.add('on')); });
  }

  init();
})();

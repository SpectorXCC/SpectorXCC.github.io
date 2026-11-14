(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var DEG = Math.PI / 180;
  var PI6 = [0, 2, 1, 0, 2, 1];
  var OPTS = [4, 6, 8, 10, 12, 16];
  var NEAR_Q = { 4: 6, 6: 9, 8: 9, 10: 12, 12: 15, 16: 18 };
  var QOPTS = [
    { m: 0, short: '近极槽', txt: '近极槽配合 (如8极9槽·10极12槽)' },
    { m: 3, short: '1.5× (Q=3p)', txt: '1.5× 极数 (Q=3p)' },
    { m: 6, short: '3× (Q=6p)', txt: '3× 极数 (Q=6p)' }
  ];

  function $(id) {
    return document.getElementById(id);
  }

  function svgEl(tag, attrs, parent) {
    var node = document.createElementNS(NS, tag);
    for (var k in attrs) {
      node.setAttribute(k, attrs[k]);
    }
    if (parent) parent.appendChild(node);
    return node;
  }

  function pt(r, deg) {
    var rad = deg * DEG;
    return (r * Math.cos(rad)).toFixed(2) + ' ' + (r * Math.sin(rad)).toFixed(2);
  }

  function arc(r, a, b) {
    return 'M' + pt(r, a) + 'A' + r + ' ' + r + ' 0 0 1 ' + pt(r, b);
  }

  var splash = $('pmsm-splash');
  var stage = $('pmsm-stage');
  var dockSlot = $('pmsm-dock-slot');
  var widget = $('pmsm-widget');
  var gl = $('pmsm-gl');
  var st = $('pmsm-st');
  var fa = $('pmsm-fa');
  var ro = $('pmsm-ro');
  if (!stage || !dockSlot || !gl || !st || !fa || !ro) return;

  var splashMeta = $('pmsm-splash-meta');
  var cardReadout = $('pmsm-card-readout');
  var cardSpec = $('pmsm-card-spec');
  var skipBtn = $('pmsm-skip-btn');
  var pauseBtn = $('pmsm-pause-btn');
  var sel = $('pmsm-sel');
  var qsel = $('pmsm-qsel');
  var rpmIn = $('pmsm-acc');
  var rpmV = $('pmsm-accv');

  var root = document.documentElement;
  var headerEl = document.querySelector('header.header');
  var siteHome = document.querySelector('.site-home');
  var footerEl = document.querySelector('footer.footer');
  var topLink = $('top-link');
  var bgTargets = [headerEl, siteHome, footerEl, topLink].filter(Boolean);

  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = reduceQuery.matches;
  if (reduceQuery.addEventListener) {
    reduceQuery.addEventListener('change', function (e) {
      reduce = e.matches;
    });
  }

  // Initial motor preset requested by user: 6 poles, 1.5x (Q=3p), 135 rpm
  var curN = 6;
  var qMult = 3;
  var targetRpm = 135;
  var p = 3;
  var Q = 9;
  var stepDeg = 120;
  var bars = [];
  var glow = [];
  var dots = [];
  var fm = [];
  var btns = [];
  var qBtns = [];

  var t = 0;
  var last = 0;
  var phi = 0;
  var shown = '';
  var rafId = 0;
  var paused = false;
  var inView = true;
  var docked = false;
  var dockingStarted = false;

  function setBackgroundInert(flag) {
    for (var i = 0; i < bgTargets.length; i++) {
      if (flag) {
        bgTargets[i].setAttribute('inert', '');
      } else {
        bgTargets[i].removeAttribute('inert');
      }
    }
  }

  function build(n, m) {
    p = n / 2;
    Q = m ? m * p : NEAR_Q[n];
    stepDeg = 360 * p / Q;
    bars = [];
    glow = [];
    dots = [];
    fm = [];
    gl.textContent = '';
    st.textContent = '';
    fa.textContent = '';
    ro.textContent = '';

    var bw = Math.min(4.6, 122 / Q);
    for (var k = 0; k < Q; k++) {
      var a = (k * 360 / Q) * DEG;
      var c = Math.cos(a);
      var s = Math.sin(a);
      var x1 = (54 * c).toFixed(2);
      var y1 = (54 * s).toFixed(2);
      glow.push(svgEl('line', { x1: x1, y1: y1, 'stroke-width': (bw * 2.1).toFixed(2), 'stroke-linecap': 'round' }, gl));
      bars.push(svgEl('line', { x1: x1, y1: y1, 'stroke-width': bw.toFixed(2), 'stroke-linecap': 'round' }, st));
      var d = svgEl('circle', { cx: (100 * c).toFixed(2), cy: (100 * s).toFixed(2), r: 2.4 }, st);
      var sec = Math.round((k * stepDeg) / 60) % 6;
      d.style.fill = 'var(--pmsm-p' + PI6[sec] + ')';
      dots.push(d);
    }

    var h = 26 / p;
    for (var j = 0; j < p; j++) {
      var mEl = svgEl('path', { d: arc(110, -h, h), fill: 'none', 'stroke-width': 3, 'stroke-linecap': 'round' }, fa);
      mEl.style.stroke = 'var(--pmsm-n)';
      fm.push(mEl);
    }

    svgEl('circle', { r: 23, style: 'fill:var(--pmsm-core);stroke:var(--pmsm-line)', 'stroke-width': 1 }, ro);
    var L = 110 / p;
    var w = Math.min(12, 0.38 * L);
    var span = (0.8 * L - w) / 35 / DEG;
    for (var i = 0; i < n; i++) {
      var c0 = i * 180 / p;
      var q = svgEl('path', { d: arc(35, c0 - span / 2, c0 + span / 2), fill: 'none', 'stroke-width': w.toFixed(2), 'stroke-linecap': 'round' }, ro);
      q.style.stroke = i % 2 ? 'var(--pmsm-n)' : 'var(--pmsm-s)';
    }
  }

  function syncSpec() {
    var qObj = QOPTS.find(function (item) { return item.m === qMult; }) || QOPTS[1];
    if (cardSpec) {
      cardSpec.textContent = curN + ' 极 · ' + qObj.short + ' · 目标 ' + targetRpm + ' r/min';
    }
  }

  function syncAria() {
    btns.forEach(function (b, i) {
      b.setAttribute('aria-pressed', OPTS[i] === curN ? 'true' : 'false');
    });
    qBtns.forEach(function (b, i) {
      b.setAttribute('aria-pressed', QOPTS[i].m === qMult ? 'true' : 'false');
    });
    syncSpec();
  }

  function pickPole(n) {
    curN = n;
    build(curN, qMult);
    t = 0;
    phi = 0;
    shown = '';
    syncAria();
    renderFrame(0);
  }

  function pickQ(m) {
    qMult = m;
    build(curN, qMult);
    shown = '';
    syncAria();
    renderFrame(0);
  }

  if (sel) {
    OPTS.forEach(function (n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = n + ' 极';
      b.addEventListener('click', function () { pickPole(n); });
      sel.appendChild(b);
      btns.push(b);
    });
  }

  if (qsel) {
    QOPTS.forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = o.txt;
      b.addEventListener('click', function () { pickQ(o.m); });
      qsel.appendChild(b);
      qBtns.push(b);
    });
  }

  if (rpmIn) {
    rpmIn.value = String(targetRpm);
    if (rpmV) rpmV.textContent = targetRpm + ' r/min';
    rpmIn.addEventListener('input', function () {
      targetRpm = parseInt(rpmIn.value, 10) || 135;
      if (rpmV) rpmV.textContent = targetRpm + ' r/min';
      shown = '';
      syncSpec();
    });
  }

  if (pauseBtn) {
    pauseBtn.addEventListener('click', function () {
      paused = !paused;
      pauseBtn.textContent = paused ? '继续' : '暂停';
      pauseBtn.setAttribute('aria-label', paused ? '继续电机转动' : '暂停电机转动');
      if (paused) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      } else {
        last = 0;
        ensureLoop();
      }
    });
  }

  function renderFrame(dt) {
    t += dt;
    var ramp = reduce ? 0.25 : 1 - Math.exp(-t / 1.35);
    phi = (phi + dt * targetRpm * p * ramp) % 360;
    var thF = phi / p;
    var lag = (32 + 80 * Math.exp(-t / 1.1) + 12 * Math.sin(t * 7) * Math.exp(-t / 1.8) + (reduce ? 0 : 3 * Math.sin(t * 1.1))) / p;

    for (var k = 0; k < Q; k++) {
      var cur = Math.cos((phi - stepDeg * k) * DEG);
      var m = Math.abs(cur);
      var a = (k * 360 / Q) * DEG;
      var r2 = 59 + 30 * Math.pow(m, 1.15);
      var x = (r2 * Math.cos(a)).toFixed(2);
      var y = (r2 * Math.sin(a)).toFixed(2);
      var col = cur > 0 ? 'var(--pmsm-n)' : 'var(--pmsm-s)';
      var op = (0.3 + 0.7 * m).toFixed(2);

      bars[k].setAttribute('x2', x);
      bars[k].setAttribute('y2', y);
      bars[k].style.stroke = col;
      bars[k].style.opacity = op;

      glow[k].setAttribute('x2', x);
      glow[k].setAttribute('y2', y);
      glow[k].style.stroke = col;
      glow[k].style.opacity = op;

      dots[k].style.opacity = (0.18 + 0.82 * m).toFixed(2);
      dots[k].setAttribute('r', (1.7 + 1.5 * m).toFixed(2));
    }

    for (var j = 0; j < p; j++) {
      fm[j].setAttribute('transform', 'rotate(' + (thF + j * 360 / p).toFixed(2) + ')');
    }
    ro.setAttribute('transform', 'rotate(' + (thF - lag).toFixed(2) + ')');

    var rpm = Math.round(targetRpm * ramp / 5) * 5;
    var txt = rpm + ' r/min · ' + curN + '极 ' + Q + '齿';
    if (txt !== shown) {
      shown = txt;
      if (splashMeta && !docked) splashMeta.textContent = txt;
      if (cardReadout) cardReadout.textContent = txt;
    }
  }

  function frame(ts) {
    rafId = 0;
    if (paused || document.hidden || (docked && !inView)) return;
    var dt = last ? Math.min((ts - last) / 1000, 0.05) : 0;
    last = ts;
    renderFrame(dt);
    rafId = requestAnimationFrame(frame);
  }

  function ensureLoop() {
    if (!rafId && !paused && !document.hidden && (!docked || inView)) {
      last = 0;
      rafId = requestAnimationFrame(frame);
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    } else {
      ensureLoop();
    }
  });

  if (widget && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      if (inView) {
        ensureLoop();
      } else if (docked && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }, { threshold: 0.05 });
    observer.observe(widget);
  }

  function finishDock(restoreFocus, flyAnim) {
    dockSlot.appendChild(stage);
    stage.style.cssText = '';
    if (flyAnim) flyAnim.cancel();
    dockSlot.classList.add('is-filled');
    if (widget) widget.setAttribute('data-docked', 'true');
    docked = true;
    setBackgroundInert(false);
    root.classList.remove('pmsm-loading');
    if (splash) {
      splash.hidden = true;
      splash.remove();
    }
    if (restoreFocus && pauseBtn) {
      pauseBtn.focus({ preventScroll: true });
    }
    ensureLoop();
  }

  function flyToDock(viaKeyboard) {
    if (dockingStarted || docked) return;
    dockingStarted = true;

    var hadSkipFocus = Boolean(viaKeyboard || (skipBtn && document.activeElement === skipBtn));
    var first = stage.getBoundingClientRect();
    var lastRect = dockSlot.getBoundingClientRect();

    if (reduce || !splash || lastRect.width < 10 || typeof stage.animate !== 'function') {
      finishDock(hadSkipFocus);
      return;
    }

    // Keep SVG rasterized at large initial size during flight so it stays razor sharp while shrinking
    stage.style.position = 'fixed';
    stage.style.left = first.left + 'px';
    stage.style.top = first.top + 'px';
    stage.style.width = first.width + 'px';
    stage.style.height = first.height + 'px';
    stage.style.margin = '0';
    stage.style.zIndex = '901';
    stage.style.pointerEvents = 'none';
    stage.style.transformOrigin = 'center center';
    document.body.appendChild(stage);

    splash.classList.add('is-docking');

    var dx = (lastRect.left + lastRect.width / 2) - (first.left + first.width / 2);
    var dy = (lastRect.top + lastRect.height / 2) - (first.top + first.height / 2);
    var scale = lastRect.width / first.width;

    var flyAnim = stage.animate(
      [
        { transform: 'translate3d(0px, 0px, 0) scale(1)' },
        { transform: 'translate3d(' + dx.toFixed(2) + 'px, ' + dy.toFixed(2) + 'px, 0) scale(' + scale.toFixed(4) + ')' }
      ],
      {
        duration: 720,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards'
      }
    );

    Promise.race([
      Promise.allSettled([flyAnim.finished]),
      new Promise(function (resolve) { setTimeout(resolve, 900); })
    ]).then(function () {
      finishDock(hadSkipFocus, flyAnim);
    });
  }

  // Initialize motor geometry with 6 poles, 1.5x (Q=3p), 135 r/min
  build(curN, qMult);
  syncAria();
  renderFrame(0);

  if (!root.classList.contains('pmsm-loading') || !splash) {
    finishDock(false);
    return;
  }

  setBackgroundInert(true);
  ensureLoop();

  var resolvedSkip = false;
  var resolveSkip;
  var skipPromise = new Promise(function (resolve) {
    resolveSkip = resolve;
  });

  function triggerSkip(viaKeyboard) {
    if (resolvedSkip || dockingStarted) return;
    resolvedSkip = true;
    resolveSkip(Boolean(viaKeyboard));
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', function () {
      triggerSkip(false);
    });
  }

  splash.addEventListener('click', function (e) {
    if (e.target === splash || e.target === stage || stage.contains(e.target)) {
      triggerSkip(false);
    }
  });

  function onKeyDown(e) {
    if (e.key === 'Escape' && !dockingStarted) {
      e.preventDefault();
      triggerSkip(true);
    }
  }
  document.addEventListener('keydown', onKeyDown);

  var loadDone = document.readyState === 'complete'
    ? Promise.resolve()
    : new Promise(function (resolve) {
        window.addEventListener('load', resolve, { once: true });
      });

  var fontsDone = (document.fonts && document.fonts.ready)
    ? document.fonts.ready
    : Promise.resolve();

  var pageReady = Promise.race([
    Promise.all([loadDone, fontsDone]),
    new Promise(function (resolve) { setTimeout(resolve, 2500); })
  ]);

  var minSpin = new Promise(function (resolve) {
    setTimeout(resolve, 1050);
  });

  Promise.race([
    Promise.all([pageReady, minSpin]).then(function () { return false; }),
    skipPromise
  ]).then(function (viaKeyboard) {
    document.removeEventListener('keydown', onKeyDown);
    flyToDock(viaKeyboard);
  });

  window.addEventListener('pageshow', function (e) {
    if (e.persisted && docked) {
      ensureLoop();
    }
  });
})();

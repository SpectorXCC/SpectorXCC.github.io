(function () {
  'use strict';

  var plaques = document.querySelectorAll('.work-logo-plaque[data-hover-animate]');
  if (!plaques.length) return;

  var reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotionQuery.matches) return;

  var svgCache = {};
  var svgInFlight = {};

  function preloadSvg(url) {
    if (!url || svgCache[url] || svgInFlight[url]) {
      return svgInFlight[url] || Promise.resolve(svgCache[url]);
    }
    svgInFlight[url] = fetch(url, { credentials: 'same-origin' })
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load SVG');
        return res.text();
      })
      .then(function (text) {
        svgCache[url] = text;
        delete svgInFlight[url];
        return text;
      })
      .catch(function () {
        delete svgInFlight[url];
        return null;
      });
    return svgInFlight[url];
  }

  function replayPlaque(plaque) {
    if (reduceMotionQuery.matches) return;
    var img = plaque.querySelector('img[data-animated-src]');
    if (!img) return;
    var animSrc = img.getAttribute('data-animated-src');
    if (!animSrc) return;

    var playFromText = function (svgText) {
      if (!svgText) {
        img.src = animSrc + '?play=' + Date.now();
        return;
      }
      var blob = new Blob([svgText], { type: 'image/svg+xml' });
      var blobUrl = URL.createObjectURL(blob);
      var prevBlobUrl = img._activeBlobUrl;
      img._activeBlobUrl = blobUrl;

      var revokeOld = function () {
        if (prevBlobUrl && prevBlobUrl !== blobUrl) {
          URL.revokeObjectURL(prevBlobUrl);
        }
        img.removeEventListener('load', revokeOld);
      };
      img.addEventListener('load', revokeOld);
      img.src = blobUrl;
    };

    if (svgCache[animSrc]) {
      playFromText(svgCache[animSrc]);
    } else {
      preloadSvg(animSrc).then(playFromText);
    }
  }

  plaques.forEach(function (plaque) {
    var img = plaque.querySelector('img[data-animated-src]');
    if (!img) return;
    var animSrc = img.getAttribute('data-animated-src');
    var armed = true;
    var lastPlayedAt = 0;

    var trigger = function (force) {
      var now = Date.now();
      if (!force && (!armed || now - lastPlayedAt < 450)) return;
      armed = false;
      lastPlayedAt = now;
      replayPlaque(plaque);
    };

    plaque.addEventListener('pointerenter', function (event) {
      if (event.pointerType === 'touch') return;
      trigger(false);
    });

    plaque.addEventListener('pointerleave', function () {
      armed = true;
    });

    plaque.addEventListener('click', function () {
      trigger(true);
    });

    var warm = function () {
      preloadSvg(animSrc);
    };
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(warm, { timeout: 1200 });
    } else {
      setTimeout(warm, 400);
    }
  });
})();

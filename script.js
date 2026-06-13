document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('loaded');
  initCursor();
  initLocoScroll();
  initFilter();
  initCardNav();
  initAboutAnim();
  initProductPage();
});

// ── Custom Cursor ─────────────────────────────────────────────────
function initCursor() {
  var dot = document.createElement('div');
  dot.id = 'cursor-dot';
  var ring = document.createElement('div');
  ring.id = 'cursor-outline';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mx = -100, my = -100, rx = -100, ry = -100;

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function animateRing() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, label, [role="button"], .perfume-item-container, .payment-option, .select-button').forEach(function (el) {
    el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
    el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
  });

  document.addEventListener('mousedown', function () { document.body.classList.add('cursor-clicking'); });
  document.addEventListener('mouseup',   function () { document.body.classList.remove('cursor-clicking'); });
  document.addEventListener('mouseleave', function () { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', function () { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

// ── Locomotive Scroll ─────────────────────────────────────────────
function initLocoScroll() {
  if (typeof LocomotiveScroll === 'undefined') return;

  var exclude = new Set(['cursor-dot', 'cursor-outline', 'cartDrawer', 'cartOverlay']);
  var nav = document.querySelector('.navbar');

  var scroller = document.createElement('div');
  scroller.id = 'scroll-container';
  scroller.setAttribute('data-scroll-container', '');

  Array.from(document.body.children).forEach(function (el) {
    if (!exclude.has(el.id) && el !== nav && !el.classList.contains('cart-toast')) {
      scroller.appendChild(el);
    }
  });

  if (nav) {
    nav.after(scroller);
  } else {
    document.body.appendChild(scroller);
  }

  // Push content below fixed navbar
  var navH = nav ? nav.offsetHeight : 0;
  scroller.style.paddingTop = navH + 'px';

  window.locoScroll = new LocomotiveScroll({
    el: scroller,
    smooth: true,
    lerp: 0.07,
    multiplier: 0.85,
    smartphone: { smooth: false },
    tablet: { smooth: false }
  });

  // Anchor link support
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;
      var target = document.querySelector(href);
      if (target && window.locoScroll) {
        e.preventDefault();
        window.locoScroll.scrollTo(target);
      }
    });
  });

  window.refreshScroll = function () {
    setTimeout(function () {
      if (window.locoScroll) window.locoScroll.update();
    }, 60);
  };
}

// ── Product filter (index only) ───────────────────────────────────
function initFilter() {
  var nav = document.getElementById('filterNav');
  if (!nav) return;

  var tabs      = nav.querySelectorAll('.filter-tab');
  var indicator = nav.querySelector('.filter-indicator');
  var cards     = document.querySelectorAll('.item');

  function moveIndicator(tab) {
    if (!indicator) return;
    indicator.style.left  = tab.offsetLeft + 'px';
    indicator.style.width = tab.offsetWidth - parseInt(getComputedStyle(tab).paddingRight) + 'px';
  }

  // Place indicator on load without transition
  var active = nav.querySelector('.filter-tab.active');
  if (active) {
    indicator.style.transition = 'none';
    moveIndicator(active);
    requestAnimationFrame(function () {
      indicator.style.transition = '';
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');
      moveIndicator(tab);

      var filter = tab.dataset.filter;
      cards.forEach(function (card) {
        card.style.display = (filter === 'all' || card.classList.contains(filter)) ? 'block' : 'none';
      });
      if (window.refreshScroll) window.refreshScroll();
    });
  });

  window.addEventListener('resize', function () {
    var cur = nav.querySelector('.filter-tab.active');
    if (cur) {
      indicator.style.transition = 'none';
      moveIndicator(cur);
      requestAnimationFrame(function () { indicator.style.transition = ''; });
    }
  });
}

// ── Card click-to-navigate (index only) ───────────────────────────
function initCardNav() {
  document.querySelectorAll('.perfume-item-container[data-href]').forEach(function (card) {
    card.addEventListener('click', function (e) {
      if (e.target.classList.contains('add-to-cart-btn')) return;
      window.location.href = card.dataset.href;
    });
  });
}

// ── About us entrance animation ───────────────────────────────────
function initAboutAnim() {
  var el = document.querySelector('.about-us');
  if (el) el.classList.add('show-about-us');
}

// ── Luxury product page ───────────────────────────────────────────
function initProductPage() {
  if (!document.body.dataset.productId) return;

  var infoRight = document.querySelector('.perfume-page-info:last-child');
  var perfumeInfo = document.querySelector('.perfume-info');
  var nameEl = document.querySelector('.perfume-info-name');
  var gridX = document.querySelector('.grid-x');

  // Back link at top of info panel
  if (infoRight) {
    var backLink = document.createElement('a');
    backLink.className = 'product-back-link';
    backLink.href = '../index.html';
    backLink.innerHTML = '&#8592;&nbsp;&nbsp;Collection';
    infoRight.insertBefore(backLink, infoRight.firstChild);
  }

  // Brand eyebrow above product name
  if (nameEl && perfumeInfo) {
    var eyebrow = document.createElement('p');
    eyebrow.className = 'product-eyebrow';
    eyebrow.textContent = 'Parfum Enchanté';
    perfumeInfo.insertBefore(eyebrow, nameEl);
  }

  // Thin rule + "Fragrance Profile" label above accord bars
  if (gridX) {
    var accordLabel = document.createElement('p');
    accordLabel.className = 'accord-label';
    accordLabel.textContent = 'Fragrance Profile';
    var divider = document.createElement('div');
    divider.className = 'product-divider';
    gridX.before(accordLabel);
    accordLabel.before(divider);
  }

  // Animate accord bars from 0 → target width
  var bars = document.querySelectorAll('.accord-bar');
  var targets = [];
  bars.forEach(function (bar) {
    var w = bar.style.width || '100%';
    targets.push(w);
    bar.style.width = '0';
  });

  setTimeout(function () {
    bars.forEach(function (bar, i) {
      setTimeout(function () {
        bar.style.width = targets[i];
      }, i * 70);
    });
  }, 900);

  if (window.refreshScroll) window.refreshScroll();
}

// ── Navbar: hide on scroll-down, reveal on scroll-up ─────────────
(function () {
  var nav = null;
  var lastY = 0;
  var ticking = false;

  document.addEventListener('DOMContentLoaded', function () {
    nav = document.querySelector('.navbar');
    if (!nav) return;

    // Listen on locomotive scroll if available, otherwise window
    var handleScroll = function (y) {
      if (!ticking) {
        requestAnimationFrame(function () {
          if (y > 80) {
            nav.classList.add('nav-scrolled');
            if (y > lastY + 6) {
              nav.classList.add('nav-hidden');
            } else if (y < lastY - 6) {
              nav.classList.remove('nav-hidden');
            }
          } else {
            nav.classList.remove('nav-scrolled', 'nav-hidden');
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    // Hook into locomotive scroll events
    var hookLoco = setInterval(function () {
      if (window.locoScroll) {
        clearInterval(hookLoco);
        window.locoScroll.on('scroll', function (args) {
          handleScroll(args.scroll.y);
        });
      }
    }, 200);

    // Fallback for pages without locomotive scroll active
    window.addEventListener('scroll', function () {
      handleScroll(window.scrollY);
    }, { passive: true });
  });
})();
